'use client';

import { useEffect, useState } from 'react';
import { getUsers, toggleUserBlock, deleteUser, type User } from '@/lib/admin-api';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'blocked' | 'active'>('all');

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { blocked: filter === 'blocked' };
      const data = await getUsers({ ...params, limit: 100 });
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId: number, currentlyBlocked: boolean) => {
    try {
      await toggleUserBlock(userId, !currentlyBlocked);
      await loadUsers();
    } catch (error) {
      alert('Ошибка при изменении статуса пользователя');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Вы уверены? Это действие нельзя отменить.')) return;

    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (error) {
      alert('Ошибка при удалении пользователя');
    }
  };

  // Фильтрация по поиску
  const filteredUsers = users.filter((user) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.telegram_id.toString().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Управление пользователями</h1>
        <p className="text-gray-400">Анализ активности и управление аккаунтами</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Поиск</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Имя или Telegram ID..."
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Фильтр</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'active'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Активные
              </button>
              <button
                onClick={() => setFilter('blocked')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'blocked'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Заблокированные
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Пользователи не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50 text-left text-sm font-medium text-gray-300">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Telegram ID</th>
                  <th className="px-6 py-4">Баланс</th>
                  <th className="px-6 py-4">Покупки</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4">Последняя активность</th>
                  <th className="px-6 py-4">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="text-sm text-gray-300 hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-mono">{user.id}</td>
                    <td className="px-6 py-4">{user.username || '—'}</td>
                    <td className="px-6 py-4 font-mono">{user.telegram_id}</td>
                    <td className="px-6 py-4">{user.balance.toFixed(2)} ₽</td>
                    <td className="px-6 py-4">{user.total_purchases}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          user.is_blocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                            : 'bg-green-500/20 text-green-400 border border-green-500/50'
                        }`}
                      >
                        {user.is_blocked ? 'Заблокирован' : 'Активен'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.last_active
                        ? new Date(user.last_active).toLocaleDateString('ru-RU')
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${
                            user.is_blocked
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                          }`}
                        >
                          {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 transition"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Всего пользователей</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Активных</p>
          <p className="text-2xl font-bold text-green-400">
            {users.filter((u) => !u.is_blocked).length}
          </p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Заблокировано</p>
          <p className="text-2xl font-bold text-red-400">
            {users.filter((u) => u.is_blocked).length}
          </p>
        </div>
      </div>
    </div>
  );
}
