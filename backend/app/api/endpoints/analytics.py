"""
Analytics API endpoints
Статистика и аналитика для админки
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_admin
from app.services.analytics import AnalyticsService, get_analytics_service
from app.models.admin_user import AdminUser

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Сводка для дашборда админки
    
    Returns:
        - total_users: Всего пользователей
        - active_users_7d: Активных за 7 дней
        - orders_today: Заказов сегодня
        - revenue_today: Выручка сегодня
        - conversion_rate: Конверсия поиск → заказ (%)
    """
    service = await get_analytics_service(db)
    return await service.get_dashboard_summary()


@router.get("/activity")
async def get_activity_stats(
    days: int = Query(30, ge=1, le=365, description="Период в днях"),
    activity_type: Optional[str] = Query(None, description="Фильтр по типу активности"),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Статистика активности за период
    
    Returns:
        - total: Всего действий
        - by_type: Разбивка по типам
        - by_day: График по дням
    """
    service = await get_analytics_service(db)
    return await service.get_activity_stats(days=days, activity_type=activity_type)


@router.get("/searches")
async def get_search_stats(
    days: int = Query(30, ge=1, le=365, description="Период в днях"),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Статистика поисков
    
    Returns:
        - total: Всего поисков
        - bin_searches: Поиски по .bin файлам
        - ocr_searches: Поиски по скриншотам (OCR)
        - text_searches: Текстовые поиски
    """
    service = await get_analytics_service(db)
    return await service.get_search_stats(days=days)


@router.get("/conversion")
async def get_conversion_stats(
    days: int = Query(30, ge=1, le=365, description="Период в днях"),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Статистика конверсии
    
    Returns:
        - total_searches: Всего поисков
        - total_orders: Всего заказов
        - total_paid: Оплачено
        - search_to_order_rate: Конверсия поиск → заказ (%)
        - order_to_paid_rate: Конверсия заказ → оплата (%)
    """
    service = await get_analytics_service(db)
    return await service.get_conversion_stats(days=days)


@router.get("/top-firmwares")
async def get_top_firmwares(
    days: int = Query(30, ge=1, le=365, description="Период в днях"),
    limit: int = Query(10, ge=1, le=100, description="Лимит результатов"),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Топ популярных прошивок
    
    Returns:
        - List[{firmware_id, searches}]
    """
    service = await get_analytics_service(db)
    return await service.get_top_firmwares(days=days, limit=limit)


@router.get("/active-users")
async def get_active_users_count(
    days: int = Query(7, ge=1, le=365, description="Период в днях"),
    db: AsyncSession = Depends(get_db),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Количество активных пользователей за период
    """
    service = await get_analytics_service(db)
    count = await service.get_active_users_count(days=days)
    return {"active_users": count, "period_days": days}
