"""
Order management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_db
from app.models.order import Order
from app.models.user import User
from app.models.firmware import Firmware

router = APIRouter()


class CreateOrderRequest(BaseModel):
    """Request body for creating order"""
    telegram_id: int
    firmware_id: int
    original_filename: Optional[str] = None
    original_file_path: Optional[str] = None


@router.post("/create")
async def create_order(
    request: CreateOrderRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new order for firmware purchase
    Called when firmware is found in database
    """
    # Get user
    result = await db.execute(
        select(User).where(User.telegram_id == request.telegram_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get firmware
    result = await db.execute(
        select(Firmware).where(Firmware.id == request.firmware_id)
    )
    firmware = result.scalar_one_or_none()
    if not firmware:
        raise HTTPException(status_code=404, detail="Firmware not found")
    
    # Calculate price (use firmware price or default)
    # Convert to float to avoid Decimal * float issues
    base_price = float(firmware.price) if firmware.price else 50.0
    coefficient = float(user.coefficient) if user.coefficient else 1.0
    
    # Apply user coefficient (discount)
    final_price = base_price * coefficient
    discount_percent = (1 - coefficient) * 100
    
    # Create order (using only columns that exist in DB)
    order = Order(
        user_id=user.id,
        firmware_id=firmware.id,
        original_file_path=request.original_file_path,
        status="pending",
        price=final_price,
        discount=discount_percent
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    return {
        "status": "ok",
        "order_id": order.id,
        "price": final_price,
        "firmware": {
            "id": firmware.id,
            "brand": firmware.brand,
            "series": firmware.series,
            "software_id": firmware.software_id,
            "ecu_brand": firmware.ecu_brand
        }
    }


@router.get("/")
async def list_orders(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: AsyncSession = Depends(get_db)
):
    """List orders with optional status filter"""
    query = select(Order)
    
    if status:
        query = query.where(Order.status == status)
    
    query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return orders


@router.get("/user/{user_id}")
async def list_user_orders(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """List orders for specific user"""
    result = await db.execute(
        select(Order)
        .where(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    return orders


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get order by ID"""
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{order_id}/complete")
async def complete_order(
    order_id: int,
    modified_file_path: str,
    db: AsyncSession = Depends(get_db)
):
    """Mark order as completed (operator action)"""
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = "completed"
    order.modified_file_path = modified_file_path
    
    await db.commit()
    
    return {"status": "ok", "order_id": order.id}


@router.post("/{order_id}/purchase")
async def purchase_order(
    order_id: int,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Process purchase - check balance, deduct money, complete order
    This is called when user clicks "Купить" in bot
    """
    from datetime import datetime
    
    # Get user by telegram_id
    result = await db.execute(
        select(User).where(User.telegram_id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get order
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if order already completed
    if order.status == "completed":
        raise HTTPException(status_code=400, detail="Order already completed")
    
    # Calculate price
    price = float(order.price) if order.price else 50.0  # Default 50₽
    
    # Check balance
    user_balance = float(user.balance) if user.balance else 0.0
    if user_balance < price:
        raise HTTPException(
            status_code=400, 
            detail=f"Недостаточно средств. Баланс: {user_balance}₽, Цена: {price}₽"
        )
    
    # Deduct balance
    user.balance = user_balance - price
    user.total_purchases = (user.total_purchases or 0) + 1
    user.last_active = datetime.utcnow()
    
    # Update order status
    order.status = "completed"
    
    # Create transaction record
    from app.models.transaction import Transaction, TransactionType
    transaction = Transaction(
        user_id=user.id,
        amount=-price,
        type=TransactionType.PURCHASE,  # Теперь это строка "purchase"
        description=f"Покупка прошивки #{order.id}",
        order_id=order.id,
        balance_before=user.balance + price,  # До списания
        balance_after=user.balance  # После списания
    )
    db.add(transaction)
    
    await db.commit()
    
    return {
        "status": "ok",
        "price": price,
        "new_balance": user.balance,
        "order_id": order.id,
        "file_path": order.modified_file_path  # Path to download
    }


@router.get("/stats/summary")
async def order_stats(
    db: AsyncSession = Depends(get_db)
):
    """Get order statistics"""
    from sqlalchemy import func
    
    statuses = ["pending", "processing", "manual", "completed", "cancelled", "refunded"]
    stats = {}
    
    for status in statuses:
        result = await db.execute(
            select(func.count(Order.id)).where(Order.status == status)
        )
        stats[status] = result.scalar()
    
    return stats
