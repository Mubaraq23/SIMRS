'use client';

import React from 'react';
import { Boxes, TrendingDown, DollarSign, Wrench } from 'lucide-react';

export default function FixedAssetsPage() {
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
      </div>

      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Daftar Aset Tetap Rumah Sakit & Depresiasi Akumulasi</span>
          <span className="text-xs text-teal-400 font-mono">Automated Monthly Depreciation</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Kode Aset / Asset Barcode</th>
                <th className="py-3 px-4">Nama Aset & Kategori</th>
                <th className="py-3 px-4">Tgl Perolehan</th>
                <th className="py-3 px-4">Harga Perolehan (Rp)</th>
                <th className="py-3 px-4">Depresiasi Akumulasi</th>
                <th className="py-3 px-4 text-right">Nilai Buku Saat Ini (Rp)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { code: 'AST-MED-001', name: 'CT-Scan 128 Slice Siemens Somatom', date: '2022-01-15', cost: 12500000000, dep: 4166666666, book: 8333333334 },
                { code: 'AST-MED-002', name: 'Ultrasonography USG 4D GE Voluson', date: '2023-06-20', cost: 1800000000, dep: 450000000, book: 1350000000 },
                { code: 'AST-IT-008', name: 'Server Cluster Dell PowerEdge R750', date: '2024-03-10', cost: 350000000, dep: 87500000, book: 262500000 }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-400">{item.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{item.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    Rp {item.cost.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-400">
                    - Rp {item.dep.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    Rp {item.book.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
