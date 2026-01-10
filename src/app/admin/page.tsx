'use client';

import { useEffect, useState } from 'react';
import { getUsersStats, type UserStats } from '@/lib/admin-api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getUsersStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Обзор системы MotorSoft</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего пользователей"
          value={stats?.total || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Активны сегодня"
          value={stats?.active_today || 0}
          icon="📈"
          color="green"
        />
        <StatCard
          title="Активны за неделю"
          value={stats?.active_week || 0}
          icon="📊"
          color="purple"
        />
        <StatCard
          title="С покупками"
          value={stats?.with_purchases || 0}
          icon="💰"
          color="orange"
        />
      </div>

      {/* Alert for blocked users */}
      {stats && stats.blocked > 0 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-1">
                Заблокировано пользователей: {stats.blocked}
              </h3>
              <p className="text-sm text-red-300/70">
                Перейдите в раздел "Пользователи" для управления
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton href="/admin/users" icon="👥">
            Управление пользователями
          </QuickActionButton>
          <QuickActionButton href="/admin/firmwares" icon="📁">
            Загрузить прошивки
          </QuickActionButton>
          <QuickActionButton href="/admin/orders" icon="📦">
            Просмотр заказов
          </QuickActionButton>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/50',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/50',
    orange: 'from-orange-500/20 to-amber-500/20 border-orange-500/50',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm rounded-xl p-6 transition-transform hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        <div className="text-3xl font-bold text-white">{value.toLocaleString()}</div>
      </div>
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
    </div>
  );
}

function QuickActionButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center space-x-3 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-orange-500/20 hover:border-orange-500/50 transition group"
    >
      <span className="text-2xl group-hover:scale-110 transition">{icon}</span>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
        {children}
      </span>
    </a>
  );
}
