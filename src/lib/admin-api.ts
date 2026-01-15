/**
 * Admin API client for MotorSoft admin panel
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://185.152.92.157/api/v1';

// === AUTH ===

export async function adminLogin(username: string, password: string): Promise<{
  access_token: string;
  token_type: string;
  username: string;
  role: string;
}> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Login failed');
  }
  
  return response.json();
}

// === TYPES ===

export interface User {
  id: number;
  telegram_id: number;
  username: string | null;
  balance: number;
  level: string;
  total_purchases: number;
  coefficient: number;
  is_partner: boolean;
  is_slave: boolean;
  is_blocked: boolean;
  created_at: string;
  last_active: string | null;
}

export interface Firmware {
  id: number;
  brand: string;
  model: string;
  ecu_type: string;
  hw_number: string;
  sw_number: string;
  price: number;
  file_path: string;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  firmware_id: number;
  price: number;
  status: string;
  stage: string;
  created_at: string;
  user?: User;
  firmware?: Firmware;
}

export interface StaffMember {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_firmwares: number;
  total_orders: number;
  total_revenue: number;
  orders_today: number;
  revenue_today: number;
  new_users_today: number;
}

// === HELPERS ===

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
      throw new Error('Unauthorized');
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }
  
  return response.json();
}

// === DASHBOARD ===

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchWithAuth(`${API_BASE_URL}/admin/stats`);
}

// === USERS ===

export async function getUsers(): Promise<User[]> {
  return fetchWithAuth(`${API_BASE_URL}/admin/users`);
}

export async function toggleUserBlock(userId: number, block: boolean): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/admin/users/${userId}/block`, {
    method: 'POST',
    body: JSON.stringify({ block }),
  });
}

export async function deleteUser(userId: number): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

export async function updateUserPartnerStatus(userId: number, data: {
  is_partner?: boolean;
  is_slave?: boolean;
  coefficient?: number;
}): Promise<{
  success: boolean;
  is_partner: boolean;
  is_slave: boolean;
  coefficient: number;
  discount_percent: number;
}> {
  return fetchWithAuth(`${API_BASE_URL}/admin/users/${userId}/partner`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updateUserBalance(userId: number, amount: number, reason: string): Promise<{ success: boolean; new_balance: number }> {
  return fetchWithAuth(`${API_BASE_URL}/admin/users/${userId}/balance`, {
    method: 'POST',
    body: JSON.stringify({ amount, reason }),
  });
}

// === ORDERS ===

export async function getOrders(limit: number = 100): Promise<Order[]> {
  return fetchWithAuth(`${API_BASE_URL}/admin/orders?limit=${limit}`);
}

// === FIRMWARES ===

export async function getFirmwares(limit: number = 100, offset: number = 0): Promise<Firmware[]> {
  return fetchWithAuth(`${API_BASE_URL}/admin/firmwares?limit=${limit}&offset=${offset}`);
}

export async function uploadFirmware(formData: FormData): Promise<{ success: boolean; firmware_id: number }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const response = await fetch(`${API_BASE_URL}/admin/firmwares/upload`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Upload failed');
  }
  
  return response.json();
}

// === STAFF ===

export async function getStaff(): Promise<StaffMember[]> {
  return fetchWithAuth(`${API_BASE_URL}/admin/staff`);
}

export async function createStaff(username: string, password: string, role: string): Promise<{ success: boolean; id: number }> {
  return fetchWithAuth(`${API_BASE_URL}/admin/staff`, {
    method: 'POST',
    body: JSON.stringify({ username, password, role }),
  });
}

export async function deleteStaff(staffId: number): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/admin/staff/${staffId}`, {
    method: 'DELETE',
  });
}
