"""
Main menu keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def get_main_keyboard() -> InlineKeyboardMarkup:
    """Main menu keyboard"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📤 Загрузить файл", callback_data="upload"),
        ],
        [
            InlineKeyboardButton(text="💰 Баланс", callback_data="balance"),
            InlineKeyboardButton(text="📋 Мои заказы", callback_data="orders"),
        ],
        [
            InlineKeyboardButton(text="📞 Поддержка", callback_data="support"),
            InlineKeyboardButton(text="ℹ️ О сервисе", callback_data="about"),
        ],
    ])


def get_back_keyboard(target: str = "main_menu") -> InlineKeyboardMarkup:
    """Back button keyboard"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="◀️ Назад", callback_data=target),
        ],
    ])
