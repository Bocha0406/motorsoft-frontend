"""
Application configuration
Environment variables and settings
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    model_config = {"env_file": "../.env", "env_file_encoding": "utf-8", "extra": "allow"}
    
    # Application
    APP_NAME: str = "MotorSoft"
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://motorsoft:motorsoft@localhost:5432/motorsoft"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = ""
    
    # S3 Storage
    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET_ORIGINALS: str = "motorsoft-originals"
    S3_BUCKET_MODIFIED: str = "motorsoft-modified"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # File paths
    WINOLS_STORAGE_PATH: str = "/path/to/winols/files"
    
    # Pricing
    DEFAULT_PRICE: float = 50.0
    
    # Loyalty coefficients
    LOYALTY_LEVELS: dict = {
        "newbie": {"min_purchases": 0, "coefficient": 1.0},
        "specialist": {"min_purchases": 50, "coefficient": 0.9},
        "pro": {"min_purchases": 100, "coefficient": 0.8},
        "vip": {"min_purchases": 300, "coefficient": 0.7},
        "partner": {"min_purchases": 0, "coefficient": 0.6},  # Special
    }


settings = Settings()
