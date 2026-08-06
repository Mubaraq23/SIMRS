'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Plus, X, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

type McuParam = { parameter: string; value: string; unit: string; refRange: string; isAbnormal: boolean };

const MCU_PACKAGES = [
  { name: 'Paket Basic CPNS / Kerja', price: 450000, tests: ['Darah Lengkap', 'Urine Lengkap', 'Foto Thorax'] },
  { name: 'Paket Eksekutif Silver', price: 1250000, tests: ['Darah Lengkap', 'Profil Lipid', 'Fungsi Hati', 'Fungsi Ginjal', 'Gula Darah', 'Thorax X-Ray', 'EKG'] },
  { name: 'Paket Eksekutif Gold', price: 2800000, tests: ['Darah Lengkap CBC', 'Profil Lipid Lengkap', 'Fungsi Hati (SGOT, SGPT, GGT)', 'Fungsi Ginjal (Ureum, Kreatinin, Asam Urat)', 'Gula Darah & HbA1c', 'Thorax X-Ray PA', 'EKG 12 Lead', 'Spirometri', 'USG Abdomen', 'Mata & THT'] },
  { name: 'Paket Corporate Custom', price: 0, tests: ['Sesuai kontrak perusahaan'] },
];

const INITIAL_RESULTS: McuParam[] = [
  { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', refRange: '13.2 – 17.3', isAbnormal: false },
  { parameter: 'Leukosit', value: '11.8', unit: '10³/μL', refRange: '3.8 – 10.6', isAbnormal: true },
  { parameter: 'Trombosit', value: '245', unit: '10³/μL', refRange: '150 – 440', isAbnormal: false },
  { parameter: 'Gula Darah Puasa', value: '126', unit: 'mg/dL', refRange: '70 – 100', isAbnormal: true },
  { parameter: 'Kolesterol Total', value: '198', unit: 'mg/dL', refRange: '< 200', isAbnormal: false },
  { parameter: 'LDL Kolesterol', value: '142', unit: 'mg/dL', refRange: '< 130', isAbnormal: true },
  { parameter: 'SGOT (AST)', value: '28', unit: 'U/L', refRange: '< 40', isAbnormal: false },
  { parameter: 'Kreatinin', value: '0.9', unit: 'mg/dL', refRange: '0.6 – 1.2', isAbnormal: false },
];

export default function McuPage() {
  const { activePatient, addBillingItemToPatient } = useHospitalStore();
  const { showToast } = useToast();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(MCU_PACKAGES[2]);
  const [conclusion, setConclusion] = useState<'FIT' | 'FIT_RESTRICTION' | 'UNFIT'>('FIT_RESTRICTION');
  const [results, setResults] = useState<McuParam[]>(INITIAL_RESULTS);
  const [orderedMcu, setOrderedMcu] = useState<string | null>(null);

  const abnormalCount = results.filter(r => r.isAbnormal).length;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderedMcu(selectedPackage.name);
    if (activePatient) {
      addBillingItemToPatient(activePatient.mrn, {
        description: `MCU: ${selectedPackage.name}`,
        category: 'MCU / Medical Check Up',
        amount: selectedPackage.price,
      });
    }
    setShowOrderModal(false);
    showToast({ type: 'success', title: 'Order MCU Dibuat', message: `Paket ${selectedPackage.name} berhasil di-order untuk ${activePatient?.name}.` });
  };

  const handlePrintCertificate = () => {
    showToast({ type: 'success', title: 'Sertifikat MCU Dicetak', message: `Sertifikat hasil MCU ${activePatient?.name} berhasil digenerate sebagai PDF.` });
  };

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
        <div className="flex gap-2">
          <button
            onClick={() => setShowResultModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
          >
            <Activity className="w-4 h-4" /> Input Hasil MCU
          </button>
          <button
            onClick={() => setShowOrderModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
          >
            <Plus className="w-4 h-4" /> + Order MCU Baru
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Status Kesimpulan</span>
          <p className={`text-lg font-black ${conclusion === 'FIT' ? 'text-emerald-400' : conclusion === 'FIT_RESTRICTION' ? 'text-amber-400' : 'text-rose-400'}`}>
            {conclusion === 'FIT' ? 'FIT TO WORK' : conclusion === 'FIT_RESTRICTION' ? 'FIT w/ RESTRICTION' : 'UNFIT TO WORK'}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Hasil Abnormal</span>
          <p className={`text-2xl font-black font-mono ${abnormalCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{abnormalCount} Parameter</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Paket MCU</span>
          <p className="text-xs font-bold text-teal-400">{orderedMcu || 'Paket Eksekutif Gold'}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Pasien MCU</span>
          <p className="text-sm font-black text-slate-100">{activePatient?.name?.split(' ')[0]}</p>
          <span className="text-[10px] text-slate-400">{activePatient?.mrn}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hasil Pemeriksaan MCU */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Hasil Pemeriksaan Lab MCU – {activePatient?.name}</h3>
            <button onClick={handlePrintCertificate}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition">
              <Printer className="w-4 h-4" /> Cetak Sertifikat MCU (PDF)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Hasil</th>
                  <th className="py-3 px-4">Satuan</th>
                  <th className="py-3 px-4">Nilai Normal</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {results.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-slate-100">{r.parameter}</td>
                    <td className={`py-3 px-4 font-mono font-bold ${r.isAbnormal ? 'text-amber-400' : 'text-slate-200'}`}>{r.value}</td>
                    <td className="py-3 px-4 text-slate-400">{r.unit}</td>
                    <td className="py-3 px-4 text-slate-400">{r.refRange}</td>
                    <td className="py-3 px-4 text-right">
                      {r.isAbnormal ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center justify-end gap-1">
                          <AlertCircle className="w-3 h-3" /> ABNORMAL
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-end gap-1">
                          <CheckCircle className="w-3 h-3" /> NORMAL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kesimpulan */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-100 block">Kesimpulan & Rekomendasi Dokter MCU:</span>
            <p className="text-slate-300">
              Secara umum kondisi kesehatan pasien{' '}
              <strong className={conclusion === 'FIT' ? 'text-emerald-400' : conclusion === 'FIT_RESTRICTION' ? 'text-amber-400' : 'text-rose-400'}>
                {conclusion === 'FIT' ? 'FIT TO WORK' : conclusion === 'FIT_RESTRICTION' ? 'FIT TO WORK WITH RESTRICTION' : 'UNFIT TO WORK'}
              </strong>
              {'. '}
              {abnormalCount > 0 && `Terdapat ${abnormalCount} parameter abnormal yang perlu tindak lanjut. Disarankan kontrol ke dokter spesialis.`}
            </p>
            <div className="flex gap-2 pt-1">
              {(['FIT', 'FIT_RESTRICTION', 'UNFIT'] as const).map(c => (
                <button key={c} onClick={() => setConclusion(c)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition ${
                    conclusion === c
                      ? c === 'FIT' ? 'bg-emerald-600 text-white border-emerald-500' : c === 'FIT_RESTRICTION' ? 'bg-amber-600 text-white border-amber-500' : 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                  }`}>
                  {c.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MCU Packages */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Daftar Paket MCU Rumah Sakit</h3>
          {MCU_PACKAGES.map((pkg, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-slate-100">{pkg.name}</span>
                <span className="text-teal-400 font-mono text-[10px] font-bold">
                  {pkg.price > 0 ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Kontrak'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {pkg.tests.slice(0, 3).map((t, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px]">{t}</span>
                ))}
                {pkg.tests.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 text-[9px]">+{pkg.tests.length - 3} lagi</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Order MCU */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-teal-400" /> Order Medical Check Up Baru
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Pasien</label>
                <input readOnly value={`${activePatient?.name} – ${activePatient?.mrn}`}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-slate-400" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Pilih Paket MCU *</label>
                {MCU_PACKAGES.map((pkg, i) => (
                  <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border mb-2 cursor-pointer transition ${
                    selectedPackage.name === pkg.name ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800 hover:border-slate-600'
                  }`}>
                    <input type="radio" name="pkg" checked={selectedPackage.name === pkg.name}
                      onChange={() => setSelectedPackage(pkg)} className="accent-teal-500" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-100">{pkg.name}</p>
                      <p className="text-[10px] text-teal-400">{pkg.price > 0 ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'Kontrak Perusahaan'}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowOrderModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition">Batal</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition">
                  Buat Order MCU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Input Hasil */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-400" /> Input / Edit Hasil Pemeriksaan MCU
              </h3>
              <button onClick={() => setShowResultModal(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
              {results.map((r, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 items-center">
                  <span className="font-semibold text-slate-200">{r.parameter}</span>
                  <input
                    type="text"
                    value={r.value}
                    onChange={(e) => setResults(prev => prev.map((p, i) => i === idx ? { ...p, value: e.target.value } : p))}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 text-center font-mono"
                  />
                  <label className="flex items-center gap-2 justify-end cursor-pointer">
                    <span className="text-slate-400">Abnormal</span>
                    <input type="checkbox" checked={r.isAbnormal}
                      onChange={() => setResults(prev => prev.map((p, i) => i === idx ? { ...p, isAbnormal: !p.isAbnormal } : p))}
                      className="accent-amber-500 w-4 h-4" />
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setShowResultModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition text-xs">Batal</button>
              <button onClick={() => { setShowResultModal(false); showToast({ type: 'success', title: 'Hasil Tersimpan', message: 'Data hasil MCU berhasil diperbarui.' }); }}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition text-xs">
                Simpan Hasil MCU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
