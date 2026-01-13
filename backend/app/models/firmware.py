"""
Firmware model - база прошивок
Синхронизировано с реальной схемой БД (08.01.2026)
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Firmware(Base):
    """Firmware model - прошивки из WinOLS"""
    __tablename__ = "firmwares"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # WinOLS sync
    winols_id = Column(String(255), unique=True, nullable=True)
    winols_file = Column(String(500), nullable=True)  # MOTORSOFT_XXXXX.ols
    
    # Vehicle info
    brand = Column(String(255), nullable=False, index=True)  # Марка авто: Toyota, BMW...
    series = Column(String(255), nullable=True)  # Модель: Prius 1.8, X5 3.0d...
    
    # ECU info
    ecu_brand = Column(String(255), nullable=True, index=True)  # Bosch, Denso, Siemens...
    
    # Identification - КЛЮЧЕВЫЕ ПОЛЯ ДЛЯ ПОИСКА
    software_id = Column(String(255), nullable=True, index=True)  # Номер прошивки: 89663-47351
    hardware_id = Column(String(255), nullable=True)  # HW номер
    
    # File info (TEXT в БД из-за данных импорта)
    file_path = Column(Text, nullable=True)
    file_size = Column(Text, nullable=True)  # TEXT, не Integer!
    
    # Pricing
    price = Column(Numeric(10, 2), default=50.0)  # Называется price, не base_price!
    
    # Metadata (TEXT в БД)
    maps_count = Column(Text, nullable=True)  # TEXT, не Integer!
    versions_info = Column(Text, nullable=True)
    
    # Timestamps (TEXT в БД из-за формата импорта)
    winols_created_at = Column(Text, nullable=True)  # TEXT из-за формата "21.11.2025 (14:40:44)"
    winols_updated_at = Column(Text, nullable=True)  # TEXT из-за формата
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    orders = relationship("Order", back_populates="firmware")
    variants = relationship("FirmwareVariant", back_populates="firmware", lazy="selectin")
    
    def __repr__(self):
        return f"<Firmware {self.brand} {self.series}: {self.software_id}>"
