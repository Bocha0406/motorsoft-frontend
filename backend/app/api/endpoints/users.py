"""
User management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User

router = APIRouter()


@router.get("/")
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all users (admin only)"""
    result = await db.execute(
        select(User).offset(skip).limit(limit)
    )
    users = result.scalars().all()
    return users


@router.get("/{user_id}")
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get user by ID"""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/telegram/{telegram_id}")
async def get_user_by_telegram(
    telegram_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get user by Telegram ID"""
    result = await db.execute(
        select(User).where(User.telegram_id == telegram_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/{user_id}/deposit")
async def add_deposit(
    user_id: int,
    amount: float,
    db: AsyncSession = Depends(get_db)
):
    """Add deposit to user balance"""
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.balance += amount
    await db.commit()
    
    return {"status": "ok", "new_balance": user.balance}
