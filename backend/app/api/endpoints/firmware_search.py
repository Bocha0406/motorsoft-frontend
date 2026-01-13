"""
API endpoint для поиска прошивки по загруженному BIN файлу
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from typing import Dict, List, Optional, Any
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
    # Hyundai/Kia Bosch calibration: GRBRB44CQS6-A000, GRBRB44CFS8-5000
    r'(GR[A-Z0-9]{6,12}[-_]?[A-Z0-9]{4,6})',
    # Hyundai/Kia software IDs: GN26ST2E2
    r'(GN[0-9]{2}[A-Z0-9]{4,8})',
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


def smart_search_by_filename(filename: str, db: Session) -> Optional[Any]:
    """
    Умный поиск по имени файла - разбивает на части и ищет в базе.
    Например: Hyundai_Solaris_1.2_(Оригинал)_GATA-BE42QS09A00_.bin
    -> пробует найти GATA-BE42QS09A00 в software_id
    """
    if not filename:
        return None
    
    # Убираем расширение
    clean = re.sub(r'\.\w{2,4}$', '', filename)
    
    # Разбиваем на части по _ и пробелам
    parts = re.split(r'[_\s]+', clean)
    
    # Фильтруем части длиннее 6 символов (потенциальные ID)
    potential_ids = [p for p in parts if len(p) >= 6 and not p.lower() in ['hyundai', 'solaris', 'accent', 'toyota', 'kia', 'оригинал', 'original']]
    
    logger.info(f"Smart search parts from filename: {potential_ids}")
    
    for part in potential_ids:
        # Ищем полное совпадение части
        stmt = select(Firmware).where(
            Firmware.software_id.ilike(f"%{part}%")
        ).limit(1)
        result = db.execute(stmt)
        firmware = result.scalar_one_or_none()
        if firmware:
            logger.info(f"Smart search found by part: {part}")
            return firmware
        
        # Пробуем без дефисов
        clean_part = part.replace('-', '').replace('_', '')
        if clean_part != part:
            stmt = select(Firmware).where(
                Firmware.software_id.ilike(f"%{clean_part}%")
            ).limit(1)
            result = db.execute(stmt)
            firmware = result.scalar_one_or_none()
            if firmware:
                logger.info(f"Smart search found by clean part: {clean_part}")
                return firmware
    
    return None


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
    4. УМНЫЙ ПОИСК: разбиваем имя на части и ищем каждую в базе
    5. Возвращаем информацию о прошивке
    """
    
    # =============================================
    # СНАЧАЛА: Умный поиск по имени файла (самый надёжный!)
    # =============================================
    logger.info(f"Processing file: {file.filename}")
    
    smart_result = smart_search_by_filename(file.filename, db)
    if smart_result:
        return {
            "found": True,
            "message": "Firmware found by smart filename search",
            "extracted_id": smart_result.software_id,
            "firmware": {
                "id": smart_result.id,
                "brand": smart_result.brand,
                "series": smart_result.series,
                "ecu_brand": smart_result.ecu_brand,
                "software_id": smart_result.software_id,
                "hardware_id": smart_result.hardware_id,
                "file_size": smart_result.file_size,
                "price": float(smart_result.price) if smart_result.price else 50.0,
                "winols_file": smart_result.winols_file,
            },
            "parse_result": {"method": "smart_filename_search"},
            "search_ids": [smart_result.software_id],
        }
    
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


@router.get("/search")
def search_firmware_by_id(
    software_id: str,
    db: Session = Depends(get_db_sync)
) -> Dict:
    """
    Поиск прошивки по software_id (например, после OCR распознавания)
    GET /api/firmware/search?software_id=39101-2F310
    """
    logger.info(f"GET search request for software_id: {software_id}")
    
    # Ищем напрямую с ILIKE
    stmt = select(Firmware).where(
        Firmware.software_id.ilike(f"%{software_id}%")
    )
    result = db.execute(stmt)
    firmware = result.scalar_one_or_none()
    
    # Если не найдено, пробуем без дефисов
    if not firmware:
        clean_id = software_id.replace('-', '').replace(' ', '').replace('_', '')
        stmt = select(Firmware).where(
            Firmware.software_id.ilike(f"%{clean_id}%")
        )
        result = db.execute(stmt)
        firmware = result.scalar_one_or_none()
    
    if firmware:
        return {
            "found": True,
            "message": "Firmware found in database",
            "extracted_id": software_id,
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
        }
    else:
        return {
            "found": False,
            "message": "Firmware not found in database",
            "extracted_id": software_id,
        }


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


@router.get("/{firmware_id}/variants")
def get_firmware_variants(
    firmware_id: int,
    db: Session = Depends(get_db_sync)
) -> Dict:
    """
    Получить все Stage варианты для прошивки.
    Если вариантов нет - возвращаем стандартные шаблоны Stage 1/2/3.
    """
    from app.models.firmware_variant import FirmwareVariant, STAGE_TEMPLATES
    
    # Проверяем что прошивка существует
    stmt = select(Firmware).where(Firmware.id == firmware_id)
    result = db.execute(stmt)
    firmware = result.scalar_one_or_none()
    
    if not firmware:
        raise HTTPException(status_code=404, detail="Firmware not found")
    
    # Получаем варианты из БД
    stmt = select(FirmwareVariant).where(FirmwareVariant.firmware_id == firmware_id)
    result = db.execute(stmt)
    variants = result.scalars().all()
    
    if variants:
        # Есть реальные варианты в базе
        return {
            "firmware_id": firmware_id,
            "variants": [
                {
                    "id": v.id,
                    "stage": v.stage,
                    "stage_name": v.stage_name,
                    "description": v.description,
                    "power_increase": v.power_increase,
                    "torque_increase": v.torque_increase,
                    "modifications": v.modifications,
                    "price": float(v.price) if v.price else 50.0,
                    "has_file": v.s3_key is not None,
                }
                for v in variants
            ]
        }
    else:
        # Нет вариантов - возвращаем шаблоны
        # Цены рассчитываем от базовой цены прошивки
        base_price = float(firmware.price) if firmware.price else 50.0
        
        return {
            "firmware_id": firmware_id,
            "variants": [
                {
                    "id": None,  # Шаблон, не реальный вариант
                    "stage": "stage1",
                    "stage_name": STAGE_TEMPLATES["stage1"]["stage_name"],
                    "description": STAGE_TEMPLATES["stage1"]["description"],
                    "power_increase": STAGE_TEMPLATES["stage1"]["power_increase"],
                    "torque_increase": STAGE_TEMPLATES["stage1"]["torque_increase"],
                    "modifications": None,
                    "price": base_price,
                    "has_file": False,  # Файл будет подготовлен после заказа
                },
                {
                    "id": None,
                    "stage": "stage2",
                    "stage_name": STAGE_TEMPLATES["stage2"]["stage_name"],
                    "description": STAGE_TEMPLATES["stage2"]["description"],
                    "power_increase": STAGE_TEMPLATES["stage2"]["power_increase"],
                    "torque_increase": STAGE_TEMPLATES["stage2"]["torque_increase"],
                    "modifications": None,
                    "price": base_price * 1.3,  # Stage 2 на 30% дороже
                    "has_file": False,
                },
                {
                    "id": None,
                    "stage": "stage3",
                    "stage_name": STAGE_TEMPLATES["stage3"]["stage_name"],
                    "description": STAGE_TEMPLATES["stage3"]["description"],
                    "power_increase": STAGE_TEMPLATES["stage3"]["power_increase"],
                    "torque_increase": STAGE_TEMPLATES["stage3"]["torque_increase"],
                    "modifications": None,
                    "price": base_price * 1.6,  # Stage 3 на 60% дороже
                    "has_file": False,
                },
            ],
            "note": "Стандартные варианты. Файл будет подготовлен после оплаты."
        }
