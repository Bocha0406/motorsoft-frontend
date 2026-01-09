"""
Balance and deposit handlers
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

from keyboards.balance import get_balance_keyboard, get_deposit_amounts_keyboard
from services.api import api_client

router = Router()


class DepositStates(StatesGroup):
    """Deposit flow states"""
    select_amount = State()
    confirm_deposit = State()


@router.message(Command("balance"))
async def cmd_balance(message: Message):
    """Show balance command"""
    await show_balance(message)


@router.callback_query(F.data == "balance")
async def cb_balance(callback: CallbackQuery):
    """Show balance callback"""
    await show_balance(callback.message, edit=True)
    await callback.answer()


async def show_balance(message: Message, edit: bool = False):
    """Show user balance and level"""
    
    # Get user data from API
    result = await api_client.get_user(message.chat.id)
    
    if result.get("error"):
        text = "❌ Ошибка получения данных"
    else:
        level_emoji = {
            "newbie": "🥉",
            "specialist": "🥈",
            "pro": "🥇",
            "vip": "💎",
            "partner": "🤝",
        }
        
        level = result.get("level", "newbie")
        discount = int((1 - result.get("coefficient", 1)) * 100)
        
        text = f"""
💰 <b>Твой баланс</b>

<b>Счёт:</b> {result.get('balance', 0):.2f} ₽

{level_emoji.get(level, '🥉')} <b>Уровень:</b> {level.title()}
📉 <b>Скидка:</b> {discount}%
📦 <b>Покупок:</b> {result.get('total_purchases', 0)}

<i>Чем больше покупок — тем выше скидка!</i>
"""
    
    keyboard = get_balance_keyboard()
    
    if edit:
        await message.edit_text(text, reply_markup=keyboard)
    else:
        await message.answer(text, reply_markup=keyboard)


@router.callback_query(F.data == "deposit")
async def cb_deposit(callback: CallbackQuery, state: FSMContext):
    """Start deposit flow"""
    await state.set_state(DepositStates.select_amount)
    
    text = """
💳 <b>Пополнение баланса</b>

Выбери сумму пополнения:
"""
    
    await callback.message.edit_text(
        text,
        reply_markup=get_deposit_amounts_keyboard()
    )
    await callback.answer()


@router.callback_query(F.data.startswith("deposit_amount:"))
async def cb_deposit_amount(callback: CallbackQuery, state: FSMContext):
    """Handle deposit amount selection"""
    amount = int(callback.data.split(":")[1])
    
    await state.update_data(deposit_amount=amount)
    
    # TODO: Integrate with payment system
    # For now, show placeholder
    
    text = f"""
💳 <b>Пополнение на {amount} ₽</b>

⚠️ <b>Способы оплаты:</b>

Для пополнения баланса свяжись с оператором.

<i>Автоматическая оплата будет добавлена позже.</i>
"""
    
    from keyboards.main import get_back_keyboard
    await callback.message.edit_text(text, reply_markup=get_back_keyboard("balance"))
    await callback.answer()


@router.callback_query(F.data == "transactions")
async def cb_transactions(callback: CallbackQuery):
    """Show transaction history"""
    
    result = await api_client.get_transactions(callback.from_user.id)
    
    if not result or result.get("error"):
        text = "📜 <b>История транзакций</b>\n\nПока нет транзакций."
    else:
        transactions = result.get("transactions", [])[:10]  # Last 10
        
        text = "📜 <b>История транзакций</b>\n\n"
        
        for tx in transactions:
            emoji = "➕" if tx["amount"] > 0 else "➖"
            text += f"{emoji} {tx['amount']:+.2f} ₽ — {tx['description']}\n"
            text += f"   <i>{tx['created_at']}</i>\n\n"
        
        if not transactions:
            text += "<i>Пока нет транзакций</i>"
    
    from keyboards.main import get_back_keyboard
    await callback.message.edit_text(text, reply_markup=get_back_keyboard("balance"))
    await callback.answer()
