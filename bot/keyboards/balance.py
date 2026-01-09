"""
Balance keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def get_balance_keyboard() -> InlineKeyboardMarkup:
    """Balance menu keyboard"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="💳 Пополнить", callback_data="deposit"),
        ],
        [
            InlineKeyboardButton(text="📜 История", callback_data="transactions"),
        ],
        [
            InlineKeyboardButton(text="◀️ Главное меню", callback_data="main_menu"),
        ],
    ])


def get_deposit_amounts_keyboard() -> InlineKeyboardMarkup:
    """Deposit amount selection"""
    amounts = [500, 1000, 2000, 5000, 10000]
    
    keyboard = []
    row = []
    for amount in amounts:
        row.append(InlineKeyboardButton(
            text=f"{amount} ₽",
            callback_data=f"deposit_amount:{amount}"
        ))
        if len(row) == 3:
            keyboard.append(row)
            row = []
    if row:
        keyboard.append(row)
    
    keyboard.append([
        InlineKeyboardButton(text="◀️ Назад", callback_data="balance"),
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=keyboard)
