'use client';

import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, Building2, BarChart2, Calendar, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface KemenkesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KemenkesReportModal({ isOpen, onClose }: KemenkesReportModalProps) {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState('RL_1_2');
  const [periodMonth, setPeriodMonth] = useState('2026-08');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast({
        type: 'success',
        title: 'Ekspor Laporan Kemenkes Selesai',
        message: `Berkas ${selectedReport}_${periodMonth}.xlsx berhasil diunduh dan siap diunggah ke Portal SIRS Online Kemenkes.`,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700 p-6 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                SIRS Online Kemenkes R.I.
              </span>
              <span className="text-slate-400 text-xs font-mono">• Standar Permenkes No. 82</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> Generator Laporan Rekapitulasi RL 1 - RL 5
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Jenis Formulir Laporan RL *</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-medium focus:border-emerald-500 outline-none"
            >
              <option value="RL_1_2">RL 1.2 - Indikator Pelayanan RS (BOR, LOS, TOI, BTO, NDR, GDR)</option>
              <option value="RL_1_3">RL 1.3 - Fasilitas Tempat Tidur Rawat Inap</option>
              <option value="RL_3_1">RL 3.1 - Pelayanan Rawat Inap Per Kategori Kelas</option>
              <option value="RL_3_2">RL 3.2 - Pelayanan Rawat Jalan & Poliklinik</option>
              <option value="RL_4_A">RL 4a - Morbiditas Pasien Rawat Inap (ICD-10)</option>
              <option value="RL_5_1">RL 5.1 - Pengunjung Rumah Sakit</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Periode Bulan & Tahun *</label>
            <input
              type="month"
              value={periodMonth}
              onChange={(e) => setPeriodMonth(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-medium focus:border-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Report Preview Data */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800/80 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
            <span>Ringkasan Parameter Data ({selectedReport})</span>
            <span className="text-emerald-400 font-mono">100% Validated</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Total Pasien Terdata</span>
              <span className="text-base font-extrabold text-blue-400 font-mono">1.482 Pasien</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Rata-Rata BOR</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">82.5%</span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Status Validasi RS</span>
              <span className="text-xs font-extrabold text-cyan-400 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Siap Sync
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
          >
            Batal
          </button>
          <button
            onClick={handleExport}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>Generating Excel & XML...</>
            ) : (
              <>
                <Download className="w-4 h-4" /> Unduh Format SIRS Kemenkes (.xlsx)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
