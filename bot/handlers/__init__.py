"""
Bot handlers
"""

from aiogram import Router

from handlers.start import router as start_router
from handlers.upload import router as upload_router
from handlers.balance import router as balance_router
from handlers.orders import router as orders_router
from handlers.admin import router as admin_router

router = Router()

router.include_router(start_router)
router.include_router(upload_router)
router.include_router(balance_router)
router.include_router(orders_router)
router.include_router(admin_router)
