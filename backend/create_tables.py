"""
Скрипт для создания таблиц в базе данных
"""
import asyncio
from app.core.database import engine, Base
from app.models.user import User
from app.models.firmware import Firmware
from app.models.order import Order
from app.models.transaction import Transaction
from app.models.admin_user import AdminUser
from loguru import logger


async def create_tables():
    """Создать все таблицы в базе данных"""
    logger.info("Создание таблиц в базе данных...")
    
    async with engine.begin() as conn:
        # Удалить все таблицы (если нужно пересоздать)
        # await conn.run_sync(Base.metadata.drop_all)
        
        # Создать все таблицы
        await conn.run_sync(Base.metadata.create_all)
    
    logger.success("Таблицы успешно созданы!")


if __name__ == "__main__":
    asyncio.run(create_tables())
