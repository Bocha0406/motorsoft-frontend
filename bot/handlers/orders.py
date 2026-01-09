"""
Order history handlers
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command

from keyboards.orders import get_orders_keyboard, get_order_detail_keyboard
from services.api import api_client

router = Router()


@router.message(Command("orders"))
async def cmd_orders(message: Message):
    """Show orders list"""
    await show_orders(message)


@router.callback_query(F.data == "orders")
async def cb_orders(callback: CallbackQuery):
    """Show orders callback"""
    await show_orders(callback.message, edit=True)
    await callback.answer()


async def show_orders(message: Message, edit: bool = False):
    """Display user's orders"""
    
    result = await api_client.get_user_orders(message.chat.id)
    
    if not result or result.get("error"):
        text = "📋 <b>Мои заказы</b>\n\nУ тебя пока нет заказов."
        keyboard = None
    else:
        orders = result.get("orders", [])[:10]  # Last 10
        
        text = "📋 <b>Мои заказы</b>\n\n"
        
        status_emoji = {
            "pending": "⏳",
            "processing": "🔄",
            "manual": "👨‍💻",
            "completed": "✅",
            "cancelled": "❌",
        }
        
        if orders:
            for order in orders:
                emoji = status_emoji.get(order["status"], "📦")
                text += f"{emoji} <b>#{order['id']}</b> — {order['original_filename']}\n"
                text += f"   Статус: {order['status']}\n\n"
        else:
            text += "<i>Пока нет заказов</i>"
        
        keyboard = get_orders_keyboard(orders)
    
    if edit:
        await message.edit_text(text, reply_markup=keyboard)
    else:
        await message.answer(text, reply_markup=keyboard)


@router.callback_query(F.data.startswith("order_detail:"))
async def cb_order_detail(callback: CallbackQuery):
    """Show order details"""
    order_id = int(callback.data.split(":")[1])
    
    result = await api_client.get_order(order_id)
    
    if not result or result.get("error"):
        await callback.answer("Заказ не найден", show_alert=True)
        return
    
    order = result
    
    status_text = {
        "pending": "Ожидает обработки",
        "processing": "Обрабатывается",
        "manual": "Передан оператору",
        "completed": "Выполнен",
        "cancelled": "Отменён",
    }
    
    text = f"""
📦 <b>Заказ #{order['id']}</b>

📁 <b>Файл:</b> {order.get('original_filename', 'N/A')}
🔍 <b>ID прошивки:</b> {order.get('detected_software_id', 'N/A')}

📊 <b>Статус:</b> {status_text.get(order['status'], order['status'])}
💰 <b>Цена:</b> {order.get('final_price', 0)} ₽

📅 <b>Создан:</b> {order.get('created_at', 'N/A')}
"""
    
    if order.get('completed_at'):
        text += f"✅ <b>Выполнен:</b> {order['completed_at']}"
    
    await callback.message.edit_text(
        text,
        reply_markup=get_order_detail_keyboard(order)
    )
    await callback.answer()
