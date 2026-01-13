"""
FirmwareVariant model - варианты Stage для прошивок

Stage 1 - базовая модификация
Stage 2 - умеренная модификация  
Stage 3 - максимальная модификация

Каждая прошивка может иметь несколько Stage вариантов.
Файлы Stage хранятся в Yandex Object Storage.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class FirmwareVariant(Base):
    """Variant/Stage модификации прошивки"""
    __tablename__ = "firmware_variants"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с оригинальной прошивкой
    firmware_id = Column(Integer, ForeignKey("firmwares.id"), nullable=False, index=True)
    
    # Stage info
    stage = Column(String(50), nullable=False)  # "stage1", "stage2", "stage3"
    stage_name = Column(String(100), nullable=False)  # "Stage 1 - Eco", "Stage 2 - Power"
    description = Column(Text, nullable=True)  # Описание модификации
    
    # Power increase info
    power_increase = Column(String(50), nullable=True)  # "+20-30 л.с."
    torque_increase = Column(String(50), nullable=True)  # "+50 Нм"
    
    # Что удалено/отключено
    modifications = Column(Text, nullable=True)  # "DPF off, EGR off, STAGE 1 maps"
    
    # Цена
    price = Column(Numeric(10, 2), nullable=False, default=50.0)
    
    # Файл в Object Storage
    s3_key = Column(String(500), nullable=True)  # Ключ в S3: "firmwares/stage1/20260113_xxx.bin"
    file_size = Column(Integer, nullable=True)  # Размер файла в байтах
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationship
    firmware = relationship("Firmware", back_populates="variants")
    
    def __repr__(self):
        return f"<FirmwareVariant {self.stage_name} for firmware {self.firmware_id}>"


# Стандартные Stage шаблоны
STAGE_TEMPLATES = {
    "stage1": {
        "stage_name": "Stage 1 - Базовый",
        "description": "Оптимизация калибровок, улучшение отзывчивости. Безопасный прирост мощности.",
        "power_increase": "+15-25%",
        "torque_increase": "+20-30%",
    },
    "stage2": {
        "stage_name": "Stage 2 - Умеренный",
        "description": "Более агрессивная настройка. Рекомендуется улучшенный выхлоп и впуск.",
        "power_increase": "+25-35%",
        "torque_increase": "+35-45%",
    },
    "stage3": {
        "stage_name": "Stage 3 - Максимум",
        "description": "Максимальная мощность. Требуется подготовка двигателя и топливной системы.",
        "power_increase": "+40-60%",
        "torque_increase": "+50-70%",
    },
}
