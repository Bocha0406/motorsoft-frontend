'use client';

import { useEffect, useState } from 'react';
import { getUsers, toggleUserBlock, deleteUser, updateUserPartnerStatus, type User } from '@/lib/admin-api';

type FilterType = 'all' | 'blocked' | 'active' | 'inactive' | 'dead' | 'partners';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      let data = await getUsers();
      
      // Apply filters
      const now = new Date();
      if (filter === 'blocked') {
        data = data.filter(u => u.is_blocked);
      } else if (filter === 'active') {
        data = data.filter(u => {
          if (!u.last_active) return false;
          const diff = (now.getTime() - new Date(u.last_active).getTime()) / (1000 * 60 * 60 * 24);
          return diff <= 7;
        });
      } else if (filter === 'inactive') {
        data = data.filter(u => {
          if (!u.last_active) return true;
          const diff = (now.getTime() - new Date(u.last_active).getTime()) / (1000 * 60 * 60 * 24);
          return diff > 7 && diff <= 30;
        });
      } else if (filter === 'dead') {
        data = data.filter(u => {
          if (!u.last_active) return true;
          const diff = (now.getTime() - new Date(u.last_active).getTime()) / (1000 * 60 * 60 * 24);
          return diff > 30;
        });
      } else if (filter === 'partners') {
        data = data.filter(u => u.is_partner || u.is_slave);
      }
      
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId: number, currentBlocked: boolean) => {
    try {
      await toggleUserBlock(userId, !currentBlocked);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Удалить пользователя?')) return;
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleTogglePartner = async (user: User) => {
    try {
      await updateUserPartnerStatus(user.id, { 
        is_partner: !user.is_partner,
        coefficient: !user.is_partner ? 0.6 : 1.0
      });
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleToggleSlave = async (user: User) => {
    try {
      await updateUserPartnerStatus(user.id, { is_slave: !user.is_slave });
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleSetDiscount = async (user: User, discountPercent: number) => {
    try {
      const coefficient = 1 - (discountPercent / 100);
      await updateUserPartnerStatus(user.id, { coefficient });
      await loadUsers();
      setShowPartnerModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Пользователи</h1>
        <p className="text-gray-400">Управление аккаунтами</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или Telegram ID..."
            className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
          />
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'inactive', 'dead', 'blocked', 'partners'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f ? 'bg-orange-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {f === 'all' && 'Все'}
                {f === 'active' && '🟢 Активные'}
                {f === 'inactive' && '🟡 Неактивные'}
                {f === 'dead' && '⚫ Мёртвые'}
                {f === 'blocked' && '🚫 Заблок.'}
                {f === 'partners' && '🤝 Партнёры'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50 text-left text-sm font-medium text-gray-300">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Username</th>
                <th className="px-4 py-4">Баланс</th>
                <th className="px-4 py-4">Покупки</th>
                <th className="px-4 py-4">Скидка</th>
                <th className="px-4 py-4">Статус</th>
                <th className="px-4 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => {
                const discount = Math.round((1 - (user.coefficient || 1)) * 100);
                return (
                  <tr key={user.id} className="text-sm text-gray-300 hover:bg-gray-700/30">
                    <td className="px-4 py-4">{user.id}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">{user.username || '—'}</p>
                        <p className="text-xs text-gray-500">{user.telegram_id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">{user.balance.toFixed(0)} ₽</td>
                    <td className="px-4 py-4">{user.total_purchases}</td>
                    <td className="px-4 py-4">
                      {discount > 0 ? (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">
                          -{discount}%
                        </span>
                      ) : '0%'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {user.is_partner && <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400">🤝</span>}
                        {user.is_slave && <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400">🔗</span>}
                        {user.is_blocked && <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">🚫</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => handleTogglePartner(user)} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">🤝</button>
                        <button onClick={() => handleToggleSlave(user)} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">🔗</button>
                        <button onClick={() => { setEditingUser(user); setShowPartnerModal(true); }} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">%</button>
                        <button onClick={() => handleToggleBlock(user.id, user.is_blocked)} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">{user.is_blocked ? '✓' : '🚫'}</button>
                        <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">Всего</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">Активных</p>
          <p className="text-2xl font-bold text-green-400">{users.filter(u => !u.is_blocked).length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">Партнёров</p>
          <p className="text-2xl font-bold text-purple-400">{users.filter(u => u.is_partner || u.is_slave).length}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
          <p className="text-sm text-gray-400">Заблокировано</p>
          <p className="text-2xl font-bold text-red-400">{users.filter(u => u.is_blocked).length}</p>
        </div>
      </div>

      {/* Discount Modal */}
      {showPartnerModal && editingUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Установить скидку</h2>
            <p className="text-gray-400 mb-4">{editingUser.username || editingUser.telegram_id}</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[0, 5, 10, 15, 20, 25, 30, 40, 50].map((d) => (
                <button
                  key={d}
                  onClick={() => handleSetDiscount(editingUser, d)}
                  className="px-4 py-3 rounded-lg font-semibold bg-gray-700 text-gray-300 hover:bg-orange-500 hover:text-white transition"
                >
                  {d}%
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPartnerModal(false)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
