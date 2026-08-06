'use client';

import React, { useState } from 'react';
import { Award, ShieldAlert, FileText, CheckCircle, Plus, AlertCircle, TrendingUp, X } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';
import { PmkpIncident } from '@/types/simrs';

const INM_METRICS = [
  { name: 'Kepatuhan Kebersihan Tangan (Hand Hygiene)', target: '≥ 85%', current: 92.4, status: 'PASSED' },
  { name: 'Kepatuhan Penggunaan Alat Pelindung Diri (APD)', target: '100%', current: 98.2, status: 'PASSED' },
  { name: 'Kepatuhan Identifikasi Pasien (Barcoding)', target: '100%', current: 99.8, status: 'PASSED' },
  { name: 'Waktu Tanggap Seksio Sesarea Emergensi', target: '≤ 30 Menit', current: 24.5, status: 'PASSED' },
  { name: 'Waktu Tunggu Rawat Jalan', target: '≤ 60 Menit', current: 42.0, status: 'PASSED' },
  { name: 'Pelaporan Hasil Kritis Laboratorium < 30 Menit', target: '100%', current: 96.5, status: 'WARNING' },
];

export default function PmkpAkreditasiPage() {
  const { pmkpIncidents, addPmkpIncident } = useHospitalStore();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'INCIDENTS' | 'INM_METRICS' | 'RCA_MATRIX'>('INCIDENTS');

  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState<'SENTINEL' | 'KTD' | 'KNC' | 'KTC' | 'KPS'>('KNC');
  const [location, setLocation] = useState('Depo Farmasi Rawat Inap');
  const [severity, setSeverity] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'>('MODERATE');

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newInc: PmkpIncident = {
      id: `pmkp-${Date.now()}`,
      incidentNo: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      incidentType,
      title,
      location,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'RCA_IN_PROGRESS',
      severity
    };

    addPmkpIncident(newInc);
    setShowModal(false);
    showToast({ type: 'warning', title: 'Insiden (IKP) Dilaporkan', message: `Laporan ${newInc.incidentNo} telah didaftarkan untuk proses RCA.` });
    setTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" /> PMKP, Patient Safety & Standar Akreditasi KARS / JCI
          </h2>
          <p className="text-xs text-slate-400">Pelaporan Insiden (Sentinel, KTD, KNC, KTC), RCA Matrix, Indikator Mutu Nasional (INM) & SOP Digital</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition"
          >
            <Plus className="w-4 h-4" /> + Lapor Insiden Keselamatan (IKP)
          </button>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'INCIDENTS', label: 'Insiden IKP' },
              { id: 'INM_METRICS', label: 'Indikator Mutu INM' },
              { id: 'RCA_MATRIX', label: 'RCA 5-Why Matrix' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === t.id ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top PMKP KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Capaian Mutu INM</span>
          <p className="text-2xl font-black text-purple-400 font-mono">95.8%</p>
          <span className="text-[10px] text-purple-400 font-semibold">Memenuhi Target Kemenkes</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sentinel Event</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">0 Kasus</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Zero Sentinel Incident</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">KTD / KNC Reports</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{pmkpIncidents.length} Kejadian</p>
          <span className="text-[10px] text-amber-400">RCA & CAPA In Progress</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Akreditasi</span>
          <p className="text-2xl font-black text-cyan-400 font-mono">PARIPURNA</p>
          <span className="text-[10px] text-cyan-400 font-semibold">KARS STARKES 2024</span>
        </div>
      </div>

      {/* TAB 1: Insiden Reports Table */}
      {activeTab === 'INCIDENTS' && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Daftar Insiden Keselamatan Pasien (PMKP Logs)</span>
            <span className="text-xs text-purple-400 font-mono">Workflow RCA Active</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">No. Insiden</th>
                  <th className="py-3 px-4">Tipe Insiden</th>
                  <th className="py-3 px-4">Judul Kejadian</th>
                  <th className="py-3 px-4">Lokasi Unit</th>
                  <th className="py-3 px-4">Tgl Dilaporkan</th>
                  <th className="py-3 px-4">Grading Risk</th>
                  <th className="py-3 px-4 text-right">Status RCA & CAPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pmkpIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-purple-400">{inc.incidentNo}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold font-mono">
                        {inc.incidentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-100">{inc.title}</td>
                    <td className="py-3 px-4 text-slate-300">{inc.location}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{inc.reportedDate}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Indikator Mutu Nasional (INM) */}
      {activeTab === 'INM_METRICS' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex justify-between items-center">
            <span>Indikator Mutu Nasional (INM) Kemenkes RI</span>
            <span className="text-xs font-mono text-purple-400">Mutu Pelayanan Terukur</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INM_METRICS.map((m, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-100">{m.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    m.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Standard: <span className="text-slate-200 font-semibold">{m.target}</span></span>
                  <span className="font-mono font-bold text-purple-400 text-sm">{m.current}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.current >= 95 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                    style={{ width: `${Math.min(100, m.current)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RCA 5-Why Matrix */}
      {activeTab === 'RCA_MATRIX' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 max-w-3xl mx-auto text-xs">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
            Matriks Root Cause Analysis (RCA 5-Why Method) – INC-2026-004
          </h3>

          <div className="space-y-3">
            {[
              { why: 'Why 1: Mengapa resep obat hampir tertukar?', answer: 'Label nama pasien pada botol obat cetakan printer blur.' },
              { why: 'Why 2: Mengapa cetakan label blur?', answer: 'Tinta printer thermal depo farmasi habis belum diganti.' },
              { why: 'Why 3: Mengapa tidak langsung diganti?', answer: 'Stok cadangan pita printer di gudang farmasi habis.' },
              { why: 'Why 4: Mengapa stok habis?', answer: 'Permintaan PR ke bagian logistik terlambat diajukan.' },
              { why: 'Why 5 (Root Cause): Mengapa terlambat diajukan?', answer: 'Belum ada sistem Reorder Point (ROP) otomatis untuk consumables IT/Farmasi.' },
            ].map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 block">{step.why}</span>
                <p className="text-slate-200 pl-3 border-l-2 border-purple-500/40">{step.answer}</p>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
              ✓ Tindakan Korektif (CAPA): Implementasi fitur Auto Reorder Point (ROP) di SIMRS & Barcode Scanner 2D Validation sebelum dispense obat.
            </div>
          </div>
        </div>
      )}

      {/* Modal Report Incident */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Form Laporan Insiden Keselamatan Pasien</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipe Insiden (IKP)</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="KNC">KNC - Kejadian Nyaris Cedera (Near Miss)</option>
                  <option value="KTD">KTD - Kejadian Tidak Diharapkan</option>
                  <option value="KTC">KTC - Kejadian Tidak Cedera</option>
                  <option value="KPS">KPS - Kondisi Potensial Cedera</option>
                  <option value="SENTINEL">SENTINEL EVENT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Kejadian *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ringkasan insiden..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lokasi Unit *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  required
                />
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
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition"
                >
                  Kirim Laporan IKP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
