"""
File upload and processing endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import aiofiles
import os
from datetime import datetime

from app.core.database import get_db
from app.core.config import settings
from app.services.firmware_parser import FirmwareParser
from app.models.order import Order
from app.models.firmware import Firmware

router = APIRouter()


@router.post("/firmware")
async def upload_firmware(
    file: UploadFile = File(...),
    user_id: int = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Upload firmware file for processing
    1. Save file
    2. Parse to extract IDs
    3. Search in database
    4. Create order
    """
    
    # Validate file
    if not file.filename.endswith('.bin'):
        raise HTTPException(
            status_code=400, 
            detail="Только .bin файлы принимаются"
        )
    
    # Save file temporarily
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    upload_path = f"/tmp/motorsoft/uploads/{safe_filename}"
    
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)
    
    async with aiofiles.open(upload_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Parse firmware
    parser = FirmwareParser()
    parse_result = parser.parse_file(upload_path)
    
    # Search in database
    from sqlalchemy import select
    
    firmware_match = None
    if parse_result.get("software_id"):
        result = await db.execute(
            select(Firmware).where(
                Firmware.software_id.ilike(f"%{parse_result['software_id']}%")
            )
        )
        firmware_match = result.scalar_one_or_none()
    
    # Create order (use only existing DB columns!)
    order = Order(
        user_id=user_id or 0,
        firmware_id=firmware_match.id if firmware_match else None,
        original_file_path=upload_path,
        status="pending" if firmware_match else "manual",
        price=firmware_match.price if firmware_match else 0,
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    return {
        "status": "ok",
        "order_id": order.id,
        "matched": firmware_match is not None,
        "parse_result": parse_result,
        "firmware": firmware_match if firmware_match else None,
        "message": "Прошивка найдена!" if firmware_match else "Прошивка не найдена, заявка передана оператору"
    }
