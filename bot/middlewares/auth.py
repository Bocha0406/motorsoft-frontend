"""
Authentication middleware
"""

from typing import Callable, Dict, Any, Awaitable
from aiogram import BaseMiddleware
from aiogram.types import Message, CallbackQuery, TelegramObject

from services.api import api_client


class AuthMiddleware(BaseMiddleware):
    """
    Middleware to ensure user is registered
    Also updates last_active timestamp
    """
    
    async def __call__(
        self,
        handler: Callable[[TelegramObject, Dict[str, Any]], Awaitable[Any]],
        event: TelegramObject,
        data: Dict[str, Any],
    ) -> Any:
        
        # Get user from event
        user = None
        if isinstance(event, Message):
            user = event.from_user
        elif isinstance(event, CallbackQuery):
            user = event.from_user
        
        if user:
            # Ensure user exists in database
            # This also updates last_active
            data["db_user"] = await api_client.get_user(user.id)
        
        return await handler(event, data)
