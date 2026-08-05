'use client';

import React, { useState } from 'react';
import { Landmark, FileText, PieChart, DollarSign, CheckCircle } from 'lucide-react';

export default function FinancialErpPage() {
  const [activeTab, setActiveTab] = useState<'COA' | 'PROFIT_LOSS' | 'BALANCE_SHEET'>('COA');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" /> Financial ERP, General Ledger & Laporan Keuangan
          </h2>
          <p className="text-xs text-slate-400">Chart of Accounts (COA), Laporan Laba Rugi (P&L), Neraca Keuangan, Cash Flow & Rekonsiliasi Bank</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {[
            { id: 'COA', label: 'Chart of Accounts (COA)' },
            { id: 'PROFIT_LOSS', label: 'Laba Rugi (P&L)' },
            { id: 'BALANCE_SHEET', label: 'Neraca (Balance Sheet)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'COA' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Master Chart of Accounts (COA Akuntansi SIMRS)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Kode Akun (COA)</th>
                  <th className="py-2.5 px-3">Nama Akun Akuntansi</th>
                  <th className="py-2.5 px-3">Kategori Akun</th>
                  <th className="py-2.5 px-3 text-right">Saldo Normal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[
                  { code: '101-001', name: 'Kas Operasional Rumah Sakit', cat: 'Aktiva Lancar', type: 'DEBIT' },
                  { code: '101-002', name: 'Bank BCA Operasional (No: 889123891)', cat: 'Aktiva Lancar', type: 'DEBIT' },
                  { code: '102-001', name: 'Piutang Pasien BPJS Kesehatan', cat: 'Piutang', type: 'DEBIT' },
                  { code: '401-001', name: 'Pendapatan Layanan Rawat Inap', cat: 'Pendapatan Operasional', type: 'KREDIT' },
                  { code: '501-001', name: 'Beban Farmasi & Bahan Medis Habis Pakai', cat: 'Beban Operasional', type: 'DEBIT' }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{item.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-100">{item.name}</td>
                    <td className="py-3 px-3 text-slate-400">{item.cat}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'PROFIT_LOSS' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 max-w-2xl mx-auto text-xs">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 text-center uppercase tracking-wider">
            Laporan Laba Rugi (Profit & Loss Statement)
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between font-bold text-slate-200">
              <span>Pendapatan Operasional Rawat Inap & Jalan:</span>
              <span className="font-mono text-emerald-400">Rp 12.850.000.000</span>
            </div>
            <div className="flex justify-between text-slate-400 pl-4">
              <span>- Beban Farmasi & BMHP:</span>
              <span className="font-mono text-rose-400">Rp 3.420.000.000</span>
            </div>
            <div className="flex justify-between text-slate-400 pl-4">
              <span>- Beban Gaji & Jasa Medis Dokter:</span>
              <span className="font-mono text-rose-400">Rp 4.850.000.000</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-sm">
              <span className="text-slate-100">LABA BERSIH OPERASIONAL (NET INCOME):</span>
              <span className="font-mono text-emerald-400 text-base">Rp 4.580.000.000</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
