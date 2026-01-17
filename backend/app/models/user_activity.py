"""
UserActivity model - логирование действий пользователей

Отслеживаем:
- Поиски прошивок (bin/screenshot)
- Покупки
- Пополнения баланса
- Логины
- Загрузки файлов
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class ActivityType:
    """Типы активностей пользователей"""
    SEARCH_BIN = "search_bin"           # Поиск по .bin файлу
    SEARCH_SCREENSHOT = "search_ocr"    # Поиск по скриншоту OCR
    SEARCH_TEXT = "search_text"         # Текстовый поиск
    ORDER_CREATED = "order_created"     # Создан заказ
    ORDER_PAID = "order_paid"           # Заказ оплачен
    ORDER_COMPLETED = "order_completed" # Заказ завершён
    FILE_DOWNLOAD = "file_download"     # Скачивание файла
    BALANCE_DEPOSIT = "balance_deposit" # Пополнение баланса
    LOGIN = "login"                     # Авторизация
    REGISTER = "register"               # Регистрация
    GUEST_UPLOAD = "guest_upload"       # Загрузка гостем


class UserActivity(Base):
    """Модель для логирования активности пользователей"""
    __tablename__ = "user_activity"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с пользователем (nullable для гостей)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    telegram_id = Column(Integer, nullable=True, index=True)  # Дублируем для быстрого поиска
    
    # Тип активности
    activity_type = Column(String(50), nullable=False, index=True)
    
    # Детали активности (JSON для гибкости)
    details = Column(JSON, nullable=True)
    # Примеры details:
    # - search: {"query": "BMW X5", "firmware_id": 123, "found": true}
    # - order: {"order_id": 456, "firmware_id": 123, "stage": "stage2", "price": 50.0}
    # - download: {"firmware_id": 123, "s3_key": "xxx.bin"}
    # - balance: {"amount": 1000, "method": "card"}
    
    # IP адрес (для веб-запросов)
    ip_address = Column(String(50), nullable=True)
    
    # User-Agent / Platform
    user_agent = Column(String(500), nullable=True)
    platform = Column(String(50), nullable=True)  # "telegram", "web", "api"
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationship
    user = relationship("User", backref="activities")
    
    def __repr__(self):
        return f"<UserActivity {self.activity_type} by user {self.user_id} at {self.created_at}>"


# Агрегированные метрики (будем считать из user_activity)
# - Сколько поисков в день/неделю/месяц
# - Конверсия поиск → покупка
# - Популярные прошивки
# - Активные пользователи
# - Средний чек
