"""
Тест парсера BIN файлов на реальных примерах
"""
import sys
sys.path.append('/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/backend')

from app.services.firmware_parser import FirmwareParser
from loguru import logger

# Пути к тестовым файлам
TEST_FILES = [
    "/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/Toyota Prius 1.8 (89663-47351_E2_EGR).bin",
    "/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/Z601EF000Z6V5060-20251229-125826 (1).bin",
    "/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/GS75R2AS65CC_6165C010_6165C051.bin",
    "/Volumes/Extreme SSD/Проекты Мах/MotorSoft 06.01.26/mb_bosch_med17_7_1_obd_virtualmaps_wdd2183591a004782_20251229110659.bin",
]

def test_parser():
    parser = FirmwareParser()
    
    for file_path in TEST_FILES:
        logger.info(f"\n{'='*80}")
        logger.info(f"Testing: {file_path.split('/')[-1]}")
        logger.info(f"{'='*80}")
        
        result = parser.parse_file(file_path)
        
        logger.info(f"Software ID: {result.get('software_id')}")
        logger.info(f"Brand: {result.get('brand')}")
        logger.info(f"ECU: {result.get('ecu')}")
        logger.info(f"File Size: {result.get('file_size'):,} bytes")
        logger.info(f"Confidence: {result.get('confidence')}")
        
        if result.get('all_matches'):
            logger.info(f"\nAll matches found:")
            for match in result['all_matches'][:5]:
                logger.info(f"  - {match}")

if __name__ == "__main__":
    test_parser()
