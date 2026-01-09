"""
OCR Service for screenshot recognition
Extracts firmware IDs (Software ID, Part Number) from images
"""

import re
from typing import Optional, Dict, List
from pathlib import Path
from loguru import logger

try:
    import pytesseract
    from PIL import Image, ImageEnhance, ImageFilter
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    logger.warning("pytesseract or Pillow not installed. OCR will be disabled.")


class OCRService:
    """
    Service for extracting firmware identifiers from screenshots
    
    Supported patterns:
    - Toyota/Lexus: 89663-47351, 89666-02J22
    - VAG: 03L906018RR, 4L0910552B
    - BMW: 7626957, 8615088  
    - Mercedes: A2789003500
    - Hyundai/Kia: 39128-2B270
    - Ford: AV6A-12A650-AXD
    - Bosch ECU: 0281018428
    - Denso ECU: 275700-0193
    """
    
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
        
        # UAES/Bosch China: F01R0AD3G0, F01RB0D2T4, F01R00DX1C (F01R + 6-7 chars)
        (r'\b(F01R[0A-Z0-9]{5,8})\b', 'UAES/Bosch China'),
        
        # Chinese ECU calibration: GCQBRB44CQS03A00 (starts with GCQ or similar)
        (r'\b(GCQ[A-Z0-9]{10,15})\b', 'Chinese ECU'),
        
        # Chinese ECU type 2: FE315NMT, similar format
        (r'\b(FE[0-9]{3}[A-Z0-9]{2,5})\b', 'Chinese ECU FE'),
        
        # UAES B05 format: B05_0100F01R00DGQ7
        (r'\b(B0[0-9]_[0-9A-Z]{10,20})\b', 'UAES B05'),
        
        # LB6 calibration: LB6WA001
        (r'\b(LB[0-9][A-Z]{2}[0-9]{3})\b', 'LB Calibration'),
        
        # J4G engine type: J4G15, J4G12
        (r'\b(J[0-9][A-Z][0-9]{2})\b', 'Engine Type'),
        
        # Chinese VIN-like: YHK382455XB000329 (17 chars)
        (r'\b([A-Z]{2,3}[0-9]{5,6}[A-Z0-9]{8,10})\b', 'VIN/Serial'),
        
        # ========== END CHINESE PATTERNS ==========
        
        # Generic: ANY-THING-123 (for unknown formats)
        (r'\b([A-Z0-9]{2,6}[-][A-Z0-9]{2,6}[-]?[A-Z0-9]{0,6})\b', 'Generic'),
        
        # Software calibration ID: XXXX-XXX (common format)
        (r'\b([0-9]{5}[-][0-9A-Z]{5})\b', 'Calibration ID'),
    ]

    def __init__(self):
        self.is_available = OCR_AVAILABLE
        if OCR_AVAILABLE:
            # Configure tesseract for better results
            # Use -l eng for English (best for alphanumeric codes)
            self.tesseract_config = '--oem 3 --psm 6 -l eng'
    
    def preprocess_image(self, image_path: str) -> Optional[Image.Image]:
        """
        Preprocess image for better OCR results
        - Convert to grayscale
        - Enhance contrast
        - Apply sharpening
        """
        try:
            img = Image.open(image_path)
            
            # Convert to RGB if necessary (handles PNG with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Convert to grayscale
            img = img.convert('L')
            
            # Enhance contrast
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(2.0)
            
            # Sharpen
            img = img.filter(ImageFilter.SHARPEN)
            
            # Optional: Resize if image is too small
            if img.width < 500:
                ratio = 500 / img.width
                img = img.resize((500, int(img.height * ratio)), Image.Resampling.LANCZOS)
            
            return img
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {e}")
            return None
    
    def extract_text(self, image_path: str) -> str:
        """Extract all text from image using OCR"""
        if not self.is_available:
            logger.error("OCR not available - pytesseract or Pillow not installed")
            return ""
        
        try:
            # Preprocess
            img = self.preprocess_image(image_path)
            if img is None:
                return ""
            
            # Extract text
            text = pytesseract.image_to_string(img, config=self.tesseract_config)
            logger.debug(f"OCR extracted text: {text[:200]}...")
            
            return text
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return ""
    
    def find_firmware_ids(self, text: str) -> List[Dict]:
        """
        Find all firmware IDs in text using pattern matching
        Returns list of {id, type, confidence}
        """
        results = []
        found_ids = set()  # Avoid duplicates
        
        # Normalize text - replace newlines and multiple spaces
        text = re.sub(r'\s+', ' ', text.upper())
        
        for pattern, id_type in self.FIRMWARE_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                firmware_id = match.group(1).upper()
                # Normalize: remove spaces, keep dashes
                firmware_id = firmware_id.replace(' ', '')
                
                if firmware_id not in found_ids:
                    found_ids.add(firmware_id)
                    
                    # Calculate confidence based on pattern specificity
                    confidence = 0.9 if id_type != 'Generic' else 0.5
                    
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
            "text": str (extracted text),
            "firmware_ids": [{"id": str, "type": str, "confidence": float}],
            "best_match": {"id": str, "type": str} or None,
            "error": str or None
        }
        """
        if not self.is_available:
            return {
                "success": False,
                "text": "",
                "firmware_ids": [],
                "best_match": None,
                "error": "OCR недоступен. Установите tesseract-ocr."
            }
        
        try:
            # Check if file exists
            if not Path(image_path).exists():
                return {
                    "success": False,
                    "text": "",
                    "firmware_ids": [],
                    "best_match": None,
                    "error": "Файл не найден"
                }
            
            # Extract text
            text = self.extract_text(image_path)
            
            if not text.strip():
                return {
                    "success": False,
                    "text": "",
                    "firmware_ids": [],
                    "best_match": None,
                    "error": "Не удалось распознать текст на изображении"
                }
            
            # Find firmware IDs
            firmware_ids = self.find_firmware_ids(text)
            
            if not firmware_ids:
                return {
                    "success": False,
                    "text": text[:500],  # First 500 chars for debugging
                    "firmware_ids": [],
                    "best_match": None,
                    "error": "ID прошивки не найден. Попробуйте загрузить более чёткий скриншот."
                }
            
            return {
                "success": True,
                "text": text[:500],
                "firmware_ids": firmware_ids,
                "best_match": firmware_ids[0] if firmware_ids else None,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Screenshot processing failed: {e}")
            return {
                "success": False,
                "text": "",
                "firmware_ids": [],
                "best_match": None,
                "error": f"Ошибка обработки: {str(e)}"
            }


# Global instance
ocr_service = OCRService()
