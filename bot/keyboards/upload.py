"""
Upload flow keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


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
