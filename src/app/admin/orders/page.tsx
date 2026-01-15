'use client';

import { useEffect, useState } from 'react';
import { getOrders, type Order } from '@/lib/admin-api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Заказы</h1>
        <p className="text-gray-400">История покупок</p>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Заказов пока нет</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/50 text-left text-sm font-medium text-gray-300">
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Пользователь</th>
                <th className="px-4 py-4">Прошивка</th>
                <th className="px-4 py-4">Stage</th>
                <th className="px-4 py-4">Цена</th>
                <th className="px-4 py-4">Статус</th>
                <th className="px-4 py-4">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="text-sm text-gray-300 hover:bg-gray-700/30">
                  <td className="px-4 py-4">{order.id}</td>
                  <td className="px-4 py-4">{order.user_id}</td>
                  <td className="px-4 py-4">{order.firmware_id}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.stage === 'stage1' ? 'bg-blue-500/20 text-blue-400' :
                      order.stage === 'stage2' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {order.stage?.toUpperCase() || 'STAGE1'}
                    </span>
                  </td>
                  <td className="px-4 py-4">{order.price} ₽</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
