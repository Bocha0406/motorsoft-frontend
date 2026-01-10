'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { checkAuth, logout, type AdminUser } from '@/lib/admin-api';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации
  useEffect(() => {
    const checkAuthentication = async () => {
      // Если это страница логина, не проверяем авторизацию
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      const user = await checkAuth();
      if (!user) {
        router.push('/admin/login');
        return;
      }

      setAdmin(user);
      setLoading(false);
    };

    checkAuthentication();
  }, [pathname, router]);

  // Скрываем основной контент сайта когда админ-панель активна
  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      document.body.style.overflow = 'hidden';
      const root = document.documentElement;
      root.style.overflow = 'hidden';
      root.style.width = '100vw';
      root.style.height = '100vh';
      document.body.style.width = '100vw';
      document.body.style.height = '100vh';
      
      return () => {
        document.body.style.overflow = '';
        root.style.overflow = '';
        root.style.width = '';
        root.style.height = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [pathname]);

  // Показать загрузку только для защищённых страниц
  if (loading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="admin-panel fixed inset-0 z-[9999] overflow-auto"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <AdminPanelContent 
        pathname={pathname} 
        loading={loading} 
        admin={admin}
      >
        {children}
      </AdminPanelContent>
    </div>
  );
}

function AdminPanelContent({
  pathname,
  loading,
  admin,
  children,
}: {
  pathname: string;
  loading: boolean;
  admin: AdminUser | null;
  children: React.ReactNode;
}) {
  // Страница логина - без layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Админ layout с навигацией
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 z-[9998]">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="text-2xl font-bold text-white hover:text-orange-500 transition">
              Motor<span className="text-orange-500">Soft</span> Admin
            </Link>

            {/* User Info */}
            {admin && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-300">{admin.username}</p>
                  <p className="text-xs text-gray-500">{admin.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <NavLink href="/admin" icon="📊" active={pathname === '/admin'}>
                Dashboard
              </NavLink>
              <NavLink href="/admin/users" icon="👥" active={pathname === '/admin/users'}>
                Пользователи
              </NavLink>
              <NavLink href="/admin/firmwares" icon="📁" active={pathname === '/admin/firmwares'}>
                Прошивки
              </NavLink>
              <NavLink href="/admin/orders" icon="📦" active={pathname === '/admin/orders'}>
                Заказы
              </NavLink>
              <NavLink href="/admin/settings" icon="⚙️" active={pathname === '/admin/settings'}>
                Настройки
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// NavLink Component
function NavLink({ 
  href, 
  icon, 
  children, 
  active 
}: { 
  href: string; 
  icon: string; 
  children: React.ReactNode; 
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active
          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white border border-transparent'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}
