"""
Bot configuration
"""

from pydantic_settings import BaseSettings
from typing import Optional


class BotSettings(BaseSettings):
    """Bot settings from environment"""
    
    BOT_TOKEN: str = ""
    
    # API Backend
    API_BASE_URL: str = "http://backend:8000/api/v1"
    
    # Admin IDs (can manage bot)
    ADMIN_IDS: list[int] = []
    
    # Operator IDs (receive manual orders)
    OPERATOR_IDS: list[int] = []
    
    # ========== YANDEX CLOUD OCR ==========
    # Для улучшенного распознавания скриншотов
    # Получить: https://console.cloud.yandex.ru/
    YANDEX_CLOUD_FOLDER_ID: Optional[str] = None
    YANDEX_CLOUD_API_KEY: Optional[str] = None
    YANDEX_IAM_TOKEN: Optional[str] = None  # Альтернатива API_KEY (на 12 часов)
    
    class Config:
        env_file = ".env"
        extra = "allow"


settings = BotSettings()
