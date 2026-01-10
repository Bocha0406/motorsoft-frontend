"""Security utilities - JWT tokens, password hashing."""
from datetime import datetime, timedelta
from typing import Optional
import hashlib
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.admin_user import AdminUser, AdminRole
from sqlalchemy import select

# HTTP Bearer для JWT токенов
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверить пароль."""
    # Простое хеширование SHA256
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password


def get_password_hash(password: str) -> str:
    """Захешировать пароль."""
    # Простое хеширование SHA256
    return hashlib.sha256(password.encode()).hexdigest()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Создать JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Декодировать JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> AdminUser:
    """
    Dependency для получения текущего авторизованного админа.
    Проверяет JWT токен и возвращает AdminUser из БД.
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    # Получить админа из БД
    result = await db.execute(
        select(AdminUser).where(AdminUser.username == username, AdminUser.is_active == True)
    )
    admin = result.scalar_one_or_none()
    
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return admin


async def require_admin_role(
    current_admin: AdminUser = Depends(get_current_admin)
) -> AdminUser:
    """
    Dependency для проверки роли ADMIN.
    Используй для эндпоинтов, доступных только для полных администраторов.
    """
    if current_admin.role != AdminRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin role required."
        )
    
    return current_admin
