-- Migration: Add user_activity table for analytics
-- Date: 2026-01-17

-- Таблица для логирования активности пользователей
CREATE TABLE IF NOT EXISTS user_activity (
    id SERIAL PRIMARY KEY,
    
    -- Связь с пользователем (nullable для гостей)
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    telegram_id INTEGER,
    
    -- Тип активности
    activity_type VARCHAR(50) NOT NULL,
    
    -- Детали (JSON)
    details JSONB,
    
    -- Метаданные запроса
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    platform VARCHAR(50),  -- "telegram", "web", "api"
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрых запросов
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_telegram_id ON user_activity(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);

-- Составной индекс для аналитики по типу и дате
CREATE INDEX IF NOT EXISTS idx_user_activity_type_date ON user_activity(activity_type, created_at);

-- Комментарии
COMMENT ON TABLE user_activity IS 'Логирование активности пользователей для аналитики';
COMMENT ON COLUMN user_activity.activity_type IS 'Тип: search_bin, search_ocr, order_created, order_paid, file_download, balance_deposit, login, register, guest_upload';
COMMENT ON COLUMN user_activity.details IS 'JSON с деталями: query, firmware_id, order_id, amount и т.д.';
COMMENT ON COLUMN user_activity.platform IS 'Платформа: telegram, web, api';
