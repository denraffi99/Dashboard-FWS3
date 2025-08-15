'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TOOLS = [
  'Monaco', 'TOS', 'EPIC', 'CRM', 'Numero', 'NCX', 'TIBS', 'I-Payment', 'ABI', 'I-sure', 'AIRA'
];
const BULANAN = [
  'Data Master OI', 'Mapping AM', 'List Print', 'Buku Takah', 'Data Akun', 'UTIP', 'Bukti Potong', 'Plan Bayar'
];
const MINGGUAN = [
  'Detail Uninvoice', 'Master Data'
];
const TERTENTU = [
  'Potensi Isolir', 'Potensi Koreksi', 'Data NPWP'
];

export default function UserDashboard() {
  const [soonLinks, setSoonLinks] = useState({});

  useEffect(() => {
    fetch('/sps_links.json')
      .then(res => res.json())
      .then(setSoonLinks)
      .catch(() => setSoonLinks({}));
  }, []);

  const openSPS = (title) => {
    if (soonLinks[title]) {
      window.open(soonLinks[title], '_blank');
    } else {
      alert('Link SPS tidak ditemukan: ' + title);
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
        <div className="ml-auto flex gap-2">
          <button onClick={() => { localStorage.removeItem('user'); sessionStorage.removeItem('user'); window.location.href='/login'; }} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Logout</button>
        </div>
      </div>
      <div className="dashboard mx-auto bg-white/60 rounded-2xl shadow-lg p-8 w-full max-w-5xl">
        <Section title="Tools" items={TOOLS} openSPS={openSPS} />
        <Section title="BULANAN" items={BULANAN} openSPS={openSPS} />
        <Section title="MINGGUAN" items={MINGGUAN} openSPS={openSPS} />
        <Section title="TERTENTU" items={TERTENTU} openSPS={openSPS} />
        <Section title="SOON" items={Object.keys(soonLinks)} openSPS={openSPS} />
      </div>
    </div>
  );
}

function Section({ title, items, openSPS }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl px-6 py-2 inline-block shadow">{title}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        {items.map((item) => (
          <button key={item} className="button p-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-yellow-200 font-bold text-gray-800 shadow hover:from-cyan-500 hover:to-yellow-300 transition" onClick={() => openSPS(item)}>{item}</button>
        ))}
      </div>
    </div>
  );
} 