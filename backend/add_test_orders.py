#!/usr/bin/env python3
"""
Добавить тестовые заказы в БД для демонстрации админ-панели
"""
import asyncio
from datetime import datetime, timedelta
from sqlalchemy import insert, text
from app.core.database import engine, async_session_maker
from app.models.order import Order
from loguru import logger


async def add_test_orders():
    """Добавить тестовые заказы"""
    logger.info("Добавление тестовых заказов...")
    
    async with async_session_maker() as session:
        # Проверить, есть ли уже заказы
        result = await session.execute(text("SELECT COUNT(*) FROM orders"))
        count = result.scalar()
        
        if count > 0:
            logger.warning(f"В БД уже есть {count} заказов. Пропуск.")
            return
        
        # Создать тестовые заказы
        orders = [
            {
                'user_id': 1,
                'firmware_id': 1,
                'status': 'pending',
                'amount': 15000,
                'created_at': datetime.now() - timedelta(hours=2)
            },
            {
                'user_id': 2,
                'firmware_id': 3,
                'status': 'completed',
                'amount': 20000,
                'created_at': datetime.now() - timedelta(days=1)
            },
            {
                'user_id': 1,
                'firmware_id': 5,
                'status': 'pending',
                'amount': 10000,
                'created_at': datetime.now() - timedelta(hours=6)
            },
            {
                'user_id': 2,
                'firmware_id': 2,
                'status': 'completed',
                'amount': 25000,
                'created_at': datetime.now() - timedelta(days=3)
            },
            {
                'user_id': 1,
                'firmware_id': 4,
                'status': 'cancelled',
                'amount': 8000,
                'created_at': datetime.now() - timedelta(days=2)
            },
            {
                'user_id': 2,
                'firmware_id': 6,
                'status': 'pending',
                'amount': 12000,
                'created_at': datetime.now() - timedelta(hours=1)
            },
        ]
        
        stmt = insert(Order).values(orders)
        await session.execute(stmt)
        await session.commit()
        
        logger.success(f"✓ Добавлено {len(orders)} тестовых заказов")


if __name__ == "__main__":
    asyncio.run(add_test_orders())
