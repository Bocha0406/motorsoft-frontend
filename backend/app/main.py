"""
MotorSoft API Backend
Main FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api import router as api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 MotorSoft API Starting...")
    yield
    # Shutdown
    print("👋 MotorSoft API Shutting down...")


app = FastAPI(
    title="MotorSoft API",
    description="Платформа автоматизации файлового сервиса прошивок ЭБУ/КПП",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "MotorSoft API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",  # TODO: actual check
        "redis": "connected",      # TODO: actual check
    }
