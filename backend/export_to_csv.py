"""
Экспорт Excel в CSV для быстрого импорта
"""
import pandas as pd
from loguru import logger

EXCEL_FILE = "../database1.xlsx"
CSV_FILE = "../firmwares.csv"

logger.info(f"Читаем {EXCEL_FILE}...")
df = pd.read_excel(EXCEL_FILE)

# Переименуем колонки
column_mapping = {
    'Марка (Автомобиль)': 'brand',
    'Series': 'series',
    'Марка (ECU)': 'ecu_brand',
    'Прошивка': 'software_id',
    'Project size': 'file_size',
    'Создан (Проект)': 'winols_created_at',
    'Изменен': 'winols_updated_at',
    'Карты': 'maps_count',
    'Версии': 'versions_info',
    'Файл': 'winols_file',
}

df.rename(columns=column_mapping, inplace=True)

# Добавим цену
df['price'] = 50.0

# Выбираем нужные колонки
columns = ['brand', 'series', 'ecu_brand', 'software_id', 'file_size', 
           'winols_created_at', 'winols_updated_at', 'maps_count', 
           'versions_info', 'winols_file', 'price']

df_export = df[columns]

# Удаляем строки с пустым brand (обязательное поле)
df_export = df_export.dropna(subset=['brand'])

logger.info(f"После очистки: {len(df_export)} строк")

# Экспортируем в CSV
df_export.to_csv(CSV_FILE, index=False)
logger.success(f"Экспортировано {len(df_export)} строк в {CSV_FILE}")
