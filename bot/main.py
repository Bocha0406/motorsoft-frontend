"""
MotorSoft Telegram Bot
Main entry point
"""

import asyncio
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.client.session.aiohttp import AiohttpSession
from loguru import logger

from config import settings
from handlers import router as main_router
from middlewares.auth import AuthMiddleware


async def main():
    """Start the bot"""
    
    # Create session with increased timeout for large file downloads (10 minutes = 600 sec)
    # AiohttpSession expects numeric timeout (in seconds)
    session = AiohttpSession(timeout=600)
    
    # Initialize bot
    bot = Bot(
        token=settings.BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
        session=session
    )
    
    # Initialize dispatcher
    dp = Dispatcher()
    
    # Register middlewares
    dp.message.middleware(AuthMiddleware())
    dp.callback_query.middleware(AuthMiddleware())
    
    # Register routers
    dp.include_router(main_router)
    
    # Start
    logger.info("🤖 MotorSoft Bot starting...")
    
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
