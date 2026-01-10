// API client для Admin Panel
// В продакшене нужно задать NEXT_PUBLIC_API_URL в Vercel
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? 'https://api.motorsoft.pro/api/v1'  // TODO: заменить на реальный URL backend
    : 'http://localhost:8000/api/v1');

export interface AdminUser {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

export interface User {
  id: number;
  telegram_id: number;
  username: string | null;
  balance: number;
  total_purchases: number;
  is_blocked: boolean;
  created_at: string;
  last_active: string | null;
}

export interface UserStats {
  total: number;
  active_today: number;
  active_week: number;
  blocked: number;
  with_purchases: number;
}

// Получить токен из localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

// Проверка авторизации
export async function checkAuth(): Promise<AdminUser | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// Выход
export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_username');
  localStorage.removeItem('admin_role');
  window.location.href = '/admin/login';
}

// Получить список пользователей
export async function getUsers(params?: {
  skip?: number;
  limit?: number;
  search?: string;
  blocked?: boolean;
}): Promise<User[]> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.set('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.set('limit', params.limit.toString());
  if (params?.search) queryParams.set('search', params.search);
  if (params?.blocked !== undefined) queryParams.set('blocked', params.blocked.toString());

  const response = await fetch(`${API_BASE_URL}/api/admin/users?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
}

// Получить статистику пользователей
export async function getUsersStats(): Promise<UserStats> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/admin/users/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch stats');
  return await response.json();
}

// Заблокировать/разблокировать пользователя
export async function toggleUserBlock(userId: number, blocked: boolean): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/block?blocked=${blocked}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to block/unblock user');
}

// Удалить пользователя
export async function deleteUser(userId: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to delete user');
}
