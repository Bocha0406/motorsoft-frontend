#!/usr/bin/env python3
"""
Простой тест поиска прошивки без API
Читает файл → парсит → ищет в БД напрямую через psycopg2
"""

import sys
from app.services.firmware_parser import FirmwareParser
import psycopg2

# Путь к BIN файлу
if len(sys.argv) < 2:
    print("Usage: python3 test_search_simple.py <path_to_bin_file>")
    sys.exit(1)

bin_file = sys.argv[1]

# 1. Парсим файл
print(f"\n📂 Парсинг файла: {bin_file}")
parser = FirmwareParser()
result = parser.parse_file(bin_file)

print(f"\n✅ Результат парсинга:")
print(f"   Software ID: {result['software_id']}")
print(f"   ECU: {result['ecu']}")
print(f"   Brand: {result['brand']}")
print(f"   Confidence: {result['confidence']}")

software_id = result['software_id']

if not software_id:
    print("\n❌ Не удалось извлечь ID из файла")
    sys.exit(1)

# 2. Подключаемся к БД
print(f"\n🔍 Поиск в базе данных...")
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    user="motorsoft",
    password="motorsoft",
    database="motorsoft"
)
cursor = conn.cursor()

# 3. Ищем по software_id
cursor.execute("""
    SELECT id, brand, series, ecu_brand, software_id, hardware_id, file_size, price, winols_file
    FROM firmwares
    WHERE software_id ILIKE %s
    LIMIT 1
""", (f"%{software_id}%",))

row = cursor.fetchone()

if not row:
    # Пробуем искать без дефисов
    clean_id = software_id.replace('-', '').replace(' ', '')
    cursor.execute("""
        SELECT id, brand, series, ecu_brand, software_id, hardware_id, file_size, price, winols_file
        FROM firmwares
        WHERE software_id ILIKE %s
        LIMIT 1
    """, (f"%{clean_id}%",))
    row = cursor.fetchone()

if row:
    print(f"\n✅ НАЙДЕНО в базе:")
    print(f"   ID: {row[0]}")
    print(f"   Марка: {row[1]}")
    print(f"   Серия: {row[2]}")
    print(f"   ЭБУ: {row[3]}")
    print(f"   Software ID: {row[4]}")
    print(f"   Hardware ID: {row[5]}")
    print(f"   Размер файла: {row[6]}")
    print(f"   Цена: {row[7]}")
    print(f"   WinOLS файл: {row[8]}")
else:
    print(f"\n❌ Прошивка НЕ НАЙДЕНА в базе")
    print(f"   Извлечённый ID: {software_id}")
    print(f"   Требуется ручная обработка")

cursor.close()
conn.close()

print("\n✅ Тест завершён\n")
