'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TOOLS = [
  'Monaco', 'TOS PDF', 'EPIC', 'CRM', 'Numero', 'NCX', 'TIBS', 'I-Payment', 'ABI', 'I-sure', 'AIRA', 'Ideas', 'MyCoins', 'TOS Excel', 'Utipku', 'MyBrain'
];
const BULANAN = [
  'Data Master OI', 'Mapping AM', 'List Print', 'Buku Takah', 'Data Akun', 'UTIP', 'Bukti Potong', 'Plan Bayar', 'Potensi Isolir', 'Potensi Koreksi'
];
const MINGGUAN = [
  'Detail Uninvoice', 'Master Data'
];
const TERTENTU = [
  'Data NPWP'
];
const EXCLUDE = ['Profil Invoice'];

export default function AdminDashboard() {
  const [soonLinks, setSoonLinks] = useState({});
  const [customLinks, setCustomLinks] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [linkToDelete, setLinkToDelete] = useState('');

  useEffect(() => {
    fetch('/sps_link.json')
      .then(res => res.json())
      .then(setSoonLinks)
      .catch(() => setSoonLinks({}));
    fetch('/api/links')
      .then(res => res.json())
      .then(setCustomLinks)
      .catch(() => setCustomLinks({}));
  }, []);

  const openSPS = (title) => {
    if (soonLinks[title]) {
      window.open(soonLinks[title], '_blank');
    } else {
      alert('Link SPS tidak ditemukan: ' + title);
    }
  };

  const handleAddLink = async () => {
    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('link', newLink);
    const res = await fetch('/api/links', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      alert('Berhasil disimpan!');
      setNewTitle('');
      setNewLink('');
      const updated = await fetch('/api/links').then(r => r.json());
      setCustomLinks(updated);
    } else {
      alert('Gagal menyimpan');
    }
  };

  const handleDeleteLink = async () => {
    if (!linkToDelete) return alert('Pilih link terlebih dahulu');
    const res = await fetch('/api/links', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: linkToDelete }),
    });
    if (res.ok) {
      alert('Link berhasil dihapus.');
      setLinkToDelete('');
      const updated = await fetch('/api/links').then(r => r.json());
      setCustomLinks(updated);
    } else {
      alert('Gagal menghapus link.');
    }
  };

  const allTitles = [...TOOLS, ...BULANAN, ...MINGGUAN, ...TERTENTU];
  const soonOnly = Object.keys(customLinks).filter(title => !allTitles.includes(title) && !EXCLUDE.includes(title));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-yellow-200 flex flex-col">
      <div className="header-bar flex items-center bg-white px-10 py-6 shadow-sm border-b border-gray-200 mb-8">
        <Image src="/logo 1.png" alt="Logo" width={90} height={90} className="logo mr-6" priority />
        <div className="flex flex-col justify-center">
          <div className="text-2xl font-bold text-gray-900 tracking-wide mb-1">Dashboard</div>
          <div className="text-base font-medium text-gray-700">Link Support</div>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => window.location.href='/admin/login-history'} className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500">Riwayat Login</button>
          <button onClick={() => { localStorage.removeItem('user'); sessionStorage.removeItem('user'); window.location.href='/login'; }} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">Logout</button>
        </div>
      </div>
      <div className="dashboard mx-auto bg-white/60 rounded-2xl shadow-lg p-8 w-full max-w-5xl">
        <Section title="Tools" items={TOOLS} openSPS={openSPS} />
        <Section title="BULANAN" items={BULANAN.filter(item => !EXCLUDE.includes(item))} openSPS={openSPS} />
        <Section title="MINGGUAN" items={MINGGUAN} openSPS={openSPS} />
        <Section title="TERTENTU" items={TERTENTU} openSPS={openSPS} />
        <Section title="SOON" items={soonOnly} openSPS={(title) => window.open(customLinks[title], '_blank')} />
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-2 text-black">Update Link SPS</h3>
          <div className="mb-2"><input type="text" placeholder="Judul Link" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="border rounded px-3 py-2 w-full mb-2 bg-white text-black placeholder-gray-500 font-normal" /></div>
          <div className="mb-2"><input type="text" placeholder="https://link-sps.com" value={newLink} onChange={e => setNewLink(e.target.value)} className="border rounded px-3 py-2 w-full mb-2 bg-white text-black placeholder-gray-500 font-normal" /></div>
          <button onClick={handleAddLink} className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 w-full mb-4">Simpan</button>
          <h3 className="font-bold text-lg mb-2 text-black">Hapus Link SPS</h3>
          <select value={linkToDelete} onChange={e => setLinkToDelete(e.target.value)} className="border rounded px-3 py-2 w-full mb-2 bg-white text-black font-normal">
            <option value="">Pilih link</option>
            {Object.keys(customLinks).map((title) => (
              <option key={title} value={title}>{title} - {customLinks[title]}</option>
            ))}
          </select>
          <button onClick={handleDeleteLink} className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 w-full">Hapus Link</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, openSPS }) {
  if (title === 'SOON') {
    let gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2";
    return (
      <div className="mb-8">
        <div className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl px-6 py-2 inline-block shadow">{title}</div>
        <div className={gridClass}>
          {items && items.length > 0 ? (
            items.map((item) => (
              <button key={item} className="button p-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-yellow-200 font-bold text-gray-800 shadow hover:from-cyan-500 hover:to-yellow-300 transition w-full" onClick={() => openSPS(item)}>{item}</button>
            ))
          ) : (
            <div className="text-gray-500 col-span-full text-center"></div>
          )}
        </div>
      </div>
    );
  }
  if (!items || (Array.isArray(items) && items.length === 0) || (typeof items === 'object' && !Array.isArray(items) && Object.keys(items).length === 0)) {
    return null;
  }
  let gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2";
  if (title === 'MINGGUAN') {
    gridClass = "grid grid-cols-2 gap-4 mt-2";
  } else if (title === 'TERTENTU') {
    gridClass = "grid grid-cols-1 gap-4 mt-2";
  }
  if (Array.isArray(items)) {
    return (
      <div className="mb-8">
        <div className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl px-6 py-2 inline-block shadow">{title}</div>
        <div className={gridClass}>
          {items.map((item) => (
            <button key={item} className="button p-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-yellow-200 font-bold text-gray-800 shadow hover:from-cyan-500 hover:to-yellow-300 transition w-full" onClick={() => openSPS(item)}>{item}</button>
          ))}
        </div>
      </div>
    );
  }
  // Render object (khusus customLinks)
  return (
    <div className="mb-8">
      <div className="font-bold text-lg mb-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl px-6 py-2 inline-block shadow">{title}</div>
      <div className={gridClass}>
        {Object.keys(items).map((title) => (
          <button key={title} className="button p-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-yellow-200 font-bold text-gray-800 shadow hover:from-cyan-500 hover:to-yellow-300 transition w-full" onClick={() => openSPS(title)}>{title}</button>
        ))}
      </div>
    </div>
  );
} 