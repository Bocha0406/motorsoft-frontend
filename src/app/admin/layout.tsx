'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && !window.location.pathname.includes('/admin/login')) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(!!token);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // Login page - no sidebar
  if (window.location.pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/50 border-r border-gray-700 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            MOTOR<span className="text-orange-500">SOFT</span>
          </h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          <a
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition"
          >
            📊 Dashboard
          </a>
          <a
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition"
          >
            👥 Пользователи
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition"
          >
            📦 Заказы
          </a>
          <a
            href="/admin/firmwares"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition"
          >
            💾 Прошивки
          </a>
          <a
            href="/admin/upload"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition"
          >
            ⬆️ Загрузка
          </a>
          <a
            href="/admin/staff"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition"
          >
            👔 Сотрудники
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
        >
          🚪 Выйти
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
