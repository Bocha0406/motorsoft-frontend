"""
Admin keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton


def get_admin_keyboard() -> InlineKeyboardMarkup:
    """Admin panel keyboard"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="📊 Статистика", callback_data="admin_stats"),
        ],
        [
            InlineKeyboardButton(text="📋 Заявки", callback_data="admin_pending"),
            InlineKeyboardButton(text="👥 Пользователи", callback_data="admin_users"),
        ],
        [
            InlineKeyboardButton(text="📁 База прошивок", callback_data="admin_firmwares"),
        ],
        [
            InlineKeyboardButton(text="◀️ Закрыть", callback_data="main_menu"),
        ],
    ])
