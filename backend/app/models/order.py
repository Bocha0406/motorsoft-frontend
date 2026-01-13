"""
Order model - заказы клиентов
Модель соответствует реальной схеме БД
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Order(Base):
    """Order model - заказы на прошивки (соответствует реальной схеме БД)"""
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relations
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    firmware_id = Column(Integer, ForeignKey("firmwares.id"), nullable=True)
    variant_id = Column(Integer, ForeignKey("firmware_variants.id"), nullable=True)  # Stage variant
    
    # Stage info (для шаблонных Stage без реального variant)
    stage = Column(String(50), nullable=True)  # "stage1", "stage2", "stage3"
    
    # Files
    original_file_path = Column(Text, nullable=True)  # Сток от клиента
    modified_file_path = Column(Text, nullable=True)  # Мод для клиента (локальный путь или S3 key)
    s3_key = Column(String(500), nullable=True)  # Ключ файла в Object Storage
    
    # Status (varchar в БД, не Enum)
    status = Column(String(50), default="pending")
    
    # Pricing (Numeric в БД)
    price = Column(Numeric(10, 2), nullable=True)
    discount = Column(Numeric(5, 2), default=0.0)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    firmware = relationship("Firmware", back_populates="orders")
    
    def __repr__(self):
        return f"<Order {self.id}: {self.status} ({self.stage or 'no stage'})>"
