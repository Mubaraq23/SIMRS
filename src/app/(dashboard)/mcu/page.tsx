'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, CheckCircle, Printer, Search, Award } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';

export default function McuPage() {
  const { activePatient } = useHospitalStore();
  const [mcuPackage, setMcuPackage] = useState('Paket Eksekutif Gold');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" /> Medical Check Up (MCU) & Kesehatan Kerja
          </h2>
          <p className="text-xs text-slate-400">Paket MCU Eksekutif/Corporate, Treadmill, Spirometri, Audiometri & Surat Keterangan Kesehatan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MCU Package Builder */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Pemeriksaan MCU Pasien: {activePatient?.name}</h3>
            <span className="text-xs text-teal-400 font-mono">Paket MCU Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-teal-300 block">Pemeriksaan Fisik & Penunjang</span>
              <ul className="space-y-1 text-slate-300">
                <li>✓ Pemeriksaan Dokter Umum & Mata</li>
                <li>✓ EKG Istirahat 12 Lead</li>
                <li>✓ Thorax X-Ray PA View</li>
                <li>✓ Spirometri (Fungsi Paru)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-teal-300 block">Laboratorium MCU Lengkap</span>
              <ul className="space-y-1 text-slate-300">
                <li>✓ Darah Lengkap (CBC)</li>
                <li>✓ Profil Lipid (Kolesterol, HDL, LDL, TG)</li>
                <li>✓ Fungsi Hati (SGOT, SGPT)</li>
                <li>✓ Fungsi Ginjal (Ureum, Kreatinin)</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-slate-100 block">Kesimpulan & Rekomendasi Dokter MCU:</span>
            <p className="text-slate-300">
              Secara umum kondisi kesehatan pasien <strong className="text-emerald-400">FIT TO WORK WITH RESTRICTION</strong> (Sehat untuk bekerja dengan catatan kontrol tekanan darah).
            </p>
          </div>

          <button
            onClick={() => alert(`Sertifikat MCU Hasil Pemeriksaan untuk ${activePatient?.name} Berhasil Dicetak!`)}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Printer className="w-4 h-4" /> Cetak Sertifikat Hasil MCU (PDF)
          </button>
        </div>

        {/* MCU Packages List */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Daftar Paket MCU RS</h3>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Paket Basic CPNS / Kerja', price: 'Rp 450.000' },
              { name: 'Paket Eksekutif Silver', price: 'Rp 1.250.000' },
              { name: 'Paket Eksekutif Gold', price: 'Rp 2.800.000' },
              { name: 'Paket Corporate Custom', price: 'Kontrak Perusahaan' }
            ].map((pkg, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between font-semibold">
                <span className="text-slate-200">{pkg.name}</span>
                <span className="text-teal-400 font-mono">{pkg.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
