'use client';

import React, { useState } from 'react';
import { Landmark, FileText, PieChart, DollarSign, Plus, X, ArrowUpRight, ArrowDownRight, Scale, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

type JournalEntry = {
  id: string;
  date: string;
  voucherNo: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
};

const INITIAL_JOURNALS: JournalEntry[] = [
  { id: 'j1', date: '2026-08-05', voucherNo: 'JV-202608-001', description: 'Penerimaan Pembayaran Pasien Umum RM-2026-08-0001', debitAccount: '101-001 Kas Operasional RS', creditAccount: '401-001 Pendapatan Layanan Rawat Inap', amount: 495000 },
  { id: 'j2', date: '2026-08-05', voucherNo: 'JV-202608-002', description: 'Pembelian Obat & BMHP Kimia Farma PO-012', debitAccount: '501-001 Beban Farmasi & BMHP', creditAccount: '101-002 Bank BCA Operasional', amount: 18500000 },
  { id: 'j3', date: '2026-08-04', voucherNo: 'JV-202608-003', description: 'Klaim BPJS Kesehatan Cair Bulan Juli 2026', debitAccount: '101-002 Bank BCA Operasional', creditAccount: '102-001 Piutang Pasien BPJS Kesehatan', amount: 2450000000 },
];

export default function FinancialErpPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'COA' | 'PROFIT_LOSS' | 'BALANCE_SHEET' | 'JOURNAL'>('COA');
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);

  // Form states
  const [description, setDescription] = useState('');
  const [debitAccount, setDebitAccount] = useState('101-001 Kas Operasional RS');
  const [creditAccount, setCreditAccount] = useState('401-001 Pendapatan Layanan Rawat Inap');
  const [amount, setAmount] = useState<number>(1500000);

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    const newJ: JournalEntry = {
      id: `j-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      voucherNo: `JV-202608-${Math.floor(100 + Math.random() * 900)}`,
      description,
      debitAccount,
      creditAccount,
      amount: Number(amount)
    };

    setJournals([newJ, ...journals]);
    setShowJournalModal(false);
    showToast({ type: 'success', title: 'Jurnal Berhasil Disimpan', message: `Voucher ${newJ.voucherNo} sejumlah Rp ${newJ.amount.toLocaleString('id-ID')} dicatat.` });
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-400" /> Financial ERP, General Ledger & Laporan Keuangan
          </h2>
          <p className="text-xs text-slate-400">Chart of Accounts (COA), Laporan Laba Rugi (P&L), Neraca Keuangan (Balance Sheet) & Jurnal Umum</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJournalModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Plus className="w-4 h-4" /> + Input Jurnal Umum
          </button>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'COA', label: 'COA Master' },
              { id: 'PROFIT_LOSS', label: 'Laba Rugi (P&L)' },
              { id: 'BALANCE_SHEET', label: 'Neraca (Balance Sheet)' },
              { id: 'JOURNAL', label: 'Jurnal Umum' }
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
      </div>

      {/* Financial High-Level Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Pendapatan (YTD)</span>
          <p className="text-xl font-black font-mono text-emerald-400">Rp 12.85 M</p>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs Bulan Lalu
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Beban Operasional</span>
          <p className="text-xl font-black font-mono text-rose-400">Rp 8.27 M</p>
          <span className="text-[10px] text-slate-400">Farmasi: 41% | SDM: 59%</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Laba Bersih (Net Income)</span>
          <p className="text-xl font-black font-mono text-cyan-400">Rp 4.58 M</p>
          <span className="text-[10px] text-cyan-400 font-semibold">Net Profit Margin: 35.6%</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Piutang BPJS (Claim Pending)</span>
          <p className="text-xl font-black font-mono text-amber-400">Rp 3.12 M</p>
          <span className="text-[10px] text-amber-400">V-Claim InACBG Verified</span>
        </div>
      </div>

      {/* TAB 1: COA Master */}
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
                  { code: '103-001', name: 'Persediaan Obat & BMHP Farmasi', cat: 'Persediaan', type: 'DEBIT' },
                  { code: '150-001', name: 'Aset Tetap Peralatan Medis (Alkes)', cat: 'Aset Tetap', type: 'DEBIT' },
                  { code: '201-001', name: 'Hutang Dagang Vendor Distributor Farmasi', cat: 'Kewajiban Jangka Pendek', type: 'KREDIT' },
                  { code: '301-001', name: 'Modal Disetor Yayasan / PT RS', cat: 'Ekuitas / Modal', type: 'KREDIT' },
                  { code: '401-001', name: 'Pendapatan Layanan Rawat Inap', cat: 'Pendapatan Operasional', type: 'KREDIT' },
                  { code: '401-002', name: 'Pendapatan Layanan Rawat Jalan & IGD', cat: 'Pendapatan Operasional', type: 'KREDIT' },
                  { code: '501-001', name: 'Beban Farmasi & Bahan Medis Habis Pakai', cat: 'Beban Operasional', type: 'DEBIT' },
                  { code: '501-002', name: 'Beban Gaji & Jasa Medis Dokter / Perawat', cat: 'Beban Operasional', type: 'DEBIT' }
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

      {/* TAB 2: Profit & Loss Statement */}
      {activeTab === 'PROFIT_LOSS' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 max-w-3xl mx-auto text-xs">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Laporan Laba Rugi (Profit & Loss Statement) – Tahun 2026
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Audited Financials</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="font-extrabold text-slate-200 block text-xs tracking-wider uppercase border-b border-slate-800 pb-1">1. PENDAPATAN OPERASIONAL</span>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Pendapatan Rawat Inap & ICU:</span>
                <span className="font-mono text-slate-100">Rp 7.800.000.000</span>
              </div>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Pendapatan Poliklinik Rawat Jalan & IGD:</span>
                <span className="font-mono text-slate-100">Rp 3.650.000.000</span>
              </div>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Pendapatan Penunjang (Lab, Radiologi, Penunjang Lain):</span>
                <span className="font-mono text-slate-100">Rp 1.400.000.000</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span>TOTAL PENDAPATAN OPERASIONAL (GROSS REVENUE):</span>
                <span className="font-mono">Rp 12.850.000.000</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-extrabold text-slate-200 block text-xs tracking-wider uppercase border-b border-slate-800 pb-1">2. BEBAN OPERASIONAL (EXPENSES)</span>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Beban Farmasi & BMHP:</span>
                <span className="font-mono text-rose-400">- Rp 3.420.000.000</span>
              </div>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Beban Gaji, Remunerasi & Jasa Medis Dokter/Pegawai:</span>
                <span className="font-mono text-rose-400">- Rp 4.850.000.000</span>
              </div>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Beban Utilitas, Listrik, Air & Internet:</span>
                <span className="font-mono text-rose-400">- Rp 450.000.000</span>
              </div>
              <div className="flex justify-between text-slate-300 pl-3">
                <span>- Beban Pemeliharaan IPSRS & Depresiasi Aset:</span>
                <span className="font-mono text-rose-400">- Rp 380.000.000</span>
              </div>
              <div className="flex justify-between font-bold text-rose-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span>TOTAL BEBAN OPERASIONAL:</span>
                <span className="font-mono">- Rp 9.100.000.000</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-800 flex justify-between font-bold text-sm bg-gradient-to-r from-emerald-950/60 to-teal-950/60 p-4 rounded-2xl border border-emerald-500/30">
              <span className="text-slate-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" /> LABA BERSIH SEBELUM PAJAK (NET PROFIT):
              </span>
              <span className="font-mono text-emerald-400 text-base">Rp 3.750.000.000</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Balance Sheet (Neraca Keuangan) */}
      {activeTab === 'BALANCE_SHEET' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 max-w-4xl mx-auto text-xs">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Neraca Keuangan (Balance Sheet) – Per 31 Agustus 2026
            </h3>
            <span className="text-[11px] font-mono text-teal-400">Balanced Equation (Aktiva = Passiva)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AKTIVA */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider block border-b border-slate-800 pb-1.5">
                AKTIVA (ASSETS)
              </span>
              <div className="space-y-1.5">
                <p className="font-bold text-slate-200">Aktiva Lancar:</p>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Kas Operasional & Bank</span>
                  <span className="font-mono text-slate-200">Rp 4.820.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Piutang Pasien BPJS & Asuransi</span>
                  <span className="font-mono text-slate-200">Rp 3.120.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Persediaan Obat & BMHP</span>
                  <span className="font-mono text-slate-200">Rp 1.450.000.000</span>
                </div>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <p className="font-bold text-slate-200">Aktiva Tetap (Fixed Assets):</p>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Peralatan Medis & Alkes</span>
                  <span className="font-mono text-slate-200">Rp 14.650.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Gedung & Bangunan RS</span>
                  <span className="font-mono text-slate-200">Rp 28.000.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-rose-400">
                  <span>- Akumulasi Depresiasi</span>
                  <span className="font-mono">- Rp 4.700.000.000</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-emerald-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 mt-3">
                <span>TOTAL AKTIVA:</span>
                <span className="font-mono">Rp 47.340.000.000</span>
              </div>
            </div>

            {/* PASSIVA (KEWAJIBAN & EKUITAS) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider block border-b border-slate-800 pb-1.5">
                PASSIVA (KEWAJIBAN & EKUITAS)
              </span>
              <div className="space-y-1.5">
                <p className="font-bold text-slate-200">Kewajiban (Liabilities):</p>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Hutang Dagang Distributor Obat</span>
                  <span className="font-mono text-slate-200">Rp 1.850.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Hutang Pajak & Beban Akrual</span>
                  <span className="font-mono text-slate-200">Rp 420.000.000</span>
                </div>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <p className="font-bold text-slate-200">Ekuitas (Equity):</p>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Modal Disetor Pendiri</span>
                  <span className="font-mono text-slate-200">Rp 35.000.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-slate-400">
                  <span>- Laba Ditahan (Retained Earnings)</span>
                  <span className="font-mono text-slate-200">Rp 6.320.000.000</span>
                </div>
                <div className="flex justify-between pl-3 text-cyan-400">
                  <span>- Laba Tahun Berjalan</span>
                  <span className="font-mono">Rp 3.750.000.000</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-cyan-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 mt-3">
                <span>TOTAL PASSIVA:</span>
                <span className="font-mono">Rp 47.340.000.000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Jurnal Umum */}
      {activeTab === 'JOURNAL' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex justify-between items-center">
            <span>Daftar Transaksi Jurnal Umum (General Ledger Entries)</span>
            <span className="text-xs font-mono text-emerald-400">Double Entry Ledger Sync</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">No. Voucher</th>
                  <th className="py-2.5 px-3">Keterangan Transaksi</th>
                  <th className="py-2.5 px-3">Akun Debit</th>
                  <th className="py-2.5 px-3">Akun Kredit</th>
                  <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {journals.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono text-slate-400">{j.date}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{j.voucherNo}</td>
                    <td className="py-3 px-3 font-medium text-slate-100">{j.description}</td>
                    <td className="py-3 px-3 text-emerald-300 font-mono text-[11px]">{j.debitAccount}</td>
                    <td className="py-3 px-3 text-cyan-300 font-mono text-[11px]">{j.creditAccount}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                      Rp {j.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Input Jurnal Umum */}
      {showJournalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" /> Form Input Jurnal Umum
              </h3>
              <button onClick={() => setShowJournalModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddJournal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Keterangan Transaksi *</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Penerimaan pembayaran kasir..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Akun DEBIT *</label>
                <select
                  value={debitAccount}
                  onChange={(e) => setDebitAccount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="101-001 Kas Operasional RS">101-001 Kas Operasional RS</option>
                  <option value="101-002 Bank BCA Operasional">101-002 Bank BCA Operasional</option>
                  <option value="501-001 Beban Farmasi & BMHP">501-001 Beban Farmasi & BMHP</option>
                  <option value="501-002 Beban Gaji & Jasa Medis">501-002 Beban Gaji & Jasa Medis</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Akun KREDIT *</label>
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="401-001 Pendapatan Layanan Rawat Inap">401-001 Pendapatan Layanan Rawat Inap</option>
                  <option value="401-002 Pendapatan Rawat Jalan & IGD">401-002 Pendapatan Rawat Jalan & IGD</option>
                  <option value="102-001 Piutang Pasien BPJS Kesehatan">102-001 Piutang Pasien BPJS Kesehatan</option>
                  <option value="201-001 Hutang Dagang Distributor">201-001 Hutang Dagang Distributor</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nominal Transaksi (Rp) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 font-medium">
                ✓ Otomatis menjaga keseimbangan Jurnal Double-Entry (Debit = Kredit).
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowJournalModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition"
                >
                  Simpan Jurnal Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
