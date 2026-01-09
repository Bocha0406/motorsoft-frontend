"""
Firmware management endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from app.core.database import get_db
from app.models.firmware import Firmware

router = APIRouter()


@router.get("/")
async def list_firmwares(
    skip: int = 0,
    limit: int = 100,
    brand: str = None,
    ecu: str = None,
    db: AsyncSession = Depends(get_db)
):
    """List firmwares with optional filters"""
    query = select(Firmware)
    
    if brand:
        query = query.where(Firmware.brand.ilike(f"%{brand}%"))
    if ecu:
        query = query.where(Firmware.ecu_brand.ilike(f"%{ecu}%"))
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    firmwares = result.scalars().all()
    
    return firmwares


@router.get("/search")
async def search_firmware(
    software_id: str = Query(..., description="Software ID to search"),
    hardware_id: str = Query(None, description="Hardware ID (optional)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Search firmware by software/hardware ID
    This is the main endpoint for auto-matching
    """
    query = select(Firmware).where(
        Firmware.software_id.ilike(f"%{software_id}%")
    )
    
    if hardware_id:
        query = query.where(
            Firmware.hardware_id.ilike(f"%{hardware_id}%")
        )
    
    result = await db.execute(query)
    firmwares = result.scalars().all()
    
    if not firmwares:
        return {
            "found": False,
            "message": "Прошивка не найдена в базе. Заявка будет передана оператору.",
            "results": []
        }
    
    return {
        "found": True,
        "count": len(firmwares),
        "results": firmwares
    }


@router.get("/{firmware_id}")
async def get_firmware(
    firmware_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get firmware by ID"""
    result = await db.execute(
        select(Firmware).where(Firmware.id == firmware_id)
    )
    firmware = result.scalar_one_or_none()
    if not firmware:
        raise HTTPException(status_code=404, detail="Firmware not found")
    return firmware


@router.get("/stats/summary")
async def firmware_stats(
    db: AsyncSession = Depends(get_db)
):
    """Get firmware statistics"""
    from sqlalchemy import func
    
    # Total count
    total = await db.execute(select(func.count(Firmware.id)))
    total_count = total.scalar()
    
    # By brand
    brands = await db.execute(
        select(Firmware.brand, func.count(Firmware.id))
        .group_by(Firmware.brand)
        .order_by(func.count(Firmware.id).desc())
        .limit(10)
    )
    
    # By ECU
    ecus = await db.execute(
        select(Firmware.ecu_brand, func.count(Firmware.id))
        .group_by(Firmware.ecu_brand)
        .order_by(func.count(Firmware.id).desc())
        .limit(10)
    )
    
    return {
        "total": total_count,
        "top_brands": [{"brand": b, "count": c} for b, c in brands],
        "top_ecus": [{"ecu": e, "count": c} for e, c in ecus],
    }
