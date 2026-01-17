"""
Upload flow keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from typing import List, Dict, Set


def get_confirm_keyboard(order_id: int) -> InlineKeyboardMarkup:
    """Confirm purchase keyboard"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="✅ Купить", 
                callback_data=f"confirm_purchase:{order_id}"
            ),
            InlineKeyboardButton(
                text="❌ Отмена", 
                callback_data="cancel_purchase"
            ),
        ],
    ])


def get_stage_selection_keyboard(firmware_id: int, variants: List[Dict]) -> InlineKeyboardMarkup:
    """
    Keyboard for selecting Stage 1/2/3 variant.
    Shows price for each stage.
    """
    buttons = []
    
    for v in variants:
        stage = v["stage"]
        stage_name = v["stage_name"]
        price = v["price"]
        
        # Emoji for each stage
        emoji = "🔹" if stage == "stage1" else "🔸" if stage == "stage2" else "🔥"
        
        buttons.append([
            InlineKeyboardButton(
                text=f"{emoji} {stage_name} — {price:.0f}₽",
                callback_data=f"select_stage:{firmware_id}:{stage}"
            )
        ])
    
    # Cancel button
    buttons.append([
        InlineKeyboardButton(text="❌ Отмена", callback_data="cancel_purchase")
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def get_stage_confirm_keyboard(firmware_id: int, stage: str, price: float) -> InlineKeyboardMarkup:
    """Confirm Stage purchase keyboard"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text=f"✅ Купить за {price:.0f}₽", 
                callback_data=f"confirm_stage:{firmware_id}:{stage}"
            ),
        ],
        [
            InlineKeyboardButton(
                text="🔧 Доп. опции", 
                callback_data=f"add_options:{firmware_id}:{stage}"
            ),
        ],
        [
            InlineKeyboardButton(
                text="◀️ Другой Stage", 
                callback_data=f"back_to_stages:{firmware_id}"
            ),
            InlineKeyboardButton(
                text="❌ Отмена", 
                callback_data="cancel_purchase"
            ),
        ],
    ])


def get_options_keyboard(
    firmware_id: int, 
    stage: str, 
    selected_options: Set[str] = None
) -> InlineKeyboardMarkup:
    """
    Keyboard for selecting additional tuning options.
    Pop&Bang, Launch Control, DPF OFF, etc.
    """
    selected = selected_options or set()
    
    # Популярные опции по категориям
    options = [
        # Экология
        {"code": "dpf_off", "name": "DPF OFF", "emoji": "🔥"},
        {"code": "egr_off", "name": "EGR OFF", "emoji": "💨"},
        {"code": "adblue_off", "name": "AdBlue OFF", "emoji": "💧"},
        # Производительность
        {"code": "pop_bang", "name": "Pop & Bang", "emoji": "💥"},
        {"code": "launch_control", "name": "Launch Control", "emoji": "🚀"},
        {"code": "burble_map", "name": "Burble Map", "emoji": "🔊"},
        # Комфорт
        {"code": "start_stop_off", "name": "Start/Stop OFF", "emoji": "🔑"},
        {"code": "speed_limiter_off", "name": "Speed Limiter OFF", "emoji": "⚡"},
    ]
    
    buttons = []
    
    # Две кнопки в ряд
    row = []
    for opt in options:
        code = opt["code"]
        is_selected = code in selected
        check = "✅ " if is_selected else ""
        
        row.append(
            InlineKeyboardButton(
                text=f"{check}{opt['emoji']} {opt['name']}",
                callback_data=f"toggle_option:{firmware_id}:{stage}:{code}"
            )
        )
        
        if len(row) == 2:
            buttons.append(row)
            row = []
    
    if row:  # Добавить оставшиеся
        buttons.append(row)
    
    # Показать все опции
    buttons.append([
        InlineKeyboardButton(
            text="📋 Все опции...",
            callback_data=f"all_options:{firmware_id}:{stage}"
        )
    ])
    
    # Кнопки навигации
    selected_count = len(selected)
    confirm_text = f"✅ Готово ({selected_count} опций)" if selected_count else "✅ Готово"
    
    buttons.append([
        InlineKeyboardButton(
            text=confirm_text,
            callback_data=f"options_done:{firmware_id}:{stage}"
        )
    ])
    
    buttons.append([
        InlineKeyboardButton(
            text="◀️ Назад к Stage",
            callback_data=f"select_stage:{firmware_id}:{stage}"
        )
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def get_all_options_keyboard(
    firmware_id: int,
    stage: str,
    category: str,
    selected_options: Set[str] = None
) -> InlineKeyboardMarkup:
    """
    Полный список опций по категориям
    """
    selected = selected_options or set()
    
    # Все опции по категориям
    all_options = {
        "eco": [
            {"code": "dpf_off", "name": "DPF OFF", "emoji": "🔥"},
            {"code": "egr_off", "name": "EGR OFF", "emoji": "💨"},
            {"code": "adblue_off", "name": "AdBlue OFF", "emoji": "💧"},
            {"code": "catalyst_off", "name": "CAT OFF", "emoji": "⚗️"},
            {"code": "o2_off", "name": "O2 OFF", "emoji": "📡"},
            {"code": "evap_off", "name": "EVAP OFF", "emoji": "♻️"},
            {"code": "swirl_off", "name": "Swirl Flaps OFF", "emoji": "🌀"},
        ],
        "performance": [
            {"code": "pop_bang", "name": "Pop & Bang", "emoji": "💥"},
            {"code": "launch_control", "name": "Launch Control", "emoji": "🚀"},
            {"code": "burble_map", "name": "Burble Map", "emoji": "🔊"},
            {"code": "speed_limiter_off", "name": "Speed Limiter OFF", "emoji": "⚡"},
            {"code": "vmax_off", "name": "Vmax OFF", "emoji": "🏎️"},
            {"code": "flat_foot_shift", "name": "Flat Foot Shift", "emoji": "👟"},
        ],
        "comfort": [
            {"code": "start_stop_off", "name": "Start/Stop OFF", "emoji": "🔑"},
            {"code": "hot_start_fix", "name": "Hot Start Fix", "emoji": "🌡️"},
            {"code": "dtc_off", "name": "DTC OFF", "emoji": "🚫"},
            {"code": "immo_off", "name": "IMMO OFF", "emoji": "🔓"},
            {"code": "readiness_fix", "name": "Readiness Fix", "emoji": "✅"},
        ]
    }
    
    buttons = []
    
    # Табы категорий
    categories = [
        ("eco", "🌿 Экология"),
        ("performance", "🏎️ Мощность"),
        ("comfort", "✨ Комфорт")
    ]
    
    cat_row = []
    for cat_code, cat_name in categories:
        is_active = cat_code == category
        prefix = "▸ " if is_active else ""
        cat_row.append(
            InlineKeyboardButton(
                text=f"{prefix}{cat_name}",
                callback_data=f"options_cat:{firmware_id}:{stage}:{cat_code}"
            )
        )
    buttons.append(cat_row)
    
    # Опции текущей категории
    options = all_options.get(category, [])
    for opt in options:
        code = opt["code"]
        is_selected = code in selected
        check = "✅ " if is_selected else ""
        
        buttons.append([
            InlineKeyboardButton(
                text=f"{check}{opt['emoji']} {opt['name']}",
                callback_data=f"toggle_option:{firmware_id}:{stage}:{code}"
            )
        ])
    
    # Навигация
    selected_count = len(selected)
    buttons.append([
        InlineKeyboardButton(
            text=f"✅ Готово ({selected_count})" if selected_count else "✅ Готово",
            callback_data=f"options_done:{firmware_id}:{stage}"
        )
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def get_payment_keyboard() -> InlineKeyboardMarkup:
    """Payment options when balance is low"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="💳 Пополнить баланс", callback_data="deposit"),
        ],
        [
            InlineKeyboardButton(text="◀️ Назад", callback_data="main_menu"),
        ],
    ])
