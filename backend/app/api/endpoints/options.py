"""
Tuning Options API endpoints
Получение списка опций и управление ими
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from pydantic import BaseModel

from app.core.database import get_db
from app.models.tuning_option import TuningOption, TUNING_OPTIONS, get_options_by_category

router = APIRouter(prefix="/options", tags=["Tuning Options"])


class OptionResponse(BaseModel):
    """Response model for tuning option"""
    code: str
    name: str
    name_ru: Optional[str] = None
    description: Optional[str] = None
    category: str
    price: float = 0.0
    emoji: str = "🔧"
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[OptionResponse])
async def get_all_options(
    category: Optional[str] = Query(None, description="Фильтр по категории: eco, performance, comfort"),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить все доступные опции тюнинга
    
    Категории:
    - eco: Экология (DPF, EGR, AdBlue и т.д.)
    - performance: Производительность (Pop&Bang, Launch Control и т.д.)
    - comfort: Комфорт (Start/Stop OFF, DTC OFF и т.д.)
    """
    try:
        # Пробуем получить из БД
        query = select(TuningOption).where(TuningOption.is_active == True)
        if category:
            query = query.where(TuningOption.category == category)
        query = query.order_by(TuningOption.sort_order)
        
        result = await db.execute(query)
        options = result.scalars().all()
        
        if options:
            return options
    except Exception:
        # Если таблицы нет, возвращаем из констант
        pass
    
    # Fallback на константы
    options = get_options_by_category(category)
    return [OptionResponse(**opt, price=0.0) for opt in options]


@router.get("/categories")
async def get_categories():
    """Получить список категорий опций"""
    return {
        "categories": [
            {"code": "eco", "name": "Экология", "emoji": "🌿", "description": "Отключение экологических систем"},
            {"code": "performance", "name": "Производительность", "emoji": "🏎️", "description": "Улучшение динамики"},
            {"code": "comfort", "name": "Комфорт", "emoji": "✨", "description": "Улучшение удобства использования"}
        ]
    }


@router.get("/popular")
async def get_popular_options():
    """Получить популярные опции для быстрого выбора"""
    popular_codes = ["dpf_off", "egr_off", "pop_bang", "launch_control", "start_stop_off"]
    options = [opt for opt in TUNING_OPTIONS if opt["code"] in popular_codes]
    return {"options": [OptionResponse(**opt, price=0.0) for opt in options]}


@router.get("/{code}")
async def get_option_by_code(
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """Получить информацию об опции по коду"""
    try:
        result = await db.execute(
            select(TuningOption).where(TuningOption.code == code)
        )
        option = result.scalar_one_or_none()
        if option:
            return OptionResponse.model_validate(option)
    except Exception:
        pass
    
    # Fallback
    for opt in TUNING_OPTIONS:
        if opt["code"] == code:
            return OptionResponse(**opt, price=0.0)
    
    raise HTTPException(status_code=404, detail=f"Option {code} not found")
