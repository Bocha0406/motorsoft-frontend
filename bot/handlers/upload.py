"""
File upload handlers
Main functionality - upload firmware and get mod
Also handles OCR for screenshot recognition (Yandex Vision + Tesseract fallback)

FLOW (Stage selection):
1. Client uploads .bin file or screenshot
2. Bot finds firmware in database
3. Bot shows Stage 1/2/3 variants with prices
4. Client selects Stage and confirms purchase
5. Bot returns Presigned URL from Object Storage
"""

from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery, FSInputFile
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import aiofiles
import os
from datetime import datetime

from keyboards.upload import (
    get_confirm_keyboard, 
    get_payment_keyboard,
    get_stage_selection_keyboard,
    get_stage_confirm_keyboard
)
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
    select_stage = State()  # New: selecting Stage 1/2/3
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
        
        # Отправляем уведомление операторам
        for operator_id in settings.OPERATOR_IDS:
            try:
                # Пересылаем скриншот оператору
                await bot.send_photo(
                    operator_id,
                    photo.file_id,
                    caption=(
                        f"📸 <b>Нераспознанный скриншот</b>\n\n"
                        f"👤 От: @{message.from_user.username or 'без username'} "
                        f"(ID: <code>{message.from_user.id}</code>)\n"
                        f"📛 Имя: {message.from_user.full_name}\n"
                        f"🕐 Время: {datetime.now().strftime('%d.%m.%Y %H:%M')}\n\n"
                        f"❌ OCR не смог распознать ID прошивки\n"
                        f"<i>OCR: {ocr_provider}</i>"
                    )
                )
            except Exception as e:
                pass  # Оператор недоступен
        
        await message.answer(
            f"📋 <b>Заявка отправлена инженеру</b>\n\n"
            f"К сожалению, мы не смогли автоматически распознать ID прошивки "
            f"на вашем скриншоте.\n\n"
            f"✅ Скриншот отправлен нашему инженеру.\n"
            f"📞 Он свяжется с вами в ближайшее время.\n\n"
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
        # Found in database! Get Stage variants
        firmware = search_result["firmware"]
        
        # Get Stage variants (Stage 1/2/3)
        variants_result = await api_client.get_firmware_variants(firmware.get('id'))
        variants = variants_result.get("variants", [])
        
        # Save to state for later
        await state.update_data(
            firmware=firmware,
            extracted_id=best["id"],
            from_ocr=True,
            variants=variants
        )
        
        text = f"""
✅ <b>Прошивка найдена по скриншоту!</b>

📸 <b>Распознанный ID:</b> <code>{best['id']}</code>
🏷️ <b>Тип:</b> {best['type']}

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}

<b>Выберите вариант тюнинга:</b>
"""
        # Show Stage selection
        await state.set_state(UploadStates.select_stage)
        await message.answer(
            text, 
            reply_markup=get_stage_selection_keyboard(firmware.get('id'), variants)
        )
    
    else:
        # Not found in database - notify operator and inform user
        ids_text = "\n".join([
            f"• <code>{item['id']}</code> ({item['type']}, {item['confidence']*100:.0f}%)"
            for item in all_ids[:5]
        ])
        
        # Отправляем запрос операторам
        for operator_id in settings.OPERATOR_IDS:
            try:
                await bot.send_photo(
                    operator_id,
                    photo.file_id,
                    caption=(
                        f"🔍 <b>Запрос прошивки (не найдена в базе)</b>\n\n"
                        f"👤 От: @{message.from_user.username or 'без username'} "
                        f"(ID: <code>{message.from_user.id}</code>)\n"
                        f"📛 Имя: {message.from_user.full_name}\n"
                        f"🕐 Время: {datetime.now().strftime('%d.%m.%Y %H:%M')}\n\n"
                        f"📋 <b>Распознанные ID:</b>\n{ids_text}\n\n"
                        f"🎯 Лучший результат: <code>{best['id']}</code>"
                    )
                )
            except Exception as e:
                pass  # Оператор недоступен
        
        text = f"""
👋 <b>Привет!</b>

🔍 <b>Распознанный ID:</b> <code>{best['id']}</code>

⚠️ К сожалению, такой прошивки пока нет в нашей базе.

✅ <b>Я уже отправил ваш запрос инженеру!</b>
📞 Он ответит вам в течение часа.

<i>Распознанные варианты:</i>
{ids_text}
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
        # Found in database - get Stage variants
        firmware = result["firmware"]
        parse_result = result.get("parse_result", {})
        
        # Get Stage variants (Stage 1/2/3)
        variants_result = await api_client.get_firmware_variants(firmware.get('id'))
        variants = variants_result.get("variants", [])
        
        # Save to state
        await state.update_data(
            firmware=firmware,
            variants=variants,
            original_filename=document.file_name,
            original_file_path=temp_path
        )
        
        text = f"""
✅ <b>Прошивка найдена в базе!</b>

📁 <b>Файл:</b> {document.file_name}
🔍 <b>ID:</b> {result.get('extracted_id', 'N/A')}

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}

<b>Выберите вариант тюнинга:</b>
"""
        # Show Stage selection
        await state.set_state(UploadStates.select_stage)
        await message.answer(
            text, 
            reply_markup=get_stage_selection_keyboard(firmware.get('id'), variants)
        )
        
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


# =============================================================================
# 🎯 STAGE SELECTION HANDLERS
# =============================================================================

@router.callback_query(F.data.startswith("select_stage:"))
async def select_stage(callback: CallbackQuery, state: FSMContext):
    """Handle Stage selection (Stage 1/2/3)"""
    parts = callback.data.split(":")
    firmware_id = int(parts[1])
    stage = parts[2]  # "stage1", "stage2", "stage3"
    
    data = await state.get_data()
    firmware = data.get("firmware", {})
    variants = data.get("variants", [])
    
    # Find selected variant
    selected = None
    for v in variants:
        if v["stage"] == stage:
            selected = v
            break
    
    if not selected:
        await callback.answer("❌ Вариант не найден", show_alert=True)
        return
    
    price = selected["price"]
    stage_name = selected["stage_name"]
    
    # Save selected stage
    await state.update_data(selected_stage=stage, selected_price=price)
    
    text = f"""
🎯 <b>Выбран: {stage_name}</b>

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}

📈 <b>Прирост мощности:</b> {selected.get('power_increase', 'N/A')}
📊 <b>Прирост момента:</b> {selected.get('torque_increase', 'N/A')}

💰 <b>Цена:</b> {price:.0f} ₽

{selected.get('description', '')}

Подтвердить покупку?
"""
    
    await callback.message.edit_text(
        text,
        reply_markup=get_stage_confirm_keyboard(firmware_id, stage, price)
    )
    await callback.answer()


@router.callback_query(F.data.startswith("back_to_stages:"))
async def back_to_stages(callback: CallbackQuery, state: FSMContext):
    """Go back to Stage selection"""
    firmware_id = int(callback.data.split(":")[1])
    
    data = await state.get_data()
    firmware = data.get("firmware", {})
    variants = data.get("variants", [])
    
    text = f"""
✅ <b>Прошивка найдена!</b>

🚗 <b>Авто:</b> {firmware.get('brand', '')} {firmware.get('series', '')}
🔧 <b>ЭБУ:</b> {firmware.get('ecu_brand', '')}

<b>Выберите вариант тюнинга:</b>
"""
    
    await callback.message.edit_text(
        text,
        reply_markup=get_stage_selection_keyboard(firmware_id, variants)
    )
    await callback.answer()


@router.callback_query(F.data.startswith("confirm_stage:"))
async def confirm_stage_purchase(callback: CallbackQuery, state: FSMContext):
    """Confirm and process Stage purchase"""
    parts = callback.data.split(":")
    firmware_id = int(parts[1])
    stage = parts[2]
    
    data = await state.get_data()
    firmware = data.get("firmware", {})
    original_filename = data.get("original_filename")
    original_file_path = data.get("original_file_path")
    
    # Create order with Stage
    order_result = await api_client.create_order(
        telegram_id=callback.from_user.id,
        firmware_id=firmware_id,
        original_filename=original_filename,
        original_file_path=original_file_path,
        stage=stage
    )
    
    if order_result.get("error"):
        await callback.message.edit_text(
            f"❌ <b>Ошибка создания заказа:</b>\n{order_result['error']}"
        )
        await callback.answer("❌ Ошибка")
        return
    
    order_id = order_result.get("order_id")
    price = order_result.get("price", 50)
    stage_name = order_result.get("stage_name", stage)
    has_file = order_result.get("has_file", False)
    
    # Process purchase
    result = await api_client.process_purchase(
        order_id=order_id,
        user_id=callback.from_user.id
    )
    
    if result.get("error"):
        error_msg = result["error"]
        if "balance" in error_msg.lower() or "средств" in error_msg.lower():
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
    
    # Success!
    # Check for loyalty upgrade
    loyalty_msg = ""
    if result.get("loyalty_upgrade"):
        upgrade = result["loyalty_upgrade"]
        loyalty_msg = (
            f"\n\n🎉 <b>ПОЗДРАВЛЯЕМ!</b>\n"
            f"Вы достигли нового уровня: <b>{upgrade['new_level'].upper()}</b>\n"
            f"🏆 Теперь ваша скидка: <b>{upgrade['new_discount']}%</b> на все покупки!"
        )
    
    discount_info = ""
    if result.get("current_discount", 0) > 0:
        discount_info = f"\n🏷️ <b>Ваша скидка:</b> {result['current_discount']}%"
    
    if result.get("download_url"):
        # File ready - send download link
        await callback.message.edit_text(
            f"✅ <b>Покупка успешна!</b>\n\n"
            f"🎯 <b>Stage:</b> {stage_name}\n"
            f"💰 <b>Списано:</b> {result.get('price', 0):.0f} ₽\n"
            f"💳 <b>Остаток:</b> {result.get('new_balance', 0):.0f} ₽"
            f"{discount_info}\n\n"
            f"📥 <b>Ссылка на скачивание (действует 10 минут):</b>\n"
            f"{result['download_url']}"
            f"{loyalty_msg}"
        )
    elif result.get("awaiting_file"):
        # File not ready yet - operator will prepare
        await callback.message.edit_text(
            f"✅ <b>Заказ оформлен!</b>\n\n"
            f"🎯 <b>Stage:</b> {stage_name}\n"
            f"💰 <b>Списано:</b> {result.get('price', 0):.0f} ₽\n"
            f"💳 <b>Остаток:</b> {result.get('new_balance', 0):.0f} ₽"
            f"{discount_info}\n\n"
            f"⏳ <b>Файл готовится</b>\n"
            f"Наш инженер подготовит прошивку и отправит вам.\n"
            f"Обычно это занимает от 15 минут до нескольких часов."
            f"{loyalty_msg}"
        )
    else:
        # Legacy file path
        await callback.message.edit_text(
            f"✅ <b>Покупка успешна!</b>\n\n"
            f"🎯 <b>Stage:</b> {stage_name}\n"
            f"💰 <b>Списано:</b> {result.get('price', 0):.0f} ₽"
            f"{discount_info}\n"
            f"📁 Файл готов к скачиванию"
            f"{loyalty_msg}"
        )
        
        if result.get("file_path"):
            file = FSInputFile(result["file_path"])
            await callback.message.answer_document(
                file,
                caption="📦 <b>Ваш модифицированный файл</b>\n\nСпасибо за покупку!"
            )
    
    await state.clear()
    await callback.answer("✅ Готово!")
