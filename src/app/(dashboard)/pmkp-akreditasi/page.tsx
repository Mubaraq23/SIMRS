'use client';

import React, { useState } from 'react';
import { Award, ShieldAlert, FileText, CheckCircle, Plus, AlertCircle } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { PmkpIncident } from '@/types/simrs';

export default function PmkpAkreditasiPage() {
  const { pmkpIncidents, addPmkpIncident } = useHospitalStore();
  const [showModal, setShowModal] = useState(false);

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
    alert('Laporan Insiden Keselamatan Pasien (IKP / PMKP) Berhasil Diterbitkan!');
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

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" /> + Lapor Insiden Keselamatan (IKP)
        </button>
      </div>

      {/* Incident Reports Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Daftar Insiden Keselamatan Pasien (PMKP Logs)</span>
          <span className="text-xs text-purple-400 font-mono">No Sentinel Event</span>
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

      {/* Modal Report Incident */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">Form Laporan Insiden Keselamatan Pasien</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400">✕</button>
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

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-purple-600 text-white font-bold rounded-xl shadow"
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
