"""
Admin handlers
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command

from config import settings
from keyboards.admin import get_admin_keyboard
from services.api import api_client

router = Router()


def is_admin(user_id: int) -> bool:
    """Check if user is admin"""
    return user_id in settings.ADMIN_IDS


@router.message(Command("admin"))
async def cmd_admin(message: Message):
    """Admin panel"""
    if not is_admin(message.from_user.id):
        await message.answer("⛔ Доступ запрещён")
        return
    
    text = """
🔧 <b>Панель администратора</b>

Выбери действие:
"""
    await message.answer(text, reply_markup=get_admin_keyboard())


@router.callback_query(F.data == "admin_stats")
async def cb_admin_stats(callback: CallbackQuery):
    """Show statistics"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔ Доступ запрещён", show_alert=True)
        return
    
    # Get stats from API
    stats = await api_client.get_admin_stats()
    
    text = f"""
📊 <b>Статистика</b>

👥 <b>Пользователи:</b>
   Всего: {stats.get('total_users', 0)}
   Активных: {stats.get('active_users', 0)}

📦 <b>Заказы:</b>
   Всего: {stats.get('total_orders', 0)}
   Ожидают: {stats.get('pending_orders', 0)}
   Вручную: {stats.get('manual_orders', 0)}
   Выполнено: {stats.get('completed_orders', 0)}

💰 <b>Финансы:</b>
   Оборот: {stats.get('total_revenue', 0)} ₽

📁 <b>База прошивок:</b>
   Всего: {stats.get('total_firmwares', 0)}
"""
    
    await callback.message.edit_text(text, reply_markup=get_admin_keyboard())
    await callback.answer()


@router.callback_query(F.data == "admin_pending")
async def cb_admin_pending(callback: CallbackQuery):
    """Show pending manual orders"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔ Доступ запрещён", show_alert=True)
        return
    
    result = await api_client.get_pending_orders()
    orders = result.get("orders", [])
    
    if not orders:
        text = "📋 <b>Заявки на обработку</b>\n\nНет ожидающих заявок."
    else:
        text = "📋 <b>Заявки на обработку</b>\n\n"
        for order in orders[:20]:
            text += f"#{order['id']} — {order.get('original_filename', 'N/A')}\n"
            text += f"   ID: {order.get('detected_software_id', 'N/A')}\n"
            text += f"   От: @{order.get('username', 'N/A')}\n\n"
    
    await callback.message.edit_text(text, reply_markup=get_admin_keyboard())
    await callback.answer()


@router.callback_query(F.data == "admin_users")
async def cb_admin_users(callback: CallbackQuery):
    """Manage users"""
    if not is_admin(callback.from_user.id):
        await callback.answer("⛔ Доступ запрещён", show_alert=True)
        return
    
    result = await api_client.get_users_list()
    users = result.get("users", [])[:20]
    
    text = "👥 <b>Пользователи</b>\n\n"
    
    for user in users:
        level_emoji = {"vip": "💎", "pro": "🥇", "specialist": "🥈"}.get(user.get("level"), "🥉")
        text += f"{level_emoji} {user.get('first_name', 'N/A')} (@{user.get('telegram_username', 'N/A')})\n"
        text += f"   Баланс: {user.get('balance', 0)} ₽, Покупок: {user.get('total_purchases', 0)}\n\n"
    
    await callback.message.edit_text(text, reply_markup=get_admin_keyboard())
    await callback.answer()
