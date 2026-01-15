'use client';

import { useEffect, useState } from 'react';
import { getFirmwares, type Firmware } from '@/lib/admin-api';

export default function AdminFirmwaresPage() {
  const [firmwares, setFirmwares] = useState<Firmware[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const limit = 50;

  useEffect(() => {
    loadFirmwares();
  }, [page]);

  const loadFirmwares = async () => {
    try {
      const data = await getFirmwares(limit, page * limit);
      setFirmwares(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = firmwares.filter((f) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      f.brand.toLowerCase().includes(s) ||
      f.model.toLowerCase().includes(s) ||
      f.ecu_type?.toLowerCase().includes(s) ||
      f.hw_number?.toLowerCase().includes(s) ||
      f.sw_number?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Прошивки</h1>
          <p className="text-gray-400">База данных прошивок</p>
        </div>
        <a
          href="/admin/upload"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          + Загрузить
        </a>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по марке, модели, ECU, HW/SW..."
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
        />
      </div>

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
                <th className="px-4 py-4">Марка</th>
                <th className="px-4 py-4">Модель</th>
                <th className="px-4 py-4">ECU</th>
                <th className="px-4 py-4">HW</th>
                <th className="px-4 py-4">SW</th>
                <th className="px-4 py-4">Цена</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filtered.map((fw) => (
                <tr key={fw.id} className="text-sm text-gray-300 hover:bg-gray-700/30">
                  <td className="px-4 py-4">{fw.id}</td>
                  <td className="px-4 py-4 font-medium">{fw.brand}</td>
                  <td className="px-4 py-4">{fw.model}</td>
                  <td className="px-4 py-4 font-mono text-xs">{fw.ecu_type || '—'}</td>
                  <td className="px-4 py-4 font-mono text-xs">{fw.hw_number || '—'}</td>
                  <td className="px-4 py-4 font-mono text-xs">{fw.sw_number || '—'}</td>
                  <td className="px-4 py-4">{fw.price} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          ← Назад
        </button>
        <span className="px-4 py-2 text-gray-400">Страница {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={firmwares.length < limit}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
}
