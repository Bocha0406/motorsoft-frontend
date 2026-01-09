"""
Start and registration handlers
"""

from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext

from keyboards.main import get_main_keyboard
from services.api import api_client

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    """
    Handle /start command
    Register user if new, show main menu
    """
    await state.clear()
    
    user = message.from_user
    
    # Register/update user via API
    result = await api_client.register_user(
        telegram_id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    
    # Welcome message
    text = f"""
🚗 <b>Добро пожаловать в MotorSoft!</b>

Привет, {user.first_name}! 

Я помогу тебе быстро получить модифицированные прошивки для ЭБУ и КПП.

<b>Как это работает:</b>
1️⃣ Загрузи свой СТОК файл (.bin)
2️⃣ Я автоматически найду прошивку в базе
3️⃣ Оплати с баланса и получи МОД

<b>Это займёт всего 3 клика!</b> 👆

💰 Твой баланс: <b>{result.get('balance', 0)} ₽</b>
⭐ Уровень: <b>{result.get('level', 'Новичок')}</b>
"""
    
    await message.answer(text, reply_markup=get_main_keyboard())


@router.message(Command("help"))
async def cmd_help(message: Message):
    """Help command"""
    text = """
📖 <b>Справка по боту</b>

<b>Основные команды:</b>
/start - Главное меню
/upload - Загрузить прошивку
/balance - Проверить баланс
/orders - Мои заказы
/help - Эта справка

<b>Как загрузить файл:</b>
Просто отправь мне .bin файл в чат!

<b>Поддержка:</b>
Если что-то не работает — напиши оператору через кнопку "Поддержка" в меню.
"""
    await message.answer(text)


@router.message(Command("menu"))
async def cmd_menu(message: Message):
    """Show main menu"""
    await message.answer(
        "📋 <b>Главное меню</b>\n\nВыбери действие:",
        reply_markup=get_main_keyboard()
    )


@router.callback_query(F.data == "main_menu")
async def cb_main_menu(callback: CallbackQuery):
    """Return to main menu"""
    await callback.message.edit_text(
        "📋 <b>Главное меню</b>\n\nВыбери действие:",
        reply_markup=get_main_keyboard()
    )
    await callback.answer()


@router.callback_query(F.data == "support")
async def cb_support(callback: CallbackQuery):
    """Support button handler"""
    text = """
📞 <b>Поддержка MotorSoft</b>

Если у тебя возникли вопросы или проблемы, свяжись с нами:

💬 <b>Telegram:</b> @MotorSoftSupport
📧 <b>Email:</b> motorsoft@ya.ru

<b>Часы работы:</b>
Пн-Пт: 9:00 - 21:00
Сб-Вс: 10:00 - 18:00

Обычно отвечаем в течение 15-30 минут.
"""
    from keyboards.main import get_back_keyboard
    await callback.message.edit_text(text, reply_markup=get_back_keyboard())
    await callback.answer()


@router.callback_query(F.data == "about")
async def cb_about(callback: CallbackQuery):
    """About service button handler"""
    text = """
ℹ️ <b>О сервисе MotorSoft</b>

🚗 <b>MOTORSOFT — БОЛЬШЕ, ЧЕМ ПРОСТО ЧИП-ТЮНИНГ</b>

Мы — команда профессионалов с многолетним опытом в чип-тюнинге автомобилей.

<b>Наши преимущества:</b>
✅ Более 10,000 готовых прошивок в базе
✅ Автоматический поиск по файлу
✅ Мгновенная выдача после оплаты
✅ Техподдержка от специалистов
✅ Гарантия качества прошивок

<b>Что мы делаем:</b>
🔧 Stage 1, Stage 2, Stage 3 тюнинг
🔧 Отключение EGR, DPF, AdBlue
🔧 Тюнинг КПП
🔧 Ресурсный и премиальный тюнинг

<b>Сайт:</b> motorsoft-frontend.vercel.app
"""
    from keyboards.main import get_back_keyboard
    await callback.message.edit_text(text, reply_markup=get_back_keyboard())
    await callback.answer()


@router.callback_query(F.data == "upload")
async def cb_upload(callback: CallbackQuery):
    """Upload button handler"""
    text = """
📤 <b>Загрузка файла</b>

Просто отправь мне <b>.bin файл</b> прямо в этот чат!

<b>Поддерживаемые форматы:</b>
• .bin — файл прошивки ЭБУ
• Максимальный размер: 10 МБ

<b>Что произойдёт:</b>
1️⃣ Я проанализирую файл
2️⃣ Найду прошивку в базе
3️⃣ Покажу цену и опции
4️⃣ После оплаты — отправлю мод!

💡 <i>Совет: отправляй оригинальный СТОК файл, снятый с автомобиля</i>
"""
    from keyboards.main import get_back_keyboard
    await callback.message.edit_text(text, reply_markup=get_back_keyboard())
    await callback.answer()
