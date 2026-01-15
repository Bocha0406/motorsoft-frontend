'use client';

import { useEffect, useState } from 'react';
import { getStaff, createStaff, deleteStaff, type StaffMember } from '@/lib/admin-api';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('operator');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaff(newUsername, newPassword, newRole);
      await loadStaff();
      setShowModal(false);
      setNewUsername('');
      setNewPassword('');
      setNewRole('operator');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить сотрудника?')) return;
    try {
      await deleteStaff(id);
      await loadStaff();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Сотрудники</h1>
          <p className="text-gray-400">Управление доступом к админ-панели</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          + Добавить
        </button>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : staff.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Сотрудников пока нет</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50 text-left text-sm font-medium text-gray-300">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Логин</th>
                <th className="px-4 py-4">Роль</th>
                <th className="px-4 py-4">Создан</th>
                <th className="px-4 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {staff.map((member) => (
                <tr key={member.id} className="text-sm text-gray-300 hover:bg-gray-700/30">
                  <td className="px-4 py-4">{member.id}</td>
                  <td className="px-4 py-4 font-medium">{member.username}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      member.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      member.role === 'operator' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {member.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(member.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-4 py-4">
                    {member.username !== 'admin' && (
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                      >
                        Удалить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Role descriptions */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Роли</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">ADMIN</span>
            </div>
            <p className="text-sm text-gray-400">
              Полный доступ: пользователи, заказы, прошивки, сотрудники, статистика
            </p>
          </div>
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400">OPERATOR</span>
            </div>
            <p className="text-sm text-gray-400">
              Заказы, загрузка прошивок, просмотр пользователей
            </p>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <form onSubmit={handleCreate} className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">Новый сотрудник</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Логин</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Роль</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                >
                  <option value="operator">Operator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
