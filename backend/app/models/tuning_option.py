"""
TuningOption model - дополнительные опции тюнинга

Опции, которые можно добавить к Stage:
- DPF OFF (сажевый фильтр)
- EGR OFF (рециркуляция газов)
- AdBlue OFF (мочевина)
- Pop&Bang (выстрелы в выхлоп)
- Launch Control (старт с места)
- Burble Map (бурление на сбросе газа)
- Swirl Flaps OFF (заслонки впуска)
- Start/Stop OFF (автозапуск двигателя)
- Speed Limiter OFF (ограничитель скорости)
- Hot Start Fix (горячий старт)
- DTC OFF (отключение кодов ошибок)
- EVAP OFF (система вентиляции топливного бака)
- O2 OFF (кислородные датчики)
- Catalyst OFF (катализатор)
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from app.core.database import Base


class TuningOption(Base):
    """Модель дополнительной опции тюнинга"""
    __tablename__ = "tuning_options"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Идентификатор опции
    code = Column(String(50), unique=True, nullable=False, index=True)  # "dpf_off", "pop_bang"
    
    # Название
    name = Column(String(100), nullable=False)  # "DPF OFF"
    name_ru = Column(String(100), nullable=True)  # "Отключение сажевого фильтра"
    
    # Описание
    description = Column(Text, nullable=True)
    
    # Категория опции
    category = Column(String(50), nullable=False, default="eco")
    # Категории: "eco" (экология), "performance" (производительность), "comfort" (комфорт)
    
    # Цена
    price = Column(Float, default=0.0)  # Дополнительная цена за опцию
    
    # Эмодзи для отображения
    emoji = Column(String(10), default="🔧")
    
    # Активна ли опция
    is_active = Column(Boolean, default=True)
    
    # Порядок сортировки
    sort_order = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<TuningOption {self.code}: {self.name}>"


# Предустановленные опции
TUNING_OPTIONS = [
    # === ЭКОЛОГИЯ (ECO) - Удаление экологических систем ===
    {
        "code": "dpf_off",
        "name": "DPF OFF",
        "name_ru": "Отключение сажевого фильтра",
        "description": "Удаление программы сажевого фильтра (DPF/FAP). Требуется физическое удаление.",
        "category": "eco",
        "emoji": "🔥",
        "sort_order": 1
    },
    {
        "code": "egr_off",
        "name": "EGR OFF",
        "name_ru": "Отключение клапана EGR",
        "description": "Отключение системы рециркуляции отработавших газов.",
        "category": "eco",
        "emoji": "💨",
        "sort_order": 2
    },
    {
        "code": "adblue_off",
        "name": "AdBlue OFF",
        "name_ru": "Отключение системы AdBlue",
        "description": "Удаление системы впрыска мочевины (SCR/DEF).",
        "category": "eco",
        "emoji": "💧",
        "sort_order": 3
    },
    {
        "code": "catalyst_off",
        "name": "CAT OFF",
        "name_ru": "Отключение катализатора",
        "description": "Удаление программы контроля катализатора.",
        "category": "eco",
        "emoji": "⚗️",
        "sort_order": 4
    },
    {
        "code": "o2_off",
        "name": "O2 OFF",
        "name_ru": "Отключение кислородных датчиков",
        "description": "Удаление контроля лямбда-зондов.",
        "category": "eco",
        "emoji": "📡",
        "sort_order": 5
    },
    {
        "code": "evap_off",
        "name": "EVAP OFF",
        "name_ru": "Отключение системы EVAP",
        "description": "Удаление системы улавливания паров топлива.",
        "category": "eco",
        "emoji": "♻️",
        "sort_order": 6
    },
    {
        "code": "swirl_off",
        "name": "Swirl Flaps OFF",
        "name_ru": "Отключение впускных заслонок",
        "description": "Удаление контроля Swirl Flaps.",
        "category": "eco",
        "emoji": "🌀",
        "sort_order": 7
    },
    
    # === ПРОИЗВОДИТЕЛЬНОСТЬ (PERFORMANCE) ===
    {
        "code": "pop_bang",
        "name": "Pop & Bang",
        "name_ru": "Выстрелы в выхлоп",
        "description": "Пламя и хлопки в выхлопной системе при сбросе газа. Спортивный звук.",
        "category": "performance",
        "emoji": "💥",
        "sort_order": 10
    },
    {
        "code": "launch_control",
        "name": "Launch Control",
        "name_ru": "Контроль старта",
        "description": "Система контроля старта с места. Максимальное ускорение.",
        "category": "performance",
        "emoji": "🚀",
        "sort_order": 11
    },
    {
        "code": "burble_map",
        "name": "Burble Map",
        "name_ru": "Бурление на сбросе газа",
        "description": "Характерное бурление/рычание при отпускании педали газа.",
        "category": "performance",
        "emoji": "🔊",
        "sort_order": 12
    },
    {
        "code": "speed_limiter_off",
        "name": "Speed Limiter OFF",
        "name_ru": "Снятие ограничителя скорости",
        "description": "Удаление электронного ограничителя максимальной скорости.",
        "category": "performance",
        "emoji": "⚡",
        "sort_order": 13
    },
    {
        "code": "vmax_off",
        "name": "Vmax OFF",
        "name_ru": "Снятие Vmax",
        "description": "Удаление ограничения максимальной скорости (250 км/ч и т.д.).",
        "category": "performance",
        "emoji": "🏎️",
        "sort_order": 14
    },
    {
        "code": "flat_foot_shift",
        "name": "Flat Foot Shift",
        "name_ru": "Переключение без сброса газа",
        "description": "Переключение передач без отпускания педали газа.",
        "category": "performance",
        "emoji": "👟",
        "sort_order": 15
    },
    
    # === КОМФОРТ (COMFORT) ===
    {
        "code": "start_stop_off",
        "name": "Start/Stop OFF",
        "name_ru": "Отключение Start/Stop",
        "description": "Отключение системы автоматического глушения двигателя.",
        "category": "comfort",
        "emoji": "🔑",
        "sort_order": 20
    },
    {
        "code": "hot_start_fix",
        "name": "Hot Start Fix",
        "name_ru": "Исправление горячего старта",
        "description": "Улучшение запуска горячего двигателя.",
        "category": "comfort",
        "emoji": "🌡️",
        "sort_order": 21
    },
    {
        "code": "dtc_off",
        "name": "DTC OFF",
        "name_ru": "Отключение кодов ошибок",
        "description": "Удаление конкретных кодов ошибок (P-коды).",
        "category": "comfort",
        "emoji": "🚫",
        "sort_order": 22
    },
    {
        "code": "immo_off",
        "name": "IMMO OFF",
        "name_ru": "Отключение иммобилайзера",
        "description": "Удаление функции иммобилайзера из ECU.",
        "category": "comfort",
        "emoji": "🔓",
        "sort_order": 23
    },
    {
        "code": "readiness_fix",
        "name": "Readiness Fix",
        "name_ru": "Готовность мониторов",
        "description": "Быстрая готовность всех мониторов для прохождения техосмотра.",
        "category": "comfort",
        "emoji": "✅",
        "sort_order": 24
    },
]


def get_options_by_category(category: str = None) -> list:
    """Получить опции по категории"""
    if category:
        return [opt for opt in TUNING_OPTIONS if opt["category"] == category]
    return TUNING_OPTIONS


def get_option_by_code(code: str) -> dict | None:
    """Получить опцию по коду"""
    for opt in TUNING_OPTIONS:
        if opt["code"] == code:
            return opt
    return None
