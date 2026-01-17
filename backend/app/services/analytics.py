"""
Analytics service - логирование и аналитика активности

Централизованный сервис для:
- Записи активности пользователей
- Получения статистики и метрик
- Агрегации данных для дашборда
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc
from sqlalchemy.dialects.postgresql import insert

from app.models.user_activity import UserActivity, ActivityType
from app.models.user import User
from app.models.order import Order


class AnalyticsService:
    """Сервис аналитики"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # =========================================================================
    # ЛОГИРОВАНИЕ АКТИВНОСТИ
    # =========================================================================
    
    async def log_activity(
        self,
        activity_type: str,
        user_id: Optional[int] = None,
        telegram_id: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        platform: str = "telegram"
    ) -> UserActivity:
        """
        Записать активность пользователя
        
        Args:
            activity_type: Тип активности (см. ActivityType)
            user_id: ID пользователя в БД
            telegram_id: Telegram ID
            details: Детали активности (JSON)
            ip_address: IP адрес
            user_agent: User-Agent браузера
            platform: Платформа (telegram, web, api)
        """
        activity = UserActivity(
            user_id=user_id,
            telegram_id=telegram_id,
            activity_type=activity_type,
            details=details or {},
            ip_address=ip_address,
            user_agent=user_agent,
            platform=platform
        )
        
        self.db.add(activity)
        await self.db.flush()
        
        return activity
    
    async def log_search(
        self,
        user_id: Optional[int],
        telegram_id: Optional[int],
        search_type: str,  # "bin", "ocr", "text"
        query: str,
        firmware_id: Optional[int] = None,
        found: bool = False,
        platform: str = "telegram"
    ):
        """Залогировать поиск прошивки"""
        activity_type = {
            "bin": ActivityType.SEARCH_BIN,
            "ocr": ActivityType.SEARCH_SCREENSHOT,
            "text": ActivityType.SEARCH_TEXT
        }.get(search_type, ActivityType.SEARCH_TEXT)
        
        return await self.log_activity(
            activity_type=activity_type,
            user_id=user_id,
            telegram_id=telegram_id,
            details={
                "query": query,
                "firmware_id": firmware_id,
                "found": found
            },
            platform=platform
        )
    
    async def log_order(
        self,
        user_id: int,
        telegram_id: int,
        order_id: int,
        firmware_id: int,
        stage: str,
        price: float,
        status: str = "created"
    ):
        """Залогировать заказ"""
        activity_type = {
            "created": ActivityType.ORDER_CREATED,
            "paid": ActivityType.ORDER_PAID,
            "completed": ActivityType.ORDER_COMPLETED
        }.get(status, ActivityType.ORDER_CREATED)
        
        return await self.log_activity(
            activity_type=activity_type,
            user_id=user_id,
            telegram_id=telegram_id,
            details={
                "order_id": order_id,
                "firmware_id": firmware_id,
                "stage": stage,
                "price": price
            },
            platform="telegram"
        )
    
    async def log_download(
        self,
        user_id: int,
        telegram_id: int,
        firmware_id: int,
        s3_key: str
    ):
        """Залогировать скачивание файла"""
        return await self.log_activity(
            activity_type=ActivityType.FILE_DOWNLOAD,
            user_id=user_id,
            telegram_id=telegram_id,
            details={
                "firmware_id": firmware_id,
                "s3_key": s3_key
            },
            platform="telegram"
        )
    
    async def log_balance_deposit(
        self,
        user_id: int,
        telegram_id: int,
        amount: float,
        method: str = "unknown"
    ):
        """Залогировать пополнение баланса"""
        return await self.log_activity(
            activity_type=ActivityType.BALANCE_DEPOSIT,
            user_id=user_id,
            telegram_id=telegram_id,
            details={
                "amount": amount,
                "method": method
            },
            platform="telegram"
        )
    
    async def log_guest_upload(
        self,
        guest_id: str,
        filename: str,
        file_size: int,
        ip_address: Optional[str] = None
    ):
        """Залогировать загрузку гостем"""
        return await self.log_activity(
            activity_type=ActivityType.GUEST_UPLOAD,
            user_id=None,
            telegram_id=None,
            details={
                "guest_id": guest_id,
                "filename": filename,
                "file_size": file_size
            },
            ip_address=ip_address,
            platform="telegram"
        )
    
    # =========================================================================
    # ПОЛУЧЕНИЕ СТАТИСТИКИ
    # =========================================================================
    
    async def get_activity_stats(
        self,
        days: int = 30,
        activity_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Получить статистику активности за период
        
        Returns:
            {
                "total": 1234,
                "by_type": {"search_bin": 500, "order_created": 100, ...},
                "by_day": [{"date": "2026-01-15", "count": 50}, ...]
            }
        """
        since = datetime.utcnow() - timedelta(days=days)
        
        # Базовый запрос
        base_query = select(UserActivity).where(UserActivity.created_at >= since)
        if activity_type:
            base_query = base_query.where(UserActivity.activity_type == activity_type)
        
        # Общее количество
        total_query = select(func.count(UserActivity.id)).where(UserActivity.created_at >= since)
        if activity_type:
            total_query = total_query.where(UserActivity.activity_type == activity_type)
        result = await self.db.execute(total_query)
        total = result.scalar() or 0
        
        # По типам
        type_query = select(
            UserActivity.activity_type,
            func.count(UserActivity.id).label("count")
        ).where(
            UserActivity.created_at >= since
        ).group_by(UserActivity.activity_type)
        
        result = await self.db.execute(type_query)
        by_type = {row.activity_type: row.count for row in result.fetchall()}
        
        # По дням
        day_query = select(
            func.date(UserActivity.created_at).label("date"),
            func.count(UserActivity.id).label("count")
        ).where(
            UserActivity.created_at >= since
        ).group_by(
            func.date(UserActivity.created_at)
        ).order_by(func.date(UserActivity.created_at))
        
        result = await self.db.execute(day_query)
        by_day = [{"date": str(row.date), "count": row.count} for row in result.fetchall()]
        
        return {
            "total": total,
            "by_type": by_type,
            "by_day": by_day,
            "period_days": days
        }
    
    async def get_search_stats(self, days: int = 30) -> Dict[str, Any]:
        """Статистика поисков"""
        since = datetime.utcnow() - timedelta(days=days)
        
        # Поиски по типам
        search_types = [ActivityType.SEARCH_BIN, ActivityType.SEARCH_SCREENSHOT, ActivityType.SEARCH_TEXT]
        
        type_query = select(
            UserActivity.activity_type,
            func.count(UserActivity.id).label("count")
        ).where(
            and_(
                UserActivity.created_at >= since,
                UserActivity.activity_type.in_(search_types)
            )
        ).group_by(UserActivity.activity_type)
        
        result = await self.db.execute(type_query)
        by_type = {row.activity_type: row.count for row in result.fetchall()}
        
        # Успешные vs неуспешные (из details.found)
        # Это сложнее с JSONB, упростим
        total_searches = sum(by_type.values())
        
        return {
            "total": total_searches,
            "by_type": by_type,
            "bin_searches": by_type.get(ActivityType.SEARCH_BIN, 0),
            "ocr_searches": by_type.get(ActivityType.SEARCH_SCREENSHOT, 0),
            "text_searches": by_type.get(ActivityType.SEARCH_TEXT, 0),
            "period_days": days
        }
    
    async def get_conversion_stats(self, days: int = 30) -> Dict[str, Any]:
        """Статистика конверсии поиск → покупка"""
        since = datetime.utcnow() - timedelta(days=days)
        
        # Количество поисков
        search_types = [ActivityType.SEARCH_BIN, ActivityType.SEARCH_SCREENSHOT, ActivityType.SEARCH_TEXT]
        search_query = select(func.count(UserActivity.id)).where(
            and_(
                UserActivity.created_at >= since,
                UserActivity.activity_type.in_(search_types)
            )
        )
        result = await self.db.execute(search_query)
        total_searches = result.scalar() or 0
        
        # Количество заказов
        order_query = select(func.count(UserActivity.id)).where(
            and_(
                UserActivity.created_at >= since,
                UserActivity.activity_type == ActivityType.ORDER_CREATED
            )
        )
        result = await self.db.execute(order_query)
        total_orders = result.scalar() or 0
        
        # Количество оплаченных
        paid_query = select(func.count(UserActivity.id)).where(
            and_(
                UserActivity.created_at >= since,
                UserActivity.activity_type == ActivityType.ORDER_PAID
            )
        )
        result = await self.db.execute(paid_query)
        total_paid = result.scalar() or 0
        
        # Конверсии
        search_to_order = (total_orders / total_searches * 100) if total_searches > 0 else 0
        order_to_paid = (total_paid / total_orders * 100) if total_orders > 0 else 0
        
        return {
            "total_searches": total_searches,
            "total_orders": total_orders,
            "total_paid": total_paid,
            "search_to_order_rate": round(search_to_order, 2),
            "order_to_paid_rate": round(order_to_paid, 2),
            "period_days": days
        }
    
    async def get_top_firmwares(self, days: int = 30, limit: int = 10) -> List[Dict[str, Any]]:
        """Топ популярных прошивок по поискам"""
        since = datetime.utcnow() - timedelta(days=days)
        
        # Извлекаем firmware_id из details JSONB
        query = select(
            UserActivity.details['firmware_id'].astext.label('firmware_id'),
            func.count(UserActivity.id).label('count')
        ).where(
            and_(
                UserActivity.created_at >= since,
                UserActivity.details['firmware_id'].isnot(None)
            )
        ).group_by(
            UserActivity.details['firmware_id']
        ).order_by(
            desc(func.count(UserActivity.id))
        ).limit(limit)
        
        result = await self.db.execute(query)
        return [{"firmware_id": int(row.firmware_id), "searches": row.count} for row in result.fetchall() if row.firmware_id]
    
    async def get_active_users_count(self, days: int = 7) -> int:
        """Количество активных пользователей за период"""
        since = datetime.utcnow() - timedelta(days=days)
        
        query = select(func.count(func.distinct(UserActivity.user_id))).where(
            and_(
                UserActivity.created_at >= since,
                UserActivity.user_id.isnot(None)
            )
        )
        result = await self.db.execute(query)
        return result.scalar() or 0
    
    async def get_dashboard_summary(self) -> Dict[str, Any]:
        """Сводка для дашборда админки"""
        # Пользователи
        users_query = select(func.count(User.id))
        result = await self.db.execute(users_query)
        total_users = result.scalar() or 0
        
        # Активные за 7 дней
        active_7d = await self.get_active_users_count(days=7)
        
        # Заказы за сегодня
        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        orders_today_query = select(func.count(Order.id)).where(Order.created_at >= today)
        result = await self.db.execute(orders_today_query)
        orders_today = result.scalar() or 0
        
        # Выручка за сегодня
        revenue_today_query = select(func.sum(Order.price)).where(
            and_(
                Order.created_at >= today,
                Order.status == "completed"
            )
        )
        result = await self.db.execute(revenue_today_query)
        revenue_today = float(result.scalar() or 0)
        
        # Конверсия за 30 дней
        conversion = await self.get_conversion_stats(days=30)
        
        return {
            "total_users": total_users,
            "active_users_7d": active_7d,
            "orders_today": orders_today,
            "revenue_today": revenue_today,
            "conversion_rate": conversion["search_to_order_rate"],
            "updated_at": datetime.utcnow().isoformat()
        }


# Фабричная функция для создания сервиса
async def get_analytics_service(db: AsyncSession) -> AnalyticsService:
    return AnalyticsService(db)
