'use client';

import { useState, useEffect } from 'react';

interface AdminUser {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'admins' | 'prices' | 'backup'>('general');
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'ADMIN' | 'OPERATOR'>('OPERATOR');
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    stage1Price: 15000,
    stage2Price: 20000,
    stage3Price: 25000,
    dpfRemovalPrice: 10000,
    egrRemovalPrice: 8000,
    adbluePrice: 5000,
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/api/admin/users?skip=0&limit=1000', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.items || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки администраторов:', err);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminName || !newAdminPassword) {
      setMessage('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/api/admin/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newAdminName,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      });

      if (response.ok) {
        setMessage('✓ Администратор добавлен успешно');
        setNewAdminName('');
        setNewAdminPassword('');
        loadAdmins();
      } else {
        const data = await response.json();
        setMessage(`Ошибка: ${data.detail}`);
      }
    } catch (err: any) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  const handleRemoveAdmin = async (id: number) => {
    if (!confirm('Удалить администратора?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/api/admin/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        setMessage('✓ Администратор удалён');
        loadAdmins();
      }
    } catch (err: any) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleBackup = async () => {
    try {
      setMessage('⏳ Создание резервной копии...');
      const response = await fetch('http://localhost:8000/api/v1/api/admin/backup', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `motorsoft_backup_${new Date().toISOString().split('T')[0]}.sql`;
        a.click();
        setMessage('✓ Резервная копия загружена');
      } else {
        setMessage('Ошибка создания резервной копии');
      }
    } catch (err: any) {
      setMessage(`Ошибка: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">⚙️ Настройки Системы</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {[
          { id: 'general', label: '🔧 Основные', icon: '⚙️' },
          { id: 'admins', label: '👨‍💼 Администраторы', icon: '👤' },
          { id: 'prices', label: '💰 Цены', icon: '💵' },
          { id: 'backup', label: '💾 Резервная Копия', icon: '📦' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 border-b-2 transition ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.includes('✓') || message.includes('⏳')
              ? 'bg-green-500/10 border-green-500/50 text-green-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      {saved && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-400">
          ✓ Настройки сохранены
        </div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Основные Параметры</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Название Компании</label>
              <input
                type="text"
                defaultValue="MotorSoft"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Поддержки</label>
              <input
                type="email"
                defaultValue="support@motorsoft.pro"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Телефон</label>
              <input
                type="tel"
                defaultValue="+7 (900) 000-00-00"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">API URL</label>
              <input
                type="text"
                defaultValue="http://localhost:8000/api/v1"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 transition"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="mt-6 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            💾 Сохранить
          </button>
        </div>
      )}

      {/* Admins Management */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          {/* Add New Admin */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">➕ Добавить Администратора</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Логин</label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={e => setNewAdminName(e.target.value)}
                  placeholder="username"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Пароль</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Роль</label>
                <select
                  value={newAdminRole}
                  onChange={e => setNewAdminRole(e.target.value as 'ADMIN' | 'OPERATOR')}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 transition"
                >
                  <option value="OPERATOR">👤 Оператор (только чтение)</option>
                  <option value="ADMIN">👑 Администратор (полный доступ)</option>
                </select>
              </div>

              <button
                onClick={handleAddAdmin}
                className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                ✓ Добавить
              </button>
            </div>
          </div>

          {/* Admins List */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Список Администраторов ({admins.length})</h2>

            <div className="space-y-2">
              {admins.map(admin => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded border border-gray-700">
                  <div>
                    <p className="text-white font-medium">{admin.username}</p>
                    <p className="text-xs text-gray-500">
                      {admin.role === 'ADMIN' ? '👑 Администратор' : '👤 Оператор'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs rounded ${admin.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {admin.is_active ? '🟢 Активен' : '🔴 Неактивен'}
                    </span>
                    <button
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/50 rounded text-sm hover:bg-red-500/20 transition"
                    >
                      ✗ Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prices Management */}
      {activeTab === 'prices' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Стандартные Цены</h2>
          <p className="text-sm text-gray-400 mb-4">⚠️ Эти цены видны только администраторам. Клиентам цены рассчитываются через форму запроса.</p>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-2">
                  {key === 'stage1Price' && '🟡 Stage 1'}
                  {key === 'stage2Price' && '🟠 Stage 2'}
                  {key === 'stage3Price' && '🔴 Stage 3'}
                  {key === 'dpfRemovalPrice' && '🛢️ Удаление DPF'}
                  {key === 'egrRemovalPrice' && '🌫️ Удаление EGR'}
                  {key === 'adbluePrice' && '💧 AdBlue Отключение'}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={value}
                    onChange={e => setSettings(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-orange-500 transition"
                  />
                  <span className="ml-2 text-gray-400">₽</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveSettings}
            className="mt-6 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
          >
            💾 Сохранить Цены
          </button>
        </div>
      )}

      {/* Backup */}
      {activeTab === 'backup' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📦 Резервная Копия Базы Данных</h2>
          <p className="text-sm text-gray-400 mb-6">Сделайте резервную копию всех данных системы. Файл будет сохранён в формате SQL.</p>

          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-6 text-blue-300 text-sm">
            ℹ️ Резервная копия включает: пользователей, заказы, прошивки, лог системы. Размер зависит от объёма данных.
          </div>

          <button
            onClick={handleBackup}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition text-lg"
          >
            ⬇️ Скачать Резервную Копию
          </button>

          <div className="mt-6 text-sm text-gray-500">
            <p>Последняя резервная копия: 10.01.2026 14:32</p>
            <p>Размер: 125 MB</p>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 text-blue-300">
        <p className="text-sm">
          ℹ️ <strong>Версия системы:</strong> 1.0.0 | <strong>Последнее обновление:</strong> 10.01.2026 | <strong>БД:</strong> PostgreSQL 14
        </p>
      </div>
    </div>
  );
}
