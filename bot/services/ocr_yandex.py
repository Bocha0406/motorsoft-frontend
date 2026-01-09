"""
OCR Service with Yandex Vision API
Значительно улучшенное распознавание текста на скриншотах

Yandex Vision: ~100₽ за 1000 изображений
Точность: 95%+ vs 60-70% у Tesseract
"""

import re
import base64
import aiohttp
from typing import Optional, Dict, List
from pathlib import Path
from loguru import logger

# Fallback to Tesseract if Yandex not configured
try:
    import pytesseract
    from PIL import Image, ImageEnhance, ImageFilter
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False


class YandexVisionOCR:
    """
    OCR Service using Yandex Vision API with Tesseract fallback
    
    Supported patterns:
    - Toyota/Lexus: 89663-47351, 89666-02J22
    - VAG: 03L906018RR, 4L0910552B
    - BMW: 7626957, 8615088  
    - Mercedes: A2789003500
    - Hyundai/Kia: 39128-2B270
    - Ford: AV6A-12A650-AXD
    - Bosch ECU: 0281018428
    - Denso ECU: 275700-0193
    - Chinese ECU: F01R*, GCQ*, etc.
    """
    
    YANDEX_VISION_URL = "https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze"
    
    # Patterns for different firmware ID formats
    FIRMWARE_PATTERNS = [
        # Toyota/Lexus/Subaru: 89663-47351, 89666-02J22
        (r'\b(89[0-9]{3}[-\s]?[0-9A-Z]{5})\b', 'Toyota/Lexus'),
        
        # VAG (VW/Audi/Skoda/Seat): 03L906018RR, 4L0910552B
        (r'\b([0-9][A-Z][0-9][A-Z]?[0-9]{6}[A-Z]{0,3})\b', 'VAG'),
        
        # BMW: 7-8 digit codes like 7626957, 8615088
        (r'\b(7[0-9]{6}|8[0-9]{6})\b', 'BMW'),
        
        # Mercedes: A2789003500 (starts with A, 10 digits)
        (r'\b(A[0-9]{10})\b', 'Mercedes'),
        
        # Hyundai/Kia: 39128-2B270
        (r'\b(39[0-9]{3}[-\s]?[0-9][A-Z][0-9]{3})\b', 'Hyundai/Kia'),
        
        # Ford: AV6A-12A650-AXD (3 blocks with dashes)
        (r'\b([A-Z]{2}[0-9][A-Z][-\s]?[0-9]{2}[A-Z][0-9]{3}[-\s]?[A-Z]{2,3})\b', 'Ford'),
        
        # Bosch ECU part numbers: 0281018428, 0261206076
        (r'\b(02[68]1[0-9]{6})\b', 'Bosch ECU'),
        
        # Denso part numbers: 275700-0193
        (r'\b(27[0-9]{4}[-\s]?[0-9]{4})\b', 'Denso'),
        
        # Continental: A2C53374830
        (r'\b(A2C[0-9]{8})\b', 'Continental'),
        
        # ========== CHINESE ECU PATTERNS ==========
        
        # UAES/Bosch China: F01R0AD3G0, F01RB0D2T4, F01R00DX1C
        (r'\b(F01R[0A-Z0-9]{5,8})\b', 'UAES/Bosch China'),
        
        # Chinese ECU calibration: GCQBRB44CQS03A00
        (r'\b(GCQ[A-Z0-9]{10,15})\b', 'Chinese ECU'),
        
        # Chinese ECU type 2: FE315NMT
        (r'\b(FE[0-9]{3}[A-Z0-9]{2,5})\b', 'Chinese ECU FE'),
        
        # UAES B05 format: B05_0100F01R00DGQ7
        (r'\b(B0[0-9]_[0-9A-Z]{10,20})\b', 'UAES B05'),
        
        # LB6 calibration: LB6WA001
        (r'\b(LB[0-9][A-Z]{2}[0-9]{3})\b', 'LB Calibration'),
        
        # Bosch MED17/EDC17 - 1037XXXXXXX
        (r'\b(1037[0-9]{6,10})\b', 'Bosch MED17'),
        
        # Generic: ANY-THING-123 (for unknown formats)
        (r'\b([A-Z0-9]{2,6}[-][A-Z0-9]{2,6}[-]?[A-Z0-9]{0,6})\b', 'Generic'),
        
        # Software calibration ID: XXXX-XXX
        (r'\b([0-9]{5}[-][0-9A-Z]{5})\b', 'Calibration ID'),
    ]

    def __init__(self, folder_id: str = None, api_key: str = None, iam_token: str = None):
        """
        Initialize Yandex Vision OCR
        
        Args:
            folder_id: Yandex Cloud folder ID
            api_key: API key for service account
            iam_token: IAM token (alternative to api_key)
        """
        self.folder_id = folder_id
        self.api_key = api_key
        self.iam_token = iam_token
        
        self.yandex_available = bool(folder_id and (api_key or iam_token))
        self.tesseract_available = TESSERACT_AVAILABLE
        
        if self.yandex_available:
            logger.info("✅ Yandex Vision API initialized")
        elif self.tesseract_available:
            logger.warning("⚠️ Yandex Vision not configured, using Tesseract fallback")
        else:
            logger.error("❌ No OCR service available!")
    
    def _get_auth_header(self) -> Dict[str, str]:
        """Get authorization header for Yandex API"""
        if self.api_key:
            return {"Authorization": f"Api-Key {self.api_key}"}
        elif self.iam_token:
            return {"Authorization": f"Bearer {self.iam_token}"}
        return {}
    
    async def _yandex_ocr(self, image_path: str) -> str:
        """
        Extract text using Yandex Vision API
        
        API docs: https://cloud.yandex.ru/docs/vision/operations/ocr/text-detection
        """
        try:
            # Read and encode image
            with open(image_path, 'rb') as f:
                image_data = base64.b64encode(f.read()).decode('utf-8')
            
            # Prepare request
            headers = {
                "Content-Type": "application/json",
                **self._get_auth_header()
            }
            
            payload = {
                "folderId": self.folder_id,
                "analyze_specs": [{
                    "content": image_data,
                    "features": [{
                        "type": "TEXT_DETECTION",
                        "text_detection_config": {
                            "language_codes": ["en", "ru"]  # English + Russian
                        }
                    }]
                }]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.YANDEX_VISION_URL,
                    headers=headers,
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=30)
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Yandex Vision API error: {response.status} - {error_text}")
                        return ""
                    
                    result = await response.json()
            
            # Extract text from response
            text_parts = []
            for res in result.get("results", []):
                for r in res.get("results", []):
                    text_annotation = r.get("textDetection", {})
                    for page in text_annotation.get("pages", []):
                        for block in page.get("blocks", []):
                            for line in block.get("lines", []):
                                line_text = " ".join(
                                    word.get("text", "") 
                                    for word in line.get("words", [])
                                )
                                if line_text:
                                    text_parts.append(line_text)
            
            text = "\n".join(text_parts)
            logger.info(f"Yandex Vision extracted {len(text)} chars from image")
            return text
            
        except Exception as e:
            logger.error(f"Yandex Vision OCR failed: {e}")
            return ""
    
    def _tesseract_ocr(self, image_path: str) -> str:
        """Fallback: Extract text using Tesseract"""
        if not self.tesseract_available:
            return ""
        
        try:
            img = Image.open(image_path)
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if 'A' in img.mode:
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Convert to grayscale and enhance
            img = img.convert('L')
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2.0)
            img = img.filter(ImageFilter.SHARPEN)
            
            # OCR
            text = pytesseract.image_to_string(img, config='--oem 3 --psm 6 -l eng')
            logger.info(f"Tesseract extracted {len(text)} chars from image")
            return text
            
        except Exception as e:
            logger.error(f"Tesseract OCR failed: {e}")
            return ""
    
    async def extract_text(self, image_path: str) -> str:
        """
        Extract text from image
        Uses Yandex Vision if available, falls back to Tesseract
        """
        # Try Yandex first
        if self.yandex_available:
            text = await self._yandex_ocr(image_path)
            if text:
                return text
            logger.warning("Yandex Vision returned empty, trying Tesseract...")
        
        # Fallback to Tesseract
        if self.tesseract_available:
            return self._tesseract_ocr(image_path)
        
        return ""
    
    def find_firmware_ids(self, text: str) -> List[Dict]:
        """
        Find all firmware IDs in text using pattern matching
        Returns list of {id, type, confidence}
        """
        results = []
        found_ids = set()  # Avoid duplicates
        
        # Normalize text
        text = re.sub(r'\s+', ' ', text.upper())
        
        for pattern, id_type in self.FIRMWARE_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                firmware_id = match.group(1).upper().replace(' ', '')
                
                if firmware_id not in found_ids:
                    found_ids.add(firmware_id)
                    
                    # Higher confidence for specific patterns
                    confidence = 0.95 if id_type not in ('Generic', 'VIN/Serial') else 0.5
                    
                    results.append({
                        'id': firmware_id,
                        'type': id_type,
                        'confidence': confidence
                    })
        
        # Sort by confidence descending
        results.sort(key=lambda x: x['confidence'], reverse=True)
        
        return results
    
    async def process_screenshot(self, image_path: str) -> Dict:
        """
        Main method: process screenshot and extract firmware IDs
        
        Returns:
        {
            "success": bool,
            "text": str,
            "firmware_ids": [{"id": str, "type": str, "confidence": float}],
            "best_match": {"id": str, "type": str} or None,
            "ocr_provider": "yandex" | "tesseract" | None,
            "error": str or None
        }
        """
        if not self.yandex_available and not self.tesseract_available:
            return {
                "success": False,
                "text": "",
                "firmware_ids": [],
                "best_match": None,
                "ocr_provider": None,
                "error": "OCR недоступен. Настройте Yandex Vision или установите Tesseract."
            }
        
        try:
            # Check if file exists
            if not Path(image_path).exists():
                return {
                    "success": False,
                    "text": "",
                    "firmware_ids": [],
                    "best_match": None,
                    "ocr_provider": None,
                    "error": "Файл не найден"
                }
            
            # Determine which OCR will be used
            ocr_provider = "yandex" if self.yandex_available else "tesseract"
            
            # Extract text
            text = await self.extract_text(image_path)
            
            if not text.strip():
                return {
                    "success": False,
                    "text": "",
                    "firmware_ids": [],
                    "best_match": None,
                    "ocr_provider": ocr_provider,
                    "error": "Не удалось распознать текст на изображении"
                }
            
            # Find firmware IDs
            firmware_ids = self.find_firmware_ids(text)
            
            if not firmware_ids:
                return {
                    "success": False,
                    "text": text[:500],
                    "firmware_ids": [],
                    "best_match": None,
                    "ocr_provider": ocr_provider,
                    "error": "ID прошивки не найден. Попробуйте загрузить более чёткий скриншот."
                }
            
            return {
                "success": True,
                "text": text[:500],
                "firmware_ids": firmware_ids,
                "best_match": firmware_ids[0],
                "ocr_provider": ocr_provider,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Screenshot processing failed: {e}")
            return {
                "success": False,
                "text": "",
                "firmware_ids": [],
                "best_match": None,
                "ocr_provider": None,
                "error": f"Ошибка обработки: {str(e)}"
            }


# Global instance (will be configured from settings)
yandex_ocr_service = None


def init_yandex_ocr(folder_id: str = None, api_key: str = None, iam_token: str = None):
    """Initialize Yandex Vision OCR service"""
    global yandex_ocr_service
    yandex_ocr_service = YandexVisionOCR(folder_id, api_key, iam_token)
    return yandex_ocr_service


def get_ocr_service() -> YandexVisionOCR:
    """Get OCR service instance"""
    global yandex_ocr_service
    if yandex_ocr_service is None:
        # Create with defaults (Tesseract only)
        yandex_ocr_service = YandexVisionOCR()
    return yandex_ocr_service
