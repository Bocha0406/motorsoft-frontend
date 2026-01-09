"""
User model
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class UserLevel(str, enum.Enum):
    """User loyalty levels"""
    NEWBIE = "newbie"
    SPECIALIST = "specialist"
    PRO = "pro"
    VIP = "vip"
    PARTNER = "partner"


class User(Base):
    """User model - клиенты и партнёры"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Telegram data (соответствует реальной схеме БД)
    telegram_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String(255), nullable=True)  # В БД называется username, не telegram_username
    
    # Contact
    phone = Column(String(50), nullable=True)
    
    # Balance & Loyalty
    balance = Column(Float, default=0.0)
    level = Column(String(50), default="newbie")  # В БД это varchar, не Enum
    total_purchases = Column(Integer, default=0)
    coefficient = Column(Float, default=1.0)  # Personal discount coefficient
    
    # Partner program
    is_partner = Column(Boolean, default=False)
    is_slave = Column(Boolean, default=False)  # В БД называется is_slave, не is_slave_device
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_active = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    orders = relationship("Order", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    
    def __repr__(self):
        return f"<User {self.telegram_id}: {self.telegram_username}>"
    
    def update_level(self):
        """Update user level based on total purchases"""
        if self.is_partner:
            self.level = UserLevel.PARTNER
            self.coefficient = 0.6
        elif self.total_purchases >= 300:
            self.level = UserLevel.VIP
            self.coefficient = 0.7
        elif self.total_purchases >= 100:
            self.level = UserLevel.PRO
            self.coefficient = 0.8
        elif self.total_purchases >= 50:
            self.level = UserLevel.SPECIALIST
            self.coefficient = 0.9
        else:
            self.level = UserLevel.NEWBIE
            self.coefficient = 1.0
