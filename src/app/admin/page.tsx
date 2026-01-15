'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, type DashboardStats } from '@/lib/admin-api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Обзор системы MotorSoft</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">👥</span>
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
              +{stats?.new_users_today || 0} сегодня
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_users || 0}</p>
          <p className="text-sm text-gray-400">Пользователей</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💾</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_firmwares || 0}</p>
          <p className="text-sm text-gray-400">Прошивок в базе</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">📦</span>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
              +{stats?.orders_today || 0} сегодня
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.total_orders || 0}</p>
          <p className="text-sm text-gray-400">Заказов</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">💰</span>
            <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
              +{(stats?.revenue_today || 0).toLocaleString()} ₽
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{(stats?.total_revenue || 0).toLocaleString()} ₽</p>
          <p className="text-sm text-gray-400">Общая выручка</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/upload"
            className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
          >
            <span className="text-3xl">⬆️</span>
            <div>
              <p className="font-semibold text-white">Загрузить прошивку</p>
              <p className="text-sm text-gray-400">Drag & Drop</p>
            </div>
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
          >
            <span className="text-3xl">👥</span>
            <div>
              <p className="font-semibold text-white">Пользователи</p>
              <p className="text-sm text-gray-400">Управление аккаунтами</p>
            </div>
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition"
          >
            <span className="text-3xl">📦</span>
            <div>
              <p className="font-semibold text-white">Заказы</p>
              <p className="text-sm text-gray-400">История покупок</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
