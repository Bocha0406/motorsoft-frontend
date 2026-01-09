"""
File upload handlers
Main functionality - upload firmware and get mod
Also handles OCR for screenshot recognition (Yandex Vision + Tesseract fallback)
"""

from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery, FSInputFile
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import aiofiles
import os
from datetime import datetime

from keyboards.upload import get_confirm_keyboard, get_payment_keyboard
from keyboards.main import get_back_keyboard
from services.api import api_client
from services.ocr_yandex import get_ocr_service, init_yandex_ocr
from config import settings

router = Router()

# Initialize Yandex OCR with settings
if settings.YANDEX_CLOUD_FOLDER_ID:
    init_yandex_ocr(
        folder_id=settings.YANDEX_CLOUD_FOLDER_ID,
        api_key=settings.YANDEX_CLOUD_API_KEY,
        iam_token=settings.YANDEX_IAM_TOKEN
    )


class UploadStates(StatesGroup):
    """Upload flow states"""
    waiting_file = State()
    confirm_purchase = State()


# =============================================================================
# 📸 SCREENSHOT / PHOTO HANDLER (OCR)
# =============================================================================

@router.message(F.photo)
async def handle_photo(message: Message, state: FSMContext, bot: Bot):
    """
    Handle photo/screenshot upload
    Extract firmware ID using OCR and search in database
    """
    # Get the largest photo (last in the list)
    photo = message.photo[-1]
    
    # Send processing message
    processing_msg = await message.answer(
        "🔍 <b>Анализирую скриншот...</b>\n\n"
        "Извлекаю ID прошивки с помощью OCR..."
    )
    
    # Download photo
    file = await bot.get_file(photo.file_id)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_path = f"/tmp/motorsoft/ocr/{message.from_user.id}_{timestamp}.jpg"
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    
    await bot.download_file(file.file_path, temp_path)
    
    # Process with OCR (Yandex Vision or Tesseract fallback)
    ocr_service = get_ocr_service()
    result = await ocr_service.process_screenshot(temp_path)
    
    # Delete processing message
    await processing_msg.delete()
    
    # Clean up temp file
    try:
        os.remove(temp_path)
    except:
        pass
    
    if not result["success"]:
        ocr_provider = result.get("ocr_provider", "unknown")
        await message.answer(
            f"❌ <b>Не удалось распознать</b>\n\n"
            f"{result['error']}\n\n"
            f"💡 <b>Советы:</b>\n"
            f"• Сделай скриншот чётче\n"
            f"• Убедись, что ID прошивки виден на картинке\n"
            f"• Попробуй обрезать изображение вокруг ID\n\n"
            f"<i>OCR: {ocr_provider}</i>",
            reply_markup=get_back_keyboard()
        )
        return
    
    # Found firmware IDs!
    best = result["best_match"]
    all_ids = result["firmware_ids"]
    
    # Search in database
    search_result = await api_client.search_firmware(best["id"])
    
    if search_result.get("found"):
        # Found in database!
        firmware = search_result["firmware"]
        
        # Create order first
        order_result = await api_client.create_order(
            telegram_id=message.from_user.id,
            firmware_id=firmware.get('id'),
            original_filename=f"OCR_{best['id']}.jpg"
        )
        
        if order_result.get("error"):
            await message.answer(
                f"❌ <b>Ошибка создания заказа:</b>\n{order_result['error']}"
            )
            return
        
        order_id = order_result.get("order_id")
        price = order_result.get("price", 50)
        
        # Save to state
        await state.update_data(
            firmware=firmware,
            extracted_id=best["id"],
            from_ocr=True,
            order_id=order_id
        )
        
        text = f"""
✅ <b>Прошивка найдена по скриншоту!</b>

📸 <b>Распознанный ID:</b> <code>{best['id']}</code>
🏷️ <b>Тип:</b> {best['type']}

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}

💰 <b>Цена:</b> {price} ₽

Подтвердить покупку?
"""
        await state.set_state(UploadStates.confirm_purchase)
        await message.answer(text, reply_markup=get_confirm_keyboard(order_id))
    
    else:
        # Not found in database - show what was recognized
        ids_text = "\n".join([
            f"• <code>{item['id']}</code> ({item['type']}, {item['confidence']*100:.0f}%)"
            for item in all_ids[:5]
        ])
        
        text = f"""
🔍 <b>Распознанные ID прошивок:</b>

{ids_text}

⚠️ <b>Прошивка не найдена в базе</b>

Лучший результат: <code>{best['id']}</code>

📤 Загрузи СТОК файл (.bin) для создания заявки, или напиши ID оператору.
"""
        await message.answer(text, reply_markup=get_back_keyboard())


# =============================================================================
# 📁 DOCUMENT (BIN FILE) HANDLER  
# =============================================================================


@router.message(F.document)
async def handle_document(message: Message, state: FSMContext, bot: Bot):
    """
    Handle uploaded document
    Main entry point for firmware upload
    """
    document = message.document
    
    # Validate file
    if not document.file_name.lower().endswith('.bin'):
        await message.answer(
            "❌ <b>Неверный формат файла</b>\n\n"
            "Пожалуйста, загрузи файл в формате <b>.bin</b>"
        )
        return
    
    # Check file size (max 10MB)
    if document.file_size > 10 * 1024 * 1024:
        await message.answer(
            "❌ <b>Файл слишком большой</b>\n\n"
            "Максимальный размер файла: 10 МБ"
        )
        return
    
    # Send processing message
    processing_msg = await message.answer("⏳ <b>Обрабатываю файл...</b>")
    
    # Download file
    file = await bot.get_file(document.file_id)
    
    # Save to temp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_path = f"/tmp/motorsoft/uploads/{message.from_user.id}_{timestamp}_{document.file_name}"
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)
    
    await bot.download_file(file.file_path, temp_path)
    
    # Upload to API and get result
    result = await api_client.upload_firmware(
        file_path=temp_path,
        filename=document.file_name,
        user_id=message.from_user.id
    )
    
    # Delete processing message
    await processing_msg.delete()
    
    if result.get("error"):
        await message.answer(
            f"❌ <b>Ошибка обработки</b>\n\n{result['error']}"
        )
        return
    
    # Save to state for purchase flow
    await state.update_data(
        firmware=result.get("firmware"),
        parse_result=result.get("parse_result"),
        extracted_id=result.get("extracted_id"),
        temp_path=temp_path,
    )
    
    # Check if firmware was found in database
    if result.get("found"):
        # Found in database - CREATE ORDER first, then show purchase option
        firmware = result["firmware"]
        parse_result = result.get("parse_result", {})
        
        # Create order in database
        order_result = await api_client.create_order(
            telegram_id=message.from_user.id,
            firmware_id=firmware.get('id'),
            original_filename=document.file_name,
            original_file_path=temp_path
        )
        
        if order_result.get("error"):
            await message.answer(
                f"❌ <b>Ошибка создания заказа:</b>\n{order_result['error']}"
            )
            return
        
        order_id = order_result.get("order_id")
        price = order_result.get("price", 50)
        
        # Save order_id to state
        await state.update_data(order_id=order_id)
        
        text = f"""
✅ <b>Прошивка найдена в базе!</b>

📁 <b>Файл:</b> {document.file_name}
🔍 <b>ID:</b> {result.get('extracted_id', 'N/A')}

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}

💰 <b>Цена:</b> {price} ₽

Подтвердить покупку?
"""
        await state.set_state(UploadStates.confirm_purchase)
        await message.answer(text, reply_markup=get_confirm_keyboard(order_id))
        
    else:
        # Not found - send to operator
        parse_result = result.get("parse_result", {})
        similar = result.get("similar_firmwares", [])
        
        similar_text = ""
        if similar:
            similar_text = "\n\n📋 <b>Похожие прошивки в базе:</b>\n"
            for s in similar[:3]:
                similar_text += f"• {s.get('brand', '')} {s.get('series', '')} ({s.get('software_id', '')})\n"
        
        text = f"""
⚠️ <b>Прошивка не найдена в автоматической базе</b>

📁 <b>Файл:</b> {document.file_name}
🔍 <b>Обнаруженный ID:</b> {result.get('extracted_id', 'Не определён')}
🚗 <b>Марка:</b> {parse_result.get('brand', 'Не определена')}
🔧 <b>ЭБУ:</b> {parse_result.get('ecu', 'Не определён')}
{similar_text}
📨 <b>Заявка передана оператору</b>

Мы свяжемся с тобой, как только подготовим файл.
Обычно это занимает от 15 минут до нескольких часов.
"""
        await message.answer(text)
        
        # Notify operators
        await notify_operators(bot, message.from_user, result, document.file_name)


async def notify_operators(bot: Bot, user, result: dict, filename: str):
    """Send notification to operators about new manual order"""
    
    parse_result = result.get('parse_result', {})
    
    text = f"""
🆕 <b>Новая заявка на ручную обработку</b>

👤 <b>Клиент:</b> {user.first_name} (@{user.username or 'N/A'})
🆔 <b>Telegram ID:</b> {user.id}
📁 <b>Файл:</b> {filename}
🔍 <b>Извлечённый ID:</b> {result.get('extracted_id', 'N/A')}
🚗 <b>Марка:</b> {parse_result.get('brand', 'Не определена')}
🔧 <b>ЭБУ:</b> {parse_result.get('ecu', 'Не определён')}
📊 <b>Уверенность:</b> {parse_result.get('confidence', 0) * 100:.0f}%

Прошивка не найдена автоматически в базе.
"""
    
    for operator_id in settings.OPERATOR_IDS:
        try:
            await bot.send_message(operator_id, text)
        except Exception:
            pass


@router.callback_query(F.data.startswith("confirm_purchase:"))
async def confirm_purchase(callback: CallbackQuery, state: FSMContext):
    """Confirm and process purchase"""
    order_id = int(callback.data.split(":")[1])
    
    data = await state.get_data()
    
    # Check balance via API
    result = await api_client.process_purchase(
        order_id=order_id,
        user_id=callback.from_user.id
    )
    
    if result.get("error"):
        error_msg = result["error"]
        if "balance" in error_msg.lower() or "средств" in error_msg.lower():
            # Extract balance and price from error message if possible
            await callback.message.edit_text(
                f"❌ <b>Недостаточно средств на балансе</b>\n\n"
                f"{error_msg}\n\n"
                f"💳 Пополни баланс и попробуй снова.",
                reply_markup=get_payment_keyboard()
            )
        else:
            await callback.message.edit_text(
                f"❌ <b>Ошибка:</b> {error_msg}"
            )
        await callback.answer("❌ Ошибка")
        return
    
    # Success - provide download
    await callback.message.edit_text(
        f"✅ <b>Покупка успешна!</b>\n\n"
        f"💰 Списано: {result.get('price', 0)} ₽\n"
        f"📁 Файл готов к скачиванию"
    )
    
    # Send the modified file
    if result.get("file_path"):
        file = FSInputFile(result["file_path"])
        await callback.message.answer_document(
            file,
            caption="📦 <b>Ваш модифицированный файл</b>\n\nСпасибо за покупку!"
        )
    
    await state.clear()
    await callback.answer("✅ Готово!")


@router.callback_query(F.data == "cancel_purchase")
async def cancel_purchase(callback: CallbackQuery, state: FSMContext):
    """Cancel purchase"""
    await state.clear()
    await callback.message.edit_text(
        "❌ <b>Покупка отменена</b>\n\n"
        "Ты можешь загрузить другой файл."
    )
    await callback.answer()
