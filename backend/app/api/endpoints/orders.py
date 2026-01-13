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
from app.models.firmware_variant import FirmwareVariant, STAGE_TEMPLATES

router = APIRouter()


class CreateOrderRequest(BaseModel):
    """Request body for creating order"""
    telegram_id: int
    firmware_id: int
    original_filename: Optional[str] = None
    original_file_path: Optional[str] = None
    stage: Optional[str] = None  # "stage1", "stage2", "stage3"


@router.post("/create")
async def create_order(
    request: CreateOrderRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new order for firmware purchase with Stage selection.
    Called when user selects Stage 1/2/3 variant.
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
    
    # Calculate price based on Stage
    base_price = float(firmware.price) if firmware.price else 50.0
    coefficient = float(user.coefficient) if user.coefficient else 1.0
    
    stage = request.stage
    variant_id = None
    s3_key = None
    
    if stage:
        # Check if there's a real variant in DB
        result = await db.execute(
            select(FirmwareVariant).where(
                FirmwareVariant.firmware_id == request.firmware_id,
                FirmwareVariant.stage == stage
            )
        )
        variant = result.scalar_one_or_none()
        
        if variant:
            # Real variant with file in S3
            variant_id = variant.id
            s3_key = variant.s3_key
            final_price = float(variant.price) if variant.price else base_price
        else:
            # Template Stage - use multipliers
            if stage == "stage1":
                final_price = base_price
            elif stage == "stage2":
                final_price = base_price * 1.3
            elif stage == "stage3":
                final_price = base_price * 1.6
            else:
                final_price = base_price
    else:
        final_price = base_price
    
    # Apply user coefficient (discount)
    final_price = final_price * coefficient
    discount_percent = (1 - coefficient) * 100
    
    # Create order with Stage info
    order = Order(
        user_id=user.id,
        firmware_id=firmware.id,
        variant_id=variant_id,
        stage=stage,
        original_file_path=request.original_file_path,
        s3_key=s3_key,
        status="pending" if s3_key else "awaiting_file",  # awaiting_file если файла нет
        price=final_price,
        discount=discount_percent
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    stage_name = STAGE_TEMPLATES.get(stage, {}).get("stage_name", stage) if stage else None
    
    return {
        "status": "ok",
        "order_id": order.id,
        "price": final_price,
        "stage": stage,
        "stage_name": stage_name,
        "has_file": s3_key is not None,
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
    Process purchase - check balance, deduct money, generate download URL.
    Returns Presigned URL from S3 if file exists, otherwise marks for manual processing.
    """
    from datetime import datetime
    from app.services.s3_storage import s3_storage
    
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
    
    # Generate download URL if file exists in S3
    download_url = None
    if order.s3_key:
        download_url = s3_storage.generate_download_url(order.s3_key, expires_in=3600)
        order.status = "completed"
    else:
        # No file yet - mark for manual processing
        order.status = "awaiting_file"
    
    # Create transaction record
    from app.models.transaction import Transaction, TransactionType
    transaction = Transaction(
        user_id=user.id,
        amount=-price,
        type=TransactionType.PURCHASE,
        description=f"Покупка прошивки #{order.id} ({order.stage or 'standard'})",
        order_id=order.id,
        balance_before=user.balance + price,
        balance_after=user.balance
    )
    db.add(transaction)
    
    await db.commit()
    
    return {
        "status": "ok",
        "price": price,
        "new_balance": user.balance,
        "order_id": order.id,
        "stage": order.stage,
        "download_url": download_url,  # Presigned URL or None
        "file_path": order.modified_file_path,  # Legacy local path
        "awaiting_file": download_url is None and order.s3_key is None
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
