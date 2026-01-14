"""Admin endpoints - управление админ-панелью."""
import os
import shutil
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_admin,
    require_admin_role
)
from app.models.admin_user import AdminUser, AdminRole
from app.models.user import User
from app.models.order import Order
from app.core.config import settings

router = APIRouter(prefix="/admin", tags=["admin"])


# === Pydantic Schemas ===

class LoginRequest(BaseModel):
    """Запрос на вход."""
    username: str
    password: str


class LoginResponse(BaseModel):
    """Ответ с JWT токеном."""
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str


class AdminUserInfo(BaseModel):
    """Информация об админе."""
    id: int
    username: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: datetime | None


class CreateStaffRequest(BaseModel):
    """Запрос на создание сотрудника."""
    username: str
    password: str
    role: str = "operator"  # "admin" или "operator"


class UpdateStaffRequest(BaseModel):
    """Запрос на обновление сотрудника."""
    is_active: Optional[bool] = None
    role: Optional[str] = None
    password: Optional[str] = None


class UserListItem(BaseModel):
    """Элемент списка пользователей."""
    id: int
    telegram_id: int
    username: str | None
    balance: float
    total_purchases: int
    is_blocked: bool
    is_partner: bool = False
    is_slave: bool = False
    coefficient: float = 1.0
    level: str = "newbie"
    created_at: datetime
    last_active: datetime | None


class UpdateUserPartnerRequest(BaseModel):
    """Запрос на обновление партнёрского статуса."""
    is_partner: Optional[bool] = None
    is_slave: Optional[bool] = None
    coefficient: Optional[float] = None  # Ручной коэффициент скидки


class UserStats(BaseModel):
    """Статистика пользователей."""
    total: int
    active_today: int
    active_week: int
    blocked: int
    with_purchases: int


# === Endpoints ===

@router.post("/login", response_model=LoginResponse)
async def admin_login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Вход в админ-панель.
    
    Проверяет username и password, возвращает JWT токен.
    """
    # Найти админа по username
    result = await db.execute(
        select(AdminUser).where(AdminUser.username == data.username)
    )
    admin = result.scalar_one_or_none()
    
    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Обновить last_login
    admin.last_login = datetime.utcnow()
    await db.commit()
    
    # Создать JWT токен
    access_token = create_access_token(
        data={"sub": admin.username, "role": admin.role.value}
    )
    
    return LoginResponse(
        access_token=access_token,
        username=admin.username,
        role=admin.role.value
    )


@router.get("/me", response_model=AdminUserInfo)
async def get_current_admin_info(
    current_admin: AdminUser = Depends(get_current_admin)
):
    """
    Получить информацию о текущем авторизованном админе.
    """
    return AdminUserInfo(
        id=current_admin.id,
        username=current_admin.username,
        role=current_admin.role.value,
        is_active=current_admin.is_active,
        created_at=current_admin.created_at,
        last_login=current_admin.last_login
    )


# === STAFF MANAGEMENT ===

@router.get("/staff", response_model=List[AdminUserInfo])
async def get_staff_list(
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список всех сотрудников (админов и операторов).
    
    Только для ADMIN роли.
    """
    result = await db.execute(
        select(AdminUser).order_by(AdminUser.created_at.desc())
    )
    staff = result.scalars().all()
    
    return [
        AdminUserInfo(
            id=s.id,
            username=s.username,
            role=s.role.value,
            is_active=s.is_active,
            created_at=s.created_at,
            last_login=s.last_login
        )
        for s in staff
    ]


@router.post("/staff", response_model=AdminUserInfo)
async def create_staff(
    data: CreateStaffRequest,
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Создать нового сотрудника (оператора или админа).
    
    Только для ADMIN роли.
    """
    # Проверить уникальность username
    existing = await db.execute(
        select(AdminUser).where(AdminUser.username == data.username)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Определить роль
    role = AdminRole.ADMIN if data.role.lower() == "admin" else AdminRole.OPERATOR
    
    # Создать сотрудника
    new_staff = AdminUser(
        username=data.username,
        password_hash=get_password_hash(data.password),
        role=role,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.add(new_staff)
    await db.commit()
    await db.refresh(new_staff)
    
    return AdminUserInfo(
        id=new_staff.id,
        username=new_staff.username,
        role=new_staff.role.value,
        is_active=new_staff.is_active,
        created_at=new_staff.created_at,
        last_login=new_staff.last_login
    )


@router.patch("/staff/{staff_id}")
async def update_staff(
    staff_id: int,
    data: UpdateStaffRequest,
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Обновить сотрудника (активность, роль, пароль).
    
    Только для ADMIN роли.
    """
    result = await db.execute(
        select(AdminUser).where(AdminUser.id == staff_id)
    )
    staff = result.scalar_one_or_none()
    
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Нельзя редактировать себя
    if staff.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot modify your own account"
        )
    
    # Обновить поля
    if data.is_active is not None:
        staff.is_active = data.is_active
    
    if data.role is not None:
        staff.role = AdminRole.ADMIN if data.role.lower() == "admin" else AdminRole.OPERATOR
    
    if data.password is not None:
        staff.password_hash = get_password_hash(data.password)
    
    await db.commit()
    
    return {"success": True, "staff_id": staff_id}


@router.delete("/staff/{staff_id}")
async def delete_staff(
    staff_id: int,
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Удалить сотрудника.
    
    Только для ADMIN роли.
    """
    result = await db.execute(
        select(AdminUser).where(AdminUser.id == staff_id)
    )
    staff = result.scalar_one_or_none()
    
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Нельзя удалить себя
    if staff.id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )
    
    await db.delete(staff)
    await db.commit()
    
    return {"success": True, "deleted_staff_id": staff_id}


@router.get("/users", response_model=List[UserListItem])
async def get_users_list(
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    blocked: bool | None = None,
    activity: str | None = None,  # "active", "inactive", "dead"
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список пользователей бота.
    
    Параметры:
    - skip: количество записей для пропуска
    - limit: максимальное количество записей
    - search: поиск по username
    - blocked: фильтр по is_blocked (True/False/None)
    - activity: "active" (за 7 дней), "inactive" (7-30 дней), "dead" (>30 дней)
    """
    query = select(User)
    
    # Фильтр по поиску
    if search:
        query = query.where(
            or_(
                User.username.ilike(f"%{search}%"),
                func.cast(User.telegram_id, str).like(f"%{search}%")
            )
        )
    
    # Фильтр по блокировке
    if blocked is not None:
        query = query.where(User.is_blocked == blocked)
    
    # Фильтр по активности
    if activity:
        now = datetime.utcnow()
        if activity == "active":
            # Были активны за последние 7 дней
            week_ago = now - timedelta(days=7)
            query = query.where(User.last_active >= week_ago)
        elif activity == "inactive":
            # Не были активны 7-30 дней
            week_ago = now - timedelta(days=7)
            month_ago = now - timedelta(days=30)
            query = query.where(
                or_(
                    User.last_active < week_ago,
                    User.last_active.is_(None)
                )
            ).where(
                or_(
                    User.last_active >= month_ago,
                    User.last_active.is_(None)
                )
            )
        elif activity == "dead":
            # Не были активны более 30 дней (мёртвые)
            month_ago = now - timedelta(days=30)
            query = query.where(
                or_(
                    User.last_active < month_ago,
                    User.last_active.is_(None)
                )
            )
    
    # Сортировка и пагинация
    query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    return [
        UserListItem(
            id=user.id,
            telegram_id=user.telegram_id,
            username=user.username,
            balance=user.balance or 0.0,
            total_purchases=user.total_purchases or 0,
            is_blocked=user.is_blocked or False,
            is_partner=user.is_partner or False,
            is_slave=user.is_slave or False,
            coefficient=user.coefficient or 1.0,
            level=user.level or "newbie",
            created_at=user.created_at,
            last_active=user.last_active
        )
        for user in users
    ]


@router.get("/users/stats", response_model=UserStats)
async def get_users_stats(
    current_admin: AdminUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить статистику по пользователям.
    """
    # Общее количество
    total_result = await db.execute(select(func.count(User.id)))
    total = total_result.scalar()
    
    # Активные сегодня
    today = datetime.utcnow().date()
    active_today_result = await db.execute(
        select(func.count(User.id)).where(
            func.date(User.last_active) == today
        )
    )
    active_today = active_today_result.scalar()
    
    # Активные за неделю
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_week_result = await db.execute(
        select(func.count(User.id)).where(
            User.last_active >= week_ago
        )
    )
    active_week = active_week_result.scalar()
    
    # Заблокированные
    blocked_result = await db.execute(
        select(func.count(User.id)).where(User.is_blocked == True)
    )
    blocked = blocked_result.scalar()
    
    # С покупками
    with_purchases_result = await db.execute(
        select(func.count(User.id)).where(User.total_purchases > 0)
    )
    with_purchases = with_purchases_result.scalar()
    
    return UserStats(
        total=total,
        active_today=active_today,
        active_week=active_week,
        blocked=blocked,
        with_purchases=with_purchases
    )


@router.patch("/users/{user_id}/block")
async def block_user(
    user_id: int,
    blocked: bool,
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Заблокировать/разблокировать пользователя.
    
    Только для ADMIN роли.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_blocked = blocked
    await db.commit()
    
    return {"success": True, "user_id": user_id, "is_blocked": blocked}


@router.patch("/users/{user_id}/partner")
async def update_user_partner_status(
    user_id: int,
    data: UpdateUserPartnerRequest,
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Обновить партнёрский статус пользователя.
    
    - is_partner: сделать партнёром (скидка 40%)
    - is_slave: отметить как Slave-прибор
    - coefficient: установить ручной коэффициент скидки (0.5 = 50% скидка)
    
    Только для ADMIN роли.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Обновляем поля
    if data.is_partner is not None:
        user.is_partner = data.is_partner
        if data.is_partner:
            user.level = "partner"
            # Партнёр получает 40% скидку по умолчанию
            if data.coefficient is None:
                user.coefficient = 0.6
    
    if data.is_slave is not None:
        user.is_slave = data.is_slave
    
    if data.coefficient is not None:
        # Проверка валидности коэффициента (0.1 - 1.0)
        if data.coefficient < 0.1 or data.coefficient > 1.0:
            raise HTTPException(
                status_code=400,
                detail="Коэффициент должен быть от 0.1 до 1.0"
            )
        user.coefficient = data.coefficient
    
    await db.commit()
    
    discount = int((1 - float(user.coefficient)) * 100)
    
    return {
        "success": True,
        "user_id": user_id,
        "is_partner": user.is_partner,
        "is_slave": user.is_slave,
        "coefficient": user.coefficient,
        "discount_percent": discount,
        "level": user.level
    }


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_admin: AdminUser = Depends(require_admin_role),
    db: AsyncSession = Depends(get_db)
):
    """
    Удалить пользователя (мёртвый аккаунт).
    
    Только для ADMIN роли.
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.delete(user)
    await db.commit()
    
    return {"success": True, "deleted_user_id": user_id}


# === ORDERS ===

@router.get("/orders")
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Получить список заказов с фильтрацией по статусу.
    """
    query = select(Order).offset(skip).limit(limit)
    
    if status:
        query = query.where(Order.status == status)
    
    query = query.order_by(Order.created_at.desc())
    
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return {
        "items": [
            {
                "id": o.id,
                "user_id": o.user_id,
                "firmware_id": o.firmware_id,
                "status": o.status,
                "amount": float(o.price) if o.price else 0.0,
                "created_at": o.created_at.isoformat() if o.created_at else None
            }
            for o in orders
        ]
    }


# === FIRMWARES (Yandex Object Storage) ===

from app.services.s3_storage import s3_storage


@router.post("/firmwares/upload")
async def upload_firmware(
    file: UploadFile = File(...),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Загрузить файл прошивки в Yandex Object Storage.
    
    Принимает .bin и .hex файлы.
    Сохраняет в Yandex Cloud S3.
    """
    # Проверка расширения
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    ext = file.filename.lower().split('.')[-1]
    if ext not in ['bin', 'hex']:
        raise HTTPException(
            status_code=400,
            detail="Only .bin and .hex files are allowed"
        )
    
    # Загрузить в Yandex Object Storage
    result = s3_storage.upload_file(
        file_obj=file.file,
        filename=file.filename,
        content_type='application/octet-stream'
    )
    
    if not result['success']:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload to S3: {result.get('error', 'Unknown error')}"
        )
    
    return {
        "success": True,
        "key": result['key'],
        "filename": result['filename'],
        "size": result['size'],
        "bucket": result['bucket'],
        "uploaded_by": admin.username,
        "uploaded_at": result['uploaded_at']
    }


@router.get("/firmwares")
async def list_uploaded_firmwares(
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Получить список загруженных файлов прошивок из Yandex Object Storage.
    """
    files = s3_storage.list_files(prefix='firmwares/')
    
    return {"items": files}


@router.get("/firmwares/download-url/{key:path}")
async def get_firmware_download_url(
    key: str,
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Получить временную ссылку на скачивание прошивки.
    
    Presigned URL действует 1 час.
    """
    url = s3_storage.generate_download_url(key, expires_in=3600)
    
    if not url:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {"url": url, "expires_in": 3600}

