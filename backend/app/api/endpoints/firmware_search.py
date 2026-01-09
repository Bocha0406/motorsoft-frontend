"""
API endpoint для поиска прошивки по загруженному BIN файлу
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from typing import Dict, List
import tempfile
import os
import re

from app.core.database_sync import get_db_sync
from app.models.firmware import Firmware
from app.services.firmware_parser import FirmwareParser
from loguru import logger

router = APIRouter(prefix="/api/firmware", tags=["firmware"])

parser = FirmwareParser()

# Chinese ECU patterns to extract from filename
FILENAME_PATTERNS = [
    # Full Chinese calibration: GCQBRB44CQS03A00 (16+ chars)
    r'([A-Z]{3,5}[A-Z0-9]{10,15})',
    # UAES/Bosch China: F01R0AD3G0, F01RB0D2T4
    r'(F01R[0A-Z0-9]{5,10})',
    # Toyota/Denso style: R7F701202_89663-06N50
    r'(R7F[0-9]+_[0-9A-Z-]+)',
    r'([0-9]{5}-[0-9A-Z]{4,6})',
    # Bosch MED17/EDC17 - extract VI number: vi_004782 -> 004782
    r'vi_(\d{6,8})',
    # Bosch serial from filename: _XXXXXXXX_ 10 digits
    r'_(\d{10})_',
    # Bosch SW number 27XXXXXXXX or 26XXXXXXXX
    r'(2[67]\d{8})',
    # Bosch 1037 format
    r'(103\d{7,10})',
]


def extract_ids_from_filename(filename: str) -> List[str]:
    """Extract potential firmware IDs from filename"""
    ids = []
    # Remove extension and date patterns
    clean = re.sub(r'-\d{8}-\d{6}', '', filename)  # Remove date-time
    clean = re.sub(r'\.\w{2,4}$', '', clean)  # Remove extension
    
    # First, add the clean filename itself as potential ID (most reliable)
    if len(clean) >= 6:
        ids.append(clean)
    
    # Then try patterns
    for pattern in FILENAME_PATTERNS:
        matches = re.findall(pattern, clean, re.IGNORECASE)
        ids.extend(matches)
    
    # Remove duplicates but keep order
    seen = set()
    unique = []
    for id in ids:
        if id.upper() not in seen:
            seen.add(id.upper())
            unique.append(id)
    
    return unique


@router.post("/search")
def search_firmware(
    file: UploadFile = File(...),
    db: Session = Depends(get_db_sync)
) -> Dict:
    """
    Загрузить BIN файл и найти соответствующую прошивку в базе
    
    Процесс:
    1. Загружаем файл во временную папку
    2. Парсим файл и извлекаем ID
    3. Также пробуем извлечь ID из имени файла!
    4. Ищем в базе по software_id
    5. Возвращаем информацию о прошивке
    """
    
    # Сохраняем во временный файл
    with tempfile.NamedTemporaryFile(delete=False, suffix='.bin') as tmp_file:
        content = file.file.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Парсим файл
        logger.info(f"Parsing uploaded file: {file.filename}")
        parse_result = parser.parse_file(tmp_path)
        
        software_id = parse_result.get('software_id')
        all_matches = parse_result.get('all_matches', [])
        
        logger.info(f"Parser found software_id: {software_id}")
        logger.info(f"Parser all_matches: {all_matches}")
        
        # Также пробуем извлечь ID из имени файла (особенно для китайских ECU)
        filename_ids = extract_ids_from_filename(file.filename or "")
        logger.info(f"IDs from filename: {filename_ids}")
        
        # Комбинируем все возможные ID для поиска
        # Сначала ID из парсера (более надёжно), потом из имени файла
        search_ids = []
        if software_id:
            search_ids.append(software_id)
        # Добавляем все найденные паттерны тоже
        for match in all_matches:
            if match.get('match') and match['match'] != software_id:
                search_ids.append(match['match'])
        search_ids.extend(filename_ids)
        
        # Убираем дубликаты
        seen = set()
        unique_search_ids = []
        for sid in search_ids:
            if sid.upper() not in seen:
                seen.add(sid.upper())
                unique_search_ids.append(sid)
        search_ids = unique_search_ids
        
        if not search_ids:
            return {
                "found": False,
                "message": "Could not extract firmware ID from file",
                "parse_result": parse_result,
            }
        
        logger.info(f"Searching with IDs: {search_ids}")
        
        # Ищем в базе по всем найденным ID
        firmware = None
        matched_id = None
        
        for search_id in search_ids:
            # Ищем напрямую
            stmt = select(Firmware).where(
                Firmware.software_id.ilike(f"%{search_id}%")
            )
            result = db.execute(stmt)
            firmware = result.scalar_one_or_none()
            
            if firmware:
                matched_id = search_id
                break
            
            # Пробуем без дефисов и пробелов
            clean_id = search_id.replace('-', '').replace(' ', '').replace('_', '')
            stmt = select(Firmware).where(
                Firmware.software_id.ilike(f"%{clean_id}%")
            )
            result = db.execute(stmt)
            firmware = result.scalar_one_or_none()
            
            if firmware:
                matched_id = search_id
                break
        
        if firmware:
            return {
                "found": True,
                "message": "Firmware found in database",
                "extracted_id": matched_id or software_id,
                "firmware": {
                    "id": firmware.id,
                    "brand": firmware.brand,
                    "series": firmware.series,
                    "ecu_brand": firmware.ecu_brand,
                    "software_id": firmware.software_id,
                    "hardware_id": firmware.hardware_id,
                    "file_size": firmware.file_size,
                    "price": float(firmware.price) if firmware.price else 50.0,
                    "winols_file": firmware.winols_file,
                },
                "parse_result": {
                    "confidence": parse_result.get('confidence'),
                    "ecu": parse_result.get('ecu'),
                    "brand": parse_result.get('brand'),
                },
                "search_ids": search_ids,
            }
        else:
            return {
                "found": False,
                "message": "Firmware not found in database",
                "extracted_id": software_id,
                "search_ids": search_ids,
                "parse_result": parse_result,
                "suggestion": "This file needs manual processing",
                "filename": file.filename,
            }
    
    finally:
        # Удаляем временный файл
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@router.get("/stats")
def get_firmware_stats(db: Session = Depends(get_db_sync)) -> Dict:
    """Статистика по прошивкам в базе"""
    from sqlalchemy import func, distinct
    
    # Общее количество
    total_stmt = select(func.count(Firmware.id))
    total_result = db.execute(total_stmt)
    total = total_result.scalar()
    
    # Количество марок
    brands_stmt = select(func.count(distinct(Firmware.brand)))
    brands_result = db.execute(brands_stmt)
    brands_count = brands_result.scalar()
    
    # Количество типов ЭБУ
    ecu_stmt = select(func.count(distinct(Firmware.ecu_brand)))
    ecu_result = db.execute(ecu_stmt)
    ecu_count = ecu_result.scalar()
    
    return {
        "total_firmwares": total,
        "total_brands": brands_count,
        "total_ecu_types": ecu_count,
    }


@router.get("/{firmware_id}")
def get_firmware_by_id(
    firmware_id: int,
    db: Session = Depends(get_db_sync)
) -> Dict:
    """Получить информацию о прошивке по ID"""
    stmt = select(Firmware).where(Firmware.id == firmware_id)
    result = db.execute(stmt)
    firmware = result.scalar_one_or_none()
    
    if not firmware:
        raise HTTPException(status_code=404, detail="Firmware not found")
    
    return {
        "id": firmware.id,
        "brand": firmware.brand,
        "series": firmware.series,
        "ecu_brand": firmware.ecu_brand,
        "software_id": firmware.software_id,
        "hardware_id": firmware.hardware_id,
        "file_size": firmware.file_size,
        "price": float(firmware.price) if firmware.price else 50.0,
        "winols_file": firmware.winols_file,
        "maps_count": firmware.maps_count,
        "versions_info": firmware.versions_info,
    }
