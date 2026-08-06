'use client';

import React, { useState } from 'react';
import { Wrench, ShieldCheck, Activity, AlertTriangle, CheckCircle, Zap, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

type CalibrationItem = {
  id: string;
  name: string;
  room: string;
  serial: string;
  lastDate: string;
  nextDate: string;
  status: 'VALID' | 'WARNING' | 'EXPIRED';
};

type WorkOrder = {
  id: string;
  woNo: string;
  device: string;
  location: string;
  issue: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'IN_PROGRESS' | 'DONE';
};

const INITIAL_CALIBRATIONS: CalibrationItem[] = [
  { id: 'c1', name: 'Patient Monitor Mindray iMEC10', room: 'ICU Utama', serial: 'ALK-2024-0012', lastDate: '2025-09-10', nextDate: '2026-09-10', status: 'VALID' },
  { id: 'c2', name: 'Defibrillator Nihon Kohden TEC-5600', room: 'IGD Resusitasi', serial: 'ALK-2024-0045', lastDate: '2025-08-01', nextDate: '2026-08-01', status: 'WARNING' },
  { id: 'c3', name: 'Ventilator Draeger Evita V300', room: 'ICU Bed A', serial: 'ALK-2023-0889', lastDate: '2025-11-20', nextDate: '2026-11-20', status: 'VALID' }
];

const INITIAL_WOS: WorkOrder[] = [
  { id: 'w1', woNo: 'WO-2026-081', device: 'AC Central Ruang Operasi OK-02', location: 'Gedung Bedah Sentral', issue: 'Suhu tidak mencapai 19 C', priority: 'HIGH', status: 'IN_PROGRESS' },
  { id: 'w2', woNo: 'WO-2026-085', device: 'Infusion Pump Terumo TE-112', location: 'Rawat Inap Mawar', issue: 'Alarm error occlusion sensor', priority: 'MEDIUM', status: 'IN_PROGRESS' }
];

export default function IpsrsPage() {
  const { showToast } = useToast();
  const [calibrations, setCalibrations] = useState<CalibrationItem[]>(INITIAL_CALIBRATIONS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WOS);
  const [showWoModal, setShowWoModal] = useState(false);

  // Form states
  const [device, setDevice] = useState('');
  const [location, setLocation] = useState('IGD Resusitasi');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  const handleRecalibrate = (id: string, name: string) => {
    setCalibrations(prev => prev.map(c => c.id === id ? { ...c, status: 'VALID' as const, nextDate: '2027-08-01' } : c));
    showToast({ type: 'success', title: 'Kalibrasi BPFK Berhasil', message: `Sertifikat kalibrasi untuk ${name} telah diperbarui (Status VALID).` });
  };

  const handleCreateWo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!device || !issue) return;

    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      woNo: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
      device,
      location,
      issue,
      priority,
      status: 'IN_PROGRESS'
    };

    setWorkOrders([newWo, ...workOrders]);
    setShowWoModal(false);
    showToast({ type: 'info', title: 'Work Order Diterbitkan', message: `WO ${newWo.woNo} dikirim ke teknisi Biomedis IPSRS.` });
    setDevice('');
    setIssue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-teal-400" /> Biomedical Engineering (IPSRS) & IoT Monitoring
          </h2>
          <p className="text-xs text-slate-400">Pemeliharaan Alat Kesehatan (Alkes), Jadwal Kalibrasi BPFK, Work Order & Sensor IoT Utilitas</p>
        </div>

        <button
          onClick={() => setShowWoModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
        >
          <Plus className="w-4 h-4" /> + Buat Work Order (WO) IPSRS
        </button>
      </div>

      {/* IoT Sensors Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Tekanan Oksigen Sentral (Oxygen Plant)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400">4.2 Bar</span>
          <p className="text-[11px] text-slate-400">Sensor IoT #OXY-01 Status Normal</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Power Genset Utama (500 kVA)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-2xl font-bold font-mono text-slate-100">380 V / 50 Hz</span>
          <p className="text-[11px] text-slate-400">PLN Active | Standby Auto-ATS</p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Suhu Chiller Farmasi Utama</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-2xl font-bold font-mono text-teal-400">4.1 °C</span>
          <p className="text-[11px] text-slate-400">Target Range: 2.0 °C - 8.0 °C</p>
        </div>
      </div>

      {/* Medical Device Calibration Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Jadwal Kalibrasi Alat Kesehatan (BPFK Kemenkes)</span>
          <span className="text-xs text-teal-400 font-mono">ISO 13485 Compliant</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Nama Alat Kesehatan / Merk</th>
                <th className="py-3 px-4">Ruang Lokasi</th>
                <th className="py-3 px-4">No. Seri (Asset Code)</th>
                <th className="py-3 px-4">Tgl Kalibrasi Terakhir</th>
                <th className="py-3 px-4">Jadwal Kalibrasi Berikutnya</th>
                <th className="py-3 px-4 text-right">Status Kalibrasi & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calibrations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-slate-100">{item.name}</td>
                  <td className="py-3 px-4 text-slate-300">{item.room}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{item.serial}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.lastDate}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">{item.nextDate}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {item.status === 'WARNING' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] inline-block mb-1 sm:mb-0">
                        ⚠️ RE-KALIBRASI DUE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] inline-block mb-1 sm:mb-0">
                        ✓ TERKALIBRASI BPFK
                      </span>
                    )}

                    {item.status === 'WARNING' && (
                      <button
                        onClick={() => handleRecalibrate(item.id, item.name)}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[10px] shadow transition"
                      >
                        Input Hasil Kalibrasi
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex justify-between items-center">
          <span>Work Order IPSRS Aktif</span>
          <span className="font-mono text-teal-400">{workOrders.length} WO In-Progress</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workOrders.map((wo) => (
            <div key={wo.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between font-bold text-slate-100">
                <span className="text-teal-400 font-mono">{wo.woNo}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  wo.priority === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  PRIORITAS {wo.priority}
                </span>
              </div>
              <p className="font-semibold text-slate-200">{wo.device}</p>
              <p className="text-[11px] text-slate-400">Lokasi: {wo.location} | Kendala: {wo.issue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Buat WO */}
      {showWoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-teal-400" /> Form Work Order IPSRS
              </h3>
              <button onClick={() => setShowWoModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Perangkat / Fasilitas *</label>
                <input
                  type="text"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  placeholder="Contoh: Lampu Operasi OK-01..."
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

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Kerusakan / Kendala *</label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Jelaskan masalah teknis..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 h-20"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tingkat Prioritas *</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="HIGH">HIGH (Urgent)</option>
                  <option value="MEDIUM">MEDIUM (Normal)</option>
                  <option value="LOW">LOW (Rutin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWoModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition"
                >
                  Kirim Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
