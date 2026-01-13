"""
API Client for backend communication
"""

import httpx
from typing import Optional, Dict, Any
from loguru import logger

from config import settings


class APIClient:
    """Client for backend API communication"""
    
    def __init__(self):
        # Используем URL из настроек (из bot/config.py)
        self.base_url = settings.API_BASE_URL
        # Увеличенный timeout для больших файлов (5 минут)
        self.client = httpx.AsyncClient(timeout=300.0)
    
    async def _request(
        self, 
        method: str, 
        endpoint: str, 
        **kwargs
    ) -> Dict[str, Any]:
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            response = await self.client.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"API error: {e}")
            return {"error": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return {"error": str(e)}
    
    # User endpoints
    async def register_user(
        self,
        telegram_id: int,
        username: Optional[str],
        first_name: Optional[str],
        last_name: Optional[str],
    ) -> Dict:
        """Register or update user"""
        return await self._request(
            "POST",
            "/auth/telegram",
            json={
                "telegram_id": telegram_id,
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
            }
        )
    
    async def get_user(self, telegram_id: int) -> Dict:
        """Get user by telegram ID"""
        return await self._request("GET", f"/users/telegram/{telegram_id}")
    
    async def get_users_list(self) -> Dict:
        """Get all users"""
        return await self._request("GET", "/users/")
    
    # Firmware endpoints (на /api/v1/api/firmware/)
    async def upload_firmware(
        self,
        file_path: str,
        filename: str,
        user_id: int,
    ) -> Dict:
        """
        Upload firmware file and search in database.
        Returns: {found, extracted_id, parse_result, firmware?, similar_firmwares?}
        """
        with open(file_path, "rb") as f:
            files = {"file": (filename, f, "application/octet-stream")}
            return await self._request(
                "POST",
                "/api/firmware/search",
                files=files
            )
    
    async def search_firmware(self, software_id: str) -> Dict:
        """Search firmware by software ID"""
        return await self._request(
            "GET",
            "/api/firmware/search",
            params={"software_id": software_id}
        )
    
    async def get_firmware_variants(self, firmware_id: int) -> Dict:
        """Get Stage variants for firmware (Stage 1/2/3)"""
        return await self._request(
            "GET",
            f"/api/firmware/{firmware_id}/variants"
        )
    
    async def get_firmware_stats(self) -> Dict:
        """Get firmware database statistics"""
        return await self._request("GET", "/api/firmware/stats")
    
    # Order endpoints
    async def get_order(self, order_id: int) -> Dict:
        """Get order by ID"""
        return await self._request("GET", f"/orders/{order_id}")
    
    async def get_user_orders(self, telegram_id: int) -> Dict:
        """Get user's orders"""
        # First get user ID
        user = await self.get_user(telegram_id)
        if user.get("error"):
            return user
        return await self._request("GET", f"/orders/user/{user['id']}")
    
    async def create_order(
        self, 
        telegram_id: int, 
        firmware_id: int,
        original_filename: str = None,
        original_file_path: str = None,
        stage: str = None  # "stage1", "stage2", "stage3"
    ) -> Dict:
        """Create a new order for purchase with optional Stage"""
        return await self._request(
            "POST",
            "/orders/create",
            json={
                "telegram_id": telegram_id,
                "firmware_id": firmware_id,
                "original_filename": original_filename,
                "original_file_path": original_file_path,
                "stage": stage
            }
        )
    
    async def process_purchase(self, order_id: int, user_id: int) -> Dict:
        """Process purchase - check balance and complete"""
        return await self._request(
            "POST",
            f"/orders/{order_id}/purchase",
            params={"user_id": user_id}
        )
    
    async def get_pending_orders(self) -> Dict:
        """Get pending manual orders"""
        return await self._request(
            "GET",
            "/orders/",
            params={"status": "manual"}
        )
    
    # Transaction endpoints
    async def get_transactions(self, telegram_id: int) -> Dict:
        """Get user transactions"""
        user = await self.get_user(telegram_id)
        if user.get("error"):
            return user
        return await self._request("GET", f"/users/{user['id']}/transactions")
    
    # Admin endpoints
    async def get_admin_stats(self) -> Dict:
        """Get admin statistics"""
        # TODO: Implement actual endpoint
        return {
            "total_users": 0,
            "active_users": 0,
            "total_orders": 0,
            "pending_orders": 0,
            "manual_orders": 0,
            "completed_orders": 0,
            "total_revenue": 0,
            "total_firmwares": 0,
        }


# Global client instance
api_client = APIClient()
