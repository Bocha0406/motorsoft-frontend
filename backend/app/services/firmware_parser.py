"""
Firmware Parser Service
Extracts identification info from BIN files
"""

import re
import string
from typing import Optional, Dict, List, Tuple
from dataclasses import dataclass
from loguru import logger


@dataclass
class ParseResult:
    """Result of firmware parsing"""
    software_id: Optional[str] = None
    hardware_id: Optional[str] = None
    brand: Optional[str] = None
    ecu: Optional[str] = None
    file_size: int = 0
    confidence: float = 0.0


class FirmwareParser:
    """
    Parser for extracting identification from ECU firmware files
    
    Supported ECU types:
    - Denso (Toyota, Mazda, Honda, Subaru)
    - Bosch (Mercedes, BMW, VAG, Ford)
    - Siemens/Continental
    - Delphi
    """
    
    # Known patterns for different ECU manufacturers
    PATTERNS = {
        # Toyota/Denso: 89663-XXXXX format
        "denso_toyota": {
            "regex": rb'89663-[0-9A-Z]{5}',
            "brand": "Toyota",
            "ecu": "Denso",
        },
        # Lexus/Denso: 89663-XXXXX format  
        "denso_lexus": {
            "regex": rb'89661-[0-9A-Z]{5}',
            "brand": "Lexus",
            "ecu": "Denso",
        },
        # Mazda/Denso: Z6XXXXXX format
        "denso_mazda": {
            "regex": rb'Z6[0-9]{2}[0-9A-Z]{2}C[0-9]{5}',
            "brand": "Mazda",
            "ecu": "Denso",
        },
        # Honda/Keihin: 37805-XXX-XXXX format
        "keihin_honda": {
            "regex": rb'37805-[A-Z0-9]{3}-[A-Z0-9]{4}',
            "brand": "Honda/Acura",
            "ecu": "Keihin",
        },
        # Bosch MED17 with 1037 prefix (Mercedes)
        "bosch_1037": {
            "regex": rb'1037[0-9]{6,12}[A-Z0-9]*',
            "brand": "MB",
            "ecu": "Bosch",
        },
        # Bosch 27XXXXXXXX format (common for MB)
        "bosch_27xx": {
            "regex": rb'27[0-9]{8}',
            "brand": "MB",
            "ecu": "Bosch",
        },
        # Bosch 26XXXXXXXX format  
        "bosch_26xx": {
            "regex": rb'26[0-9]{8}',
            "brand": "MB",
            "ecu": "Bosch",
        },
        # Hyundai/Kia GCQB format
        "hyundai_gcq": {
            "regex": rb'GCQ[A-Z0-9]{10,15}',
            "brand": "Hyundai/Kia",
            "ecu": "Bosch",
        },
        # Chinese UAES F01R format
        "chinese_f01r": {
            "regex": rb'F01R[0-9A-Z]{5,10}',
            "brand": None,
            "ecu": "Bosch/UAES",
        },
        # Generic 10-digit Bosch SW (last resort)
        "bosch_10digit": {
            "regex": rb'[0-9]{10}',
            "brand": None,
            "ecu": "Bosch",
        },
    }
    
    # Known offsets where IDs are typically located
    KNOWN_OFFSETS = {
        "denso": [0x7E0, 0x7EC, 0x800, 0x1FFC, 0x2000],
        "bosch": [0x1C000, 0x1FFF0, 0x3FFF0, 0x7FFF0],
        "siemens": [0x10000, 0x20000],
    }
    
    def __init__(self):
        self.printable = set(string.printable.encode())
    
    def parse_file(self, file_path: str) -> Dict:
        """
        Parse firmware file and extract identification
        
        Args:
            file_path: Path to .bin file
            
        Returns:
            Dictionary with parsed info
        """
        try:
            with open(file_path, 'rb') as f:
                data = f.read()
            
            return self.parse_data(data)
            
        except Exception as e:
            logger.error(f"Error parsing file {file_path}: {e}")
            return {"error": str(e)}
    
    def parse_data(self, data: bytes) -> Dict:
        """
        Parse firmware data
        
        Args:
            data: Raw firmware bytes
            
        Returns:
            Dictionary with parsed info
        """
        result = {
            "software_id": None,
            "hardware_id": None,
            "brand": None,
            "ecu": None,
            "file_size": len(data),
            "confidence": 0.0,
            "all_matches": [],
        }
        
        # Try each pattern
        for pattern_name, pattern_info in self.PATTERNS.items():
            matches = re.findall(pattern_info["regex"], data)
            if matches:
                # Take first match as primary
                match = matches[0].decode('ascii', errors='ignore')
                
                result["all_matches"].append({
                    "pattern": pattern_name,
                    "match": match,
                    "count": len(matches),
                })
                
                # Set result if not already set
                if not result["software_id"]:
                    result["software_id"] = match
                    result["brand"] = pattern_info["brand"]
                    result["ecu"] = pattern_info["ecu"]
                    result["confidence"] = 0.9
        
        # If no pattern matched, try to extract readable strings
        if not result["software_id"]:
            strings = self._extract_strings(data)
            potential_ids = self._filter_potential_ids(strings)
            
            if potential_ids:
                result["software_id"] = potential_ids[0][1]
                result["confidence"] = 0.5
                result["all_matches"] = [
                    {"pattern": "string_search", "match": s, "offset": hex(o)}
                    for o, s in potential_ids[:5]
                ]
        
        return result
    
    def _extract_strings(self, data: bytes, min_length: int = 8) -> List[Tuple[int, str]]:
        """Extract readable ASCII strings from binary data"""
        strings = []
        current = []
        start_offset = 0
        
        for i, byte in enumerate(data[:100000]):  # First 100KB
            if byte in self.printable and byte not in b'\r\n\t\x00':
                if not current:
                    start_offset = i
                current.append(chr(byte))
            else:
                if len(current) >= min_length:
                    s = ''.join(current)
                    strings.append((start_offset, s))
                current = []
        
        return strings
    
    def _filter_potential_ids(self, strings: List[Tuple[int, str]]) -> List[Tuple[int, str]]:
        """Filter strings that look like firmware IDs"""
        potential = []
        
        for offset, s in strings:
            # Must have both letters and numbers
            if not (any(c.isdigit() for c in s) and any(c.isalpha() for c in s)):
                continue
            
            # Not too long
            if len(s) > 30:
                continue
            
            # Not just hex
            if all(c in '0123456789ABCDEFabcdef' for c in s):
                continue
            
            # Contains dash or specific patterns
            if '-' in s or any(p in s.upper() for p in ['ECU', 'SW', 'HW', 'VER']):
                potential.insert(0, (offset, s))  # Higher priority
            else:
                potential.append((offset, s))
        
        return potential
    
    def identify_ecu_type(self, data: bytes) -> Optional[str]:
        """Identify ECU manufacturer by file size and signatures"""
        size = len(data)
        
        # Size-based heuristics
        size_hints = {
            (512 * 1024): "Denso",      # 512KB
            (1024 * 1024): "Denso",     # 1MB
            (2 * 1024 * 1024): "Bosch", # 2MB
            (4 * 1024 * 1024): "Bosch", # 4MB
        }
        
        for expected_size, ecu in size_hints.items():
            if abs(size - expected_size) < 1024:  # Within 1KB
                return ecu
        
        # Signature-based
        if b'DENSO' in data or b'Copr.DENSO' in data:
            return "Denso"
        if b'BOSCH' in data or b'Robert Bosch' in data:
            return "Bosch"
        if b'Siemens' in data or b'Continental' in data:
            return "Siemens"
        
        return None
