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
    
    # Files
    original_file_path = Column(Text, nullable=True)  # Сток от клиента
    modified_file_path = Column(Text, nullable=True)  # Мод для клиента
    
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
        return f"<Order {self.id}: {self.status}>"
        self.final_price = self.base_price * user_coefficient
        self.discount = (1 - user_coefficient) * 100
