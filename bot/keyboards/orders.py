"""
Orders keyboards
"""

from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from typing import List


def get_orders_keyboard(orders: List[dict]) -> InlineKeyboardMarkup:
    """Orders list keyboard"""
    keyboard = []
    
    for order in orders[:5]:  # Show max 5
        keyboard.append([
            InlineKeyboardButton(
                text=f"#{order['id']} — {order.get('original_filename', 'N/A')[:20]}",
                callback_data=f"order_detail:{order['id']}"
            ),
        ])
    
    keyboard.append([
        InlineKeyboardButton(text="◀️ Главное меню", callback_data="main_menu"),
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=keyboard)


def get_order_detail_keyboard(order: dict) -> InlineKeyboardMarkup:
    """Order detail keyboard"""
    keyboard = []
    
    # If completed - show download button
    if order.get("status") == "completed" and order.get("modified_file_path"):
        keyboard.append([
            InlineKeyboardButton(
                text="📥 Скачать файл",
                callback_data=f"download_order:{order['id']}"
            ),
        ])
    
    keyboard.append([
        InlineKeyboardButton(text="◀️ К заказам", callback_data="orders"),
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=keyboard)
