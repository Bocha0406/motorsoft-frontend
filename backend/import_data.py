"""
Скрипт для импорта прошивок из Excel в PostgreSQL
"""
import pandas as pd
import psycopg2
from loguru import logger

# Параметры подключения
DB_PARAMS = {
    'host': '127.0.0.1',
    'port': 5432,
    'database': 'motorsoft',
    'user': 'motorsoft',
    'password': 'motorsoft'
}

EXCEL_FILE = "../database1_new.xlsx"  # Новая база от 09.01.2026

def import_firmwares():
    """Импорт прошивок из Excel"""
    try:
        # Читаем Excel
        logger.info(f"Читаем файл {EXCEL_FILE}...")
        df = pd.read_excel(EXCEL_FILE)
        logger.success(f"Прочитано {len(df)} строк")
        
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
        
        # Подключаемся к базе
        logger.info("Подключение к PostgreSQL...")
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        
        # Вставляем данные
        logger.info("Импорт данных в базу...")
        inserted = 0
        errors = 0
        
        for index, row in df.iterrows():
            try:
                cursor.execute("""
                    INSERT INTO firmwares (
                        brand, series, ecu_brand, software_id, file_size,
                        winols_created_at, winols_updated_at, maps_count,
                        versions_info, winols_file, price
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    row.get('brand'),
                    row.get('series'),
                    row.get('ecu_brand'),
                    row.get('software_id'),
                    row.get('file_size'),
                    row.get('winols_created_at'),
                    row.get('winols_updated_at'),
                    row.get('maps_count'),
                    row.get('versions_info'),
                    row.get('winols_file'),
                    50.0  # Цена по умолчанию
                ))
                inserted += 1
                
                if inserted % 500 == 0:
                    logger.info(f"Импортировано {inserted}/{len(df)}...")
                    
            except Exception as e:
                errors += 1
                if errors < 10:  # Показываем только первые 10 ошибок
                    logger.error(f"Ошибка в строке {index}: {e}")
        
        # Коммитим изменения
        conn.commit()
        logger.success(f"✅ Импорт завершён! Добавлено {inserted} прошивок (ошибок: {errors})")
        
        # Закрываем соединение
        cursor.close()
        conn.close()
        
        # Проверяем результат
        conn = psycopg2.connect(**DB_PARAMS)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM firmwares")
        count = cursor.fetchone()[0]
        logger.info(f"📊 Всего прошивок в базе: {count}")
        cursor.close()
        conn.close()
        
    except Exception as e:
        logger.error(f"❌ Ошибка импорта: {e}")
        raise

if __name__ == "__main__":
    import_firmwares()
