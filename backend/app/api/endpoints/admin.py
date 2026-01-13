"""Admin endpoints - управление админ-панелью."""
import os
import shutil
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import (
    verify_password,
    create_access_token,
    get_current_admin,
    require_admin_role
)
from app.models.admin_user import AdminUser, AdminRole
from app.models.user import User
from app.models.order import Order
from app.core.config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"])


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


class UserListItem(BaseModel):
    """Элемент списка пользователей."""
    id: int
    telegram_id: int
    username: str | None
    balance: float
    total_purchases: int
    is_blocked: bool
    created_at: datetime
    last_active: datetime | None


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


@router.get("/users", response_model=List[UserListItem])
async def get_users_list(
    skip: int = 0,
    limit: int = 100,
    search: str | None = None,
    blocked: bool | None = None,
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
    
    # Сортировка и пагинация
    query = query.order_by(User.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    return [
        UserListItem(
            id=user.id,
            telegram_id=user.telegram_id,
            username=user.username,
            balance=user.balance,
            total_purchases=user.total_purchases,
            is_blocked=user.is_blocked,
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

