"""
WinOLS Database Import Service
Imports firmware data from WinOLS Excel export
"""

import pandas as pd
from datetime import datetime
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from loguru import logger

from app.models.firmware import Firmware


class WinOLSImporter:
    """
    Import firmwares from WinOLS Excel export
    
    Expected columns:
    - Марка (Автомобиль)
    - Series
    - Марка (ECU)
    - Прошивка
    - Project size
    - Создан (Проект)
    - Изменен
    - Карты
    - Версии
    - Файл
    """
    
    COLUMN_MAPPING = {
        'Марка (Автомобиль)': 'brand',
        'Series': 'series',
        'Марка (ECU)': 'ecu_brand',
        'Прошивка': 'software_id',
        'Project size': 'file_size',
        'Создан (Проект)': 'winols_created_at',
        'Изменен': 'winols_updated_at',
        'Карты': 'maps_count',
        'Версии': 'versions_info',
        'Файл': 'winols_file',
    }
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def import_from_excel(
        self, 
        file_path: str,
        update_existing: bool = True
    ) -> Dict:
        """
        Import firmwares from Excel file
        
        Args:
            file_path: Path to Excel file
            update_existing: Update existing records or skip
            
        Returns:
            Import statistics
        """
        stats = {
            "total": 0,
            "created": 0,
            "updated": 0,
            "skipped": 0,
            "errors": [],
        }
        
        try:
            # Read Excel
            df = pd.read_excel(file_path, sheet_name=0)
            stats["total"] = len(df)
            
            logger.info(f"Importing {len(df)} records from {file_path}")
            
            # Process each row
            for idx, row in df.iterrows():
                try:
                    result = await self._process_row(row, update_existing)
                    stats[result] += 1
                except Exception as e:
                    stats["errors"].append({
                        "row": idx,
                        "error": str(e),
                    })
                    logger.error(f"Error importing row {idx}: {e}")
            
            await self.db.commit()
            
            logger.info(
                f"Import complete: {stats['created']} created, "
                f"{stats['updated']} updated, {stats['skipped']} skipped"
            )
            
        except Exception as e:
            logger.error(f"Import failed: {e}")
            stats["errors"].append({"error": str(e)})
        
        return stats
    
    async def _process_row(self, row: pd.Series, update_existing: bool) -> str:
        """Process single row from Excel"""
        
        # Skip empty rows
        if pd.isna(row.get('Марка (Автомобиль)')) or pd.isna(row.get('Прошивка')):
            return "skipped"
        
        # Extract WinOLS ID from filename
        winols_file = row.get('Файл', '')
        winols_id = None
        if winols_file:
            # MOTORSOFT_10088.ols -> 10088
            import re
            match = re.search(r'MOTORSOFT_(\d+)', str(winols_file), re.IGNORECASE)
            if match:
                winols_id = match.group(1)
        
        # Check if exists
        existing = None
        if winols_id:
            result = await self.db.execute(
                select(Firmware).where(Firmware.winols_id == winols_id)
            )
            existing = result.scalar_one_or_none()
        
        if existing:
            if update_existing:
                # Update existing record
                self._update_firmware(existing, row)
                return "updated"
            else:
                return "skipped"
        else:
            # Create new record
            firmware = self._create_firmware(row, winols_id)
            self.db.add(firmware)
            return "created"
    
    def _create_firmware(self, row: pd.Series, winols_id: Optional[str]) -> Firmware:
        """Create new Firmware from row data"""
        return Firmware(
            winols_id=winols_id,
            winols_file=str(row.get('Файл', '')),
            brand=self._clean_string(row.get('Марка (Автомобиль)')),
            series=self._clean_string(row.get('Series')),
            ecu_brand=self._clean_string(row.get('Марка (ECU)')),
            software_id=self._clean_string(row.get('Прошивка')),
            file_size=self._safe_int(row.get('Project size')),
            maps_count=self._safe_int(row.get('Карты')),
            versions_info=self._clean_string(row.get('Версии')),
            winols_created_at=self._parse_date(row.get('Создан (Проект)')),
            winols_updated_at=self._parse_date(row.get('Изменен')),
            source="winols",
            base_price=50.0,  # Default price
        )
    
    def _update_firmware(self, firmware: Firmware, row: pd.Series):
        """Update existing Firmware from row data"""
        firmware.brand = self._clean_string(row.get('Марка (Автомобиль)')) or firmware.brand
        firmware.series = self._clean_string(row.get('Series')) or firmware.series
        firmware.ecu_brand = self._clean_string(row.get('Марка (ECU)')) or firmware.ecu_brand
        firmware.software_id = self._clean_string(row.get('Прошивка')) or firmware.software_id
        firmware.file_size = self._safe_int(row.get('Project size')) or firmware.file_size
        firmware.maps_count = self._safe_int(row.get('Карты')) or firmware.maps_count
        firmware.versions_info = self._clean_string(row.get('Версии')) or firmware.versions_info
        firmware.winols_updated_at = self._parse_date(row.get('Изменен')) or firmware.winols_updated_at
    
    def _clean_string(self, value) -> Optional[str]:
        """Clean string value"""
        if pd.isna(value):
            return None
        return str(value).strip()
    
    def _safe_int(self, value) -> Optional[int]:
        """Safe convert to int"""
        if pd.isna(value):
            return None
        try:
            return int(value)
        except (ValueError, TypeError):
            return None
    
    def _parse_date(self, value) -> Optional[datetime]:
        """Parse date from WinOLS format"""
        if pd.isna(value):
            return None
        try:
            # Format: 21.11.2025 (14:40:44)
            date_str = str(value).split(' (')[0]
            return datetime.strptime(date_str, '%d.%m.%Y')
        except (ValueError, TypeError):
            return None
