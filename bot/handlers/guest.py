"""
Guest mode handlers
Позволяет загружать файлы и получать результаты поиска без регистрации.
Для покупки требуется регистрация через /start.
"""

from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import os
from datetime import datetime
import uuid

from keyboards.main import get_back_keyboard
from services.api import api_client
from services.ocr_yandex import get_ocr_service
from config import settings

router = Router()


class GuestStates(StatesGroup):
    """Guest flow states"""
    searching = State()
    result_shown = State()


def generate_guest_id(telegram_id: int) -> str:
    """Generate unique guest ID for tracking"""
    return f"guest_{telegram_id}_{uuid.uuid4().hex[:8]}"


def get_register_keyboard() -> InlineKeyboardMarkup:
    """Keyboard prompting user to register for purchase"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="✅ Зарегистрироваться для покупки",
                callback_data="guest_register"
            )
        ],
        [
            InlineKeyboardButton(
                text="🔄 Загрузить другой файл",
                callback_data="guest_upload_another"
            )
        ],
        [
            InlineKeyboardButton(
                text="❌ Закрыть",
                callback_data="guest_close"
            )
        ]
    ])


def get_guest_result_keyboard(firmware_id: int, has_stages: bool = True) -> InlineKeyboardMarkup:
    """Keyboard for guest after finding firmware"""
    buttons = []
    
    if has_stages:
        buttons.append([
            InlineKeyboardButton(
                text="💰 Узнать цену и купить",
                callback_data=f"guest_buy:{firmware_id}"
            )
        ])
    
    buttons.append([
        InlineKeyboardButton(
            text="🔄 Загрузить другой файл",
            callback_data="guest_upload_another"
        )
    ])
    
    buttons.append([
        InlineKeyboardButton(
            text="📞 Связаться с оператором",
            url="https://t.me/motorsoft_bot?start=contact"
        )
    ])
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


async def check_user_registered(telegram_id: int) -> bool:
    """Check if user is registered in the system"""
    try:
        result = await api_client.get_user(telegram_id)
        return not result.get("error")
    except Exception:
        return False


@router.message(F.document, ~F.from_user.is_bot)
async def guest_handle_document(message: Message, state: FSMContext, bot: Bot):
    """
    Handle document upload for both guests and registered users.
    This is a fallback handler that checks registration status.
    """
    # Check if user is registered
    is_registered = await check_user_registered(message.from_user.id)
    
    if is_registered:
        # User is registered - let main upload handler process
        # This handler has lower priority, so registered users go to main handler
        return
    
    # Guest mode - allow file upload without registration
    document = message.document
    
    # Validate file
    if not document.file_name.lower().endswith('.bin'):
        await message.answer(
            "❌ <b>Неверный формат файла</b>\n\n"
            "Пожалуйста, загрузи файл в формате <b>.bin</b>\n\n"
            "💡 <i>Для полного доступа используй /start</i>"
        )
        return
    
    # Check file size (max 10MB)
    if document.file_size > 10 * 1024 * 1024:
        await message.answer(
            "❌ <b>Файл слишком большой</b>\n\n"
            "Максимальный размер файла: 10 МБ"
        )
        return
    
    # Generate guest ID for tracking
    guest_id = generate_guest_id(message.from_user.id)
    await state.update_data(guest_id=guest_id, is_guest=True)
    
    # Send processing message
    processing_msg = await message.answer(
        "⏳ <b>Анализирую файл...</b>\n\n"
        "🔍 Ищу прошивку в базе данных..."
    )
    
    # Download file
    file = await bot.get_file(document.file_id)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_path = f"/tmp/motorsoft/guest/{guest_id}_{timestamp}_{document.file_name}"
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    
    await bot.download_file(file.file_path, temp_path)
    
    # Upload to API and get result
    result = await api_client.upload_firmware(
        file_path=temp_path,
        filename=document.file_name,
        user_id=message.from_user.id,
        is_guest=True
    )
    
    # Delete processing message
    await processing_msg.delete()
    
    # Clean up temp file
    try:
        os.remove(temp_path)
    except:
        pass
    
    if result.get("error"):
        await message.answer(
            f"❌ <b>Ошибка обработки</b>\n\n{result['error']}\n\n"
            f"💡 <i>Для помощи используй /start и свяжись с оператором</i>"
        )
        return
    
    # Check if firmware was found
    if result.get("found"):
        firmware = result["firmware"]
        
        # Get variants
        variants_result = await api_client.get_firmware_variants(firmware.get('id'))
        variants = variants_result.get("variants", [])
        
        # Save to state for later
        await state.update_data(
            firmware=firmware,
            variants=variants,
            original_filename=document.file_name
        )
        
        # Build variants text
        variants_text = ""
        if variants:
            variants_text = "\n\n<b>Доступные варианты:</b>\n"
            for v in variants:
                emoji = "🔹" if v["stage"] == "stage1" else "🔸" if v["stage"] == "stage2" else "🔥"
                variants_text += f"{emoji} {v['stage_name']}\n"
        
        text = f"""
✅ <b>Прошивка найдена!</b>

📁 <b>Файл:</b> {document.file_name}
🔍 <b>ID:</b> {result.get('extracted_id', 'N/A')}

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}
{variants_text}

👋 <b>Гостевой режим</b>
Для покупки необходима регистрация через /start

<i>Регистрация бесплатна и занимает 1 секунду!</i>
"""
        
        await message.answer(
            text,
            reply_markup=get_guest_result_keyboard(firmware.get('id'), bool(variants))
        )
    else:
        # Not found - offer to contact operator
        parse_result = result.get("parse_result", {})
        
        text = f"""
⚠️ <b>Прошивка не найдена в автоматической базе</b>

📁 <b>Файл:</b> {document.file_name}
🔍 <b>Обнаруженный ID:</b> {result.get('extracted_id', 'Не определён')}
🚗 <b>Марка:</b> {parse_result.get('brand', 'Не определена')}

📞 <b>Наш инженер может подготовить прошивку вручную</b>

👋 Для связи с оператором используй /start
"""
        
        await message.answer(text, reply_markup=get_register_keyboard())


@router.callback_query(F.data.startswith("guest_buy:"))
async def guest_buy(callback: CallbackQuery, state: FSMContext):
    """Guest wants to buy - prompt registration"""
    firmware_id = int(callback.data.split(":")[1])
    
    # Save firmware_id for after registration
    await state.update_data(pending_firmware_id=firmware_id)
    
    text = """
🔐 <b>Требуется регистрация</b>

Для покупки прошивок необходимо зарегистрироваться.

<b>Преимущества регистрации:</b>
✅ Быстрая покупка в 1 клик
✅ Личный кабинет с историей заказов
✅ Накопительные скидки до 30%
✅ Приоритетная поддержка

<i>Регистрация бесплатна и занимает 1 секунду!</i>
"""
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="✅ Зарегистрироваться",
                callback_data="guest_register"
            )
        ],
        [
            InlineKeyboardButton(
                text="◀️ Назад",
                callback_data=f"guest_back:{firmware_id}"
            )
        ]
    ])
    
    await callback.message.edit_text(text, reply_markup=keyboard)
    await callback.answer()


@router.callback_query(F.data == "guest_register")
async def guest_register(callback: CallbackQuery, state: FSMContext):
    """Register guest user"""
    user = callback.from_user
    
    # Register via API
    result = await api_client.register_user(
        telegram_id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    
    if result.get("error"):
        await callback.message.edit_text(
            f"❌ <b>Ошибка регистрации:</b>\n{result['error']}\n\n"
            "Попробуй ещё раз или напиши /start"
        )
        await callback.answer("❌ Ошибка")
        return
    
    # Get saved firmware_id if any
    data = await state.get_data()
    pending_firmware_id = data.get("pending_firmware_id")
    
    text = f"""
🎉 <b>Регистрация успешна!</b>

Привет, {user.first_name}! 

💰 Твой баланс: <b>{result.get('balance', 0)} ₽</b>
⭐ Уровень: <b>{result.get('level', 'Новичок')}</b>

Теперь ты можешь покупать прошивки!
"""
    
    if pending_firmware_id:
        # User wanted to buy something - show purchase flow
        from keyboards.main import get_main_keyboard
        from keyboards.upload import get_stage_selection_keyboard
        
        firmware = data.get("firmware", {})
        variants = data.get("variants", [])
        
        if variants:
            text += f"""

🔄 <b>Продолжим покупку?</b>

🚗 {firmware.get('brand', '')} {firmware.get('series', '')}

Выбери вариант тюнинга:
"""
            await callback.message.edit_text(
                text,
                reply_markup=get_stage_selection_keyboard(pending_firmware_id, variants)
            )
        else:
            from keyboards.main import get_main_keyboard
            await callback.message.edit_text(text)
            await callback.message.answer(
                "📁 Загрузи файл .bin для продолжения",
                reply_markup=get_main_keyboard()
            )
    else:
        from keyboards.main import get_main_keyboard
        await callback.message.edit_text(text)
        await callback.message.answer(
            "📁 Загрузи файл .bin для начала работы",
            reply_markup=get_main_keyboard()
        )
    
    # Clear guest state
    await state.update_data(is_guest=False, guest_id=None)
    await callback.answer("✅ Зарегистрировано!")


@router.callback_query(F.data == "guest_upload_another")
async def guest_upload_another(callback: CallbackQuery, state: FSMContext):
    """Guest wants to upload another file"""
    await callback.message.edit_text(
        "📁 <b>Загрузи другой файл</b>\n\n"
        "Отправь мне файл прошивки в формате .bin\n\n"
        "💡 <i>Или используй /start для полной регистрации</i>"
    )
    await callback.answer()


@router.callback_query(F.data == "guest_close")
async def guest_close(callback: CallbackQuery, state: FSMContext):
    """Close guest dialog"""
    await state.clear()
    await callback.message.delete()
    await callback.answer()


@router.callback_query(F.data.startswith("guest_back:"))
async def guest_back(callback: CallbackQuery, state: FSMContext):
    """Go back to firmware result"""
    firmware_id = int(callback.data.split(":")[1])
    
    data = await state.get_data()
    firmware = data.get("firmware", {})
    variants = data.get("variants", [])
    original_filename = data.get("original_filename", "файл.bin")
    
    variants_text = ""
    if variants:
        variants_text = "\n\n<b>Доступные варианты:</b>\n"
        for v in variants:
            emoji = "🔹" if v["stage"] == "stage1" else "🔸" if v["stage"] == "stage2" else "🔥"
            variants_text += f"{emoji} {v['stage_name']}\n"
    
    text = f"""
✅ <b>Прошивка найдена!</b>

📁 <b>Файл:</b> {original_filename}

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}
{variants_text}

👋 <b>Гостевой режим</b>
Для покупки необходима регистрация через /start
"""
    
    await callback.message.edit_text(
        text,
        reply_markup=get_guest_result_keyboard(firmware_id, bool(variants))
    )
    await callback.answer()
