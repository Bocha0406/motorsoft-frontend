"""Admin User Model - для операторов админ-панели."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from app.core.database import Base
import enum


class AdminRole(str, enum.Enum):
    """Роли администраторов."""
    ADMIN = "admin"  # Полный доступ
    OPERATOR = "operator"  # Только просмотр и управление заказами


class AdminUser(Base):
    """Модель пользователя админ-панели."""
    
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(AdminRole), nullable=False, default=AdminRole.OPERATOR)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Аудит
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<AdminUser {self.username} ({self.role})>"
