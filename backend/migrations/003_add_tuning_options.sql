-- Migration: Add tuning options tables
-- Date: 2026-01-17

-- Таблица опций тюнинга
CREATE TABLE IF NOT EXISTS tuning_options (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    name_ru VARCHAR(100),
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'eco',
    price NUMERIC(10, 2) DEFAULT 0.0,
    emoji VARCHAR(10) DEFAULT '🔧',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Связующая таблица заказ-опции (многие ко многим)
CREATE TABLE IF NOT EXISTS order_options (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES tuning_options(id) ON DELETE CASCADE,
    option_code VARCHAR(50) NOT NULL,  -- Дублируем для быстрого доступа
    price NUMERIC(10, 2) DEFAULT 0.0,  -- Цена на момент заказа
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_id, option_id)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_tuning_options_category ON tuning_options(category);
CREATE INDEX IF NOT EXISTS idx_tuning_options_code ON tuning_options(code);
CREATE INDEX IF NOT EXISTS idx_tuning_options_active ON tuning_options(is_active);
CREATE INDEX IF NOT EXISTS idx_order_options_order ON order_options(order_id);
CREATE INDEX IF NOT EXISTS idx_order_options_option ON order_options(option_id);

-- Заполняем предустановленные опции
INSERT INTO tuning_options (code, name, name_ru, description, category, emoji, sort_order) VALUES
-- Экология
('dpf_off', 'DPF OFF', 'Отключение сажевого фильтра', 'Удаление программы сажевого фильтра (DPF/FAP). Требуется физическое удаление.', 'eco', '🔥', 1),
('egr_off', 'EGR OFF', 'Отключение клапана EGR', 'Отключение системы рециркуляции отработавших газов.', 'eco', '💨', 2),
('adblue_off', 'AdBlue OFF', 'Отключение системы AdBlue', 'Удаление системы впрыска мочевины (SCR/DEF).', 'eco', '💧', 3),
('catalyst_off', 'CAT OFF', 'Отключение катализатора', 'Удаление программы контроля катализатора.', 'eco', '⚗️', 4),
('o2_off', 'O2 OFF', 'Отключение кислородных датчиков', 'Удаление контроля лямбда-зондов.', 'eco', '📡', 5),
('evap_off', 'EVAP OFF', 'Отключение системы EVAP', 'Удаление системы улавливания паров топлива.', 'eco', '♻️', 6),
('swirl_off', 'Swirl Flaps OFF', 'Отключение впускных заслонок', 'Удаление контроля Swirl Flaps.', 'eco', '🌀', 7),
-- Производительность
('pop_bang', 'Pop & Bang', 'Выстрелы в выхлоп', 'Пламя и хлопки в выхлопной системе при сбросе газа. Спортивный звук.', 'performance', '💥', 10),
('launch_control', 'Launch Control', 'Контроль старта', 'Система контроля старта с места. Максимальное ускорение.', 'performance', '🚀', 11),
('burble_map', 'Burble Map', 'Бурление на сбросе газа', 'Характерное бурление/рычание при отпускании педали газа.', 'performance', '🔊', 12),
('speed_limiter_off', 'Speed Limiter OFF', 'Снятие ограничителя скорости', 'Удаление электронного ограничителя максимальной скорости.', 'performance', '⚡', 13),
('vmax_off', 'Vmax OFF', 'Снятие Vmax', 'Удаление ограничения максимальной скорости (250 км/ч и т.д.).', 'performance', '🏎️', 14),
('flat_foot_shift', 'Flat Foot Shift', 'Переключение без сброса газа', 'Переключение передач без отпускания педали газа.', 'performance', '👟', 15),
-- Комфорт
('start_stop_off', 'Start/Stop OFF', 'Отключение Start/Stop', 'Отключение системы автоматического глушения двигателя.', 'comfort', '🔑', 20),
('hot_start_fix', 'Hot Start Fix', 'Исправление горячего старта', 'Улучшение запуска горячего двигателя.', 'comfort', '🌡️', 21),
('dtc_off', 'DTC OFF', 'Отключение кодов ошибок', 'Удаление конкретных кодов ошибок (P-коды).', 'comfort', '🚫', 22),
('immo_off', 'IMMO OFF', 'Отключение иммобилайзера', 'Удаление функции иммобилайзера из ECU.', 'comfort', '🔓', 23),
('readiness_fix', 'Readiness Fix', 'Готовность мониторов', 'Быстрая готовность всех мониторов для прохождения техосмотра.', 'comfort', '✅', 24)
ON CONFLICT (code) DO NOTHING;

-- Комментарии
COMMENT ON TABLE tuning_options IS 'Дополнительные опции тюнинга (DPF, EGR, Pop&Bang и т.д.)';
COMMENT ON TABLE order_options IS 'Связь заказов с выбранными опциями';
COMMENT ON COLUMN tuning_options.category IS 'Категория: eco (экология), performance (производительность), comfort (комфорт)';
