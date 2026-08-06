'use client';

import React, { useState } from 'react';
import { Boxes, TrendingDown, DollarSign, Wrench, Plus, X, Search, Calculator } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

type Asset = {
  id: string;
  code: string;
  name: string;
  category: string;
  date: string;
  cost: number;
  depreciationYears: number;
  accumulatedDep: number;
  bookValue: number;
};

const INITIAL_ASSETS: Asset[] = [
  { id: 'a1', code: 'AST-MED-001', name: 'CT-Scan 128 Slice Siemens Somatom', category: 'Peralatan Medis', date: '2022-01-15', cost: 12500000000, depreciationYears: 10, accumulatedDep: 4166666666, bookValue: 8333333334 },
  { id: 'a2', code: 'AST-MED-002', name: 'Ultrasonography USG 4D GE Voluson', category: 'Peralatan Medis', date: '2023-06-20', cost: 1800000000, depreciationYears: 5, accumulatedDep: 450000000, bookValue: 1350000000 },
  { id: 'a3', code: 'AST-IT-008', name: 'Server Cluster Dell PowerEdge R750', category: 'Perangkat IT', date: '2024-03-10', cost: 350000000, depreciationYears: 4, accumulatedDep: 87500000, bookValue: 262500000 },
];

export default function FixedAssetsPage() {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Peralatan Medis');
  const [cost, setCost] = useState<number>(500000000);
  const [depreciationYears, setDepreciationYears] = useState<number>(5);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || cost <= 0) return;

    const newAsset: Asset = {
      id: `ast-${Date.now()}`,
      code: `AST-${category.includes('Medis') ? 'MED' : 'IT'}-${Math.floor(100 + Math.random() * 900)}`,
      name,
      category,
      date: new Date().toISOString().split('T')[0],
      cost: Number(cost),
      depreciationYears: Number(depreciationYears),
      accumulatedDep: 0,
      bookValue: Number(cost)
    };

    setAssets([newAsset, ...assets]);
    setShowModal(false);
    showToast({ type: 'success', title: 'Aset Tetap Terdaftar', message: `${name} berhasil dicatat dengan nilai Rp ${Number(cost).toLocaleString('id-ID')}.` });
    setName('');
  };

  const filteredAssets = assets.filter(
    a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCost = assets.reduce((acc, curr) => acc + curr.cost, 0);
  const totalDep = assets.reduce((acc, curr) => acc + curr.accumulatedDep, 0);
  const totalBook = assets.reduce((acc, curr) => acc + curr.bookValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-teal-400" /> Fixed Asset Management & Engine Depresiasi
          </h2>
          <p className="text-xs text-slate-400">Pencatatan Aset Tetap, Metode Garis Lurus (Straight-line Depreciation) & Nilai Buku Aset Alkes/Gedung</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
        >
          <Plus className="w-4 h-4" /> + Regitsrasi Aset Tetap Baru
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Harga Perolehan</span>
          <p className="text-xl font-black font-mono text-slate-100">Rp {totalCost.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-slate-400">Gross Asset Value</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-rose-400 uppercase font-bold tracking-wider">Akumulasi Depresiasi</span>
          <p className="text-xl font-black font-mono text-rose-400">- Rp {totalDep.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-rose-400">Straight-Line Method</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">Nilai Buku Bersih (Net Book Value)</span>
          <p className="text-xl font-black font-mono text-emerald-400">Rp {totalBook.toLocaleString('id-ID')}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Balance Sheet Asset Value</span>
        </div>
      </div>

      {/* Main Asset Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Daftar Aset Tetap Rumah Sakit & Depresiasi Akumulasi</span>
          </h3>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari aset / barcode..."
              className="bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-1.5 text-xs text-slate-100 outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Kode Barcode Aset</th>
                <th className="py-3 px-4">Nama Aset & Kategori</th>
                <th className="py-3 px-4">Tgl Perolehan</th>
                <th className="py-3 px-4">Harga Perolehan (Rp)</th>
                <th className="py-3 px-4">Depresiasi Akumulasi</th>
                <th className="py-3 px-4 text-right">Nilai Buku Saat Ini (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-400">{item.code}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-100 block">{item.name}</span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    Rp {item.cost.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-400">
                    - Rp {item.accumulatedDep.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    Rp {item.bookValue.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Input Aset Baru */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-teal-400" /> Registrasi Aset Tetap Baru
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Aset / Alat Medis *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Defibrillator Mindray D3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori Aset *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="Peralatan Medis">Peralatan Medis (Alkes)</option>
                  <option value="Perangkat IT">Perangkat IT & Server</option>
                  <option value="Gedung & Bangunan">Gedung & Bangunan</option>
                  <option value="Kendaraan Ambulans">Kendaraan Ambulans</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Perolehan (Rp) *</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Masa Manfaat (Tahun) *</label>
                  <input
                    type="number"
                    value={depreciationYears}
                    onChange={(e) => setDepreciationYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition"
                >
                  Simpan Aset Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
