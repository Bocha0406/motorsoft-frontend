'use client';

import { useEffect, useState } from 'react';

interface Order {
  id: number;
  user_id: number;
  firmware_id: number;
  status: string;
  amount: number;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = new URL('http://localhost:8000/api/v1/api/admin/orders');
        if (filter !== 'all') {
          url.searchParams.append('status', filter);
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.items || []);
        } else {
          console.error('Error:', response.status);
          setOrders([]);
        }
      } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400', text: '⏳ Ожидание' },
      completed: { color: 'bg-green-500/10 border-green-500/50 text-green-400', text: '✓ Завершён' },
      cancelled: { color: 'bg-red-500/10 border-red-500/50 text-red-400', text: '✗ Отменён' },
    };
    const s = statusMap[status] || statusMap['pending'];
    return (
      <span className={`px-3 py-1 rounded border text-xs font-semibold ${s.color}`}>
        {s.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">📦 Заказы</h1>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border transition ${
              filter === f
                ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {f === 'all' && 'Все'}
            {f === 'pending' && 'Ожидание'}
            {f === 'completed' && 'Завершённые'}
            {f === 'cancelled' && 'Отменённые'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800/50 rounded-lg border border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-900/50 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-gray-300">ID</th>
              <th className="px-6 py-3 text-left text-gray-300">User ID</th>
              <th className="px-6 py-3 text-left text-gray-300">Firmware ID</th>
              <th className="px-6 py-3 text-left text-gray-300">Сумма</th>
              <th className="px-6 py-3 text-left text-gray-300">Статус</th>
              <th className="px-6 py-3 text-left text-gray-300">Дата</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  ⏳ Загрузка...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Заказов не найдено
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-900/30 transition">
                  <td className="px-6 py-4 text-gray-300">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.user_id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.firmware_id}</td>
                  <td className="px-6 py-4 text-orange-400 font-semibold">{order.amount} ₽</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.created_at).toLocaleString('ru-RU', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{orders.length}</div>
          <div className="text-sm text-gray-400">Всего заказов</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-400">В ожидании</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {orders.reduce((sum, o) => (o.status === 'completed' ? sum + o.amount : sum), 0)} ₽
          </div>
          <div className="text-sm text-gray-400">Сумма завершённых</div>
        </div>
      </div>
    </div>
  );
}
