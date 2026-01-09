"""
Authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.models.user import User

router = APIRouter()


class TelegramAuthData(BaseModel):
    """Telegram authentication data"""
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


@router.post("/telegram")
async def auth_telegram(
    data: TelegramAuthData,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user via Telegram
    Used by Telegram Bot to register/login users
    Creates new user if not exists, returns existing user otherwise
    """
    # Check if user exists
    result = await db.execute(
        select(User).where(User.telegram_id == data.telegram_id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Update username if changed
        if data.username and user.username != data.username:
            user.username = data.username
            await db.commit()
            await db.refresh(user)
        
        return {
            "status": "ok",
            "user_id": user.id,
            "telegram_id": user.telegram_id,
            "username": user.username,
            "balance": float(user.balance) if user.balance else 0.0,
            "level": user.level,
            "is_new": False
        }
    
    # Create new user
    new_user = User(
        telegram_id=data.telegram_id,
        username=data.username,
        balance=0.0,
        level="newbie",
        total_purchases=0,
        coefficient=1.0,
        is_partner=False,
        is_slave=False
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {
        "status": "ok",
        "user_id": new_user.id,
        "telegram_id": new_user.telegram_id,
        "username": new_user.username,
        "balance": 0.0,
        "level": "newbie",
        "is_new": True
    }


@router.get("/me")
async def get_current_user():
    """Get current authenticated user"""
    # TODO: Implement with JWT tokens
    return {"status": "ok", "message": "Get current user endpoint"}
