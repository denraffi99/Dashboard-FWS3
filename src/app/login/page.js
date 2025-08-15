'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    } else {
      setError(data.message || 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-yellow-200 flex flex-col">
      <div className="header-bar flex items-center bg-white px-10 py-6 shadow-sm border-b border-gray-200 mb-8">
        <Image src="/logo 1.png" alt="Logo" width={90} height={90} className="logo mr-6" priority />
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-900 tracking-wide mb-1">Dashboard</div>
          <div className="text-base font-medium text-gray-700">Link Support</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-start mt-2">
        <form onSubmit={handleSubmit} className="bg-white px-10 py-10 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          {error && <div className="mb-4 text-red-600 text-center w-full">{error}</div>}
          <div className="mb-4 w-full flex flex-col items-start">
            <label className="font-medium mb-1 text-gray-800">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-blue-50 text-base text-gray-900 placeholder-gray-400 focus:outline-none" required placeholder="Masukkan username" autoFocus />
          </div>
          <div className="mb-6 w-full flex flex-col items-start">
            <label className="font-medium mb-1 text-gray-800">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-blue-50 text-base text-gray-900 placeholder-gray-400 focus:outline-none" required placeholder="Masukkan password" />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg shadow">Login</button>
        </form>
      </div>
    </div>
  );
} 