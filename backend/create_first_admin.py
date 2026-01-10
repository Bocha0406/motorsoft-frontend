"""
Создать первого админа в базе данных.

Используй этот скрипт для добавления первого admin пользователя.
"""
import asyncio
from app.core.database import async_session_maker
from app.models.admin_user import AdminUser, AdminRole
from app.core.security import get_password_hash
from loguru import logger


async def create_first_admin():
    """Создать первого админа."""
    
    # Данные первого админа
    username = "admin"
    password = "motorsoft2026"  # ВАЖНО: Сменить после первого входа!
    
    async with async_session_maker() as session:
        # Проверить существует ли уже
        from sqlalchemy import select
        result = await session.execute(
            select(AdminUser).where(AdminUser.username == username)
        )
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            logger.warning(f"Админ '{username}' уже существует!")
            return
        
        # Создать нового админа
        admin = AdminUser(
            username=username,
            password_hash=get_password_hash(password),
            role=AdminRole.ADMIN,
            is_active=True
        )
        
        session.add(admin)
        await session.commit()
        
        logger.success(f"✅ Админ создан!")
        logger.info(f"Username: {username}")
        logger.info(f"Password: {password}")
        logger.warning("⚠️ ОБЯЗАТЕЛЬНО смени пароль после первого входа!")


if __name__ == "__main__":
    asyncio.run(create_first_admin())
