'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LoginHistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/login-history')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data');
        return res.json();
      })
      .then(setData)
      .catch(() => setError('Gagal mengambil data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Riwayat Login</h1>
        <Link href="/admin" className="back-btn bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Kembali ke Dashboard</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300 text-black">
            <thead>
              <tr>
                <th className="bg-yellow-300">Username</th>
                <th className="bg-yellow-300">Nama</th>
                <th className="bg-yellow-300">Email</th>
                <th className="bg-yellow-300">Status</th>
                <th className="bg-yellow-300">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.username}</td>
                  <td className="border px-2 py-1">{item.nama}</td>
                  <td className="border px-2 py-1">{item.email}</td>
                  <td className="border px-2 py-1">{item.status}</td>
                  <td className="border px-2 py-1">{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 