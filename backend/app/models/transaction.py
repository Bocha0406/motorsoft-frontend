"""
Transaction model - история транзакций
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class TransactionType:
    """Transaction types as constants"""
    DEPOSIT = "deposit"        # Пополнение баланса
    PURCHASE = "purchase"      # Покупка прошивки
    REFUND = "refund"          # Возврат средств
    BONUS = "bonus"            # Бонус
    PARTNER_DEPOSIT = "partner_deposit"  # Партнёрский депозит


class Transaction(Base):
    """Transaction model - финансовые операции"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Relations
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    
    # Transaction info - использую String вместо Enum для совместимости
    type = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)  # + пополнение, - списание
    balance_before = Column(Float, nullable=True)
    balance_after = Column(Float, nullable=True)
    
    # Description
    description = Column(Text, nullable=True)
    
    # Payment info (for deposits)
    payment_method = Column(String(50), nullable=True)
    payment_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="transactions")
    
    def __repr__(self):
        return f"<Transaction {self.id}: {self.type} {self.amount}>"
