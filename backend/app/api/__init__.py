"""
API Routes
"""

from fastapi import APIRouter

from app.api.endpoints import auth, users, firmwares, orders, upload, firmware_search, admin, analytics, options

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(firmwares.router, prefix="/firmwares", tags=["firmwares"])
router.include_router(orders.router, prefix="/orders", tags=["orders"])
router.include_router(upload.router, prefix="/upload", tags=["upload"])
router.include_router(firmware_search.router)  # Already has /api/firmware prefix
router.include_router(admin.router)  # /api/admin endpoints
router.include_router(analytics.router)  # /analytics endpoints (admin only)
router.include_router(options.router)  # /options - tuning options
