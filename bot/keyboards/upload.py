"""
Upload flow keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from typing import List, Dict


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
                text="◀️ Другой Stage", 
                callback_data=f"back_to_stages:{firmware_id}"
            ),
            InlineKeyboardButton(
                text="❌ Отмена", 
                callback_data="cancel_purchase"
            ),
        ],
    ])


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
