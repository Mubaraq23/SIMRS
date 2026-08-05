'use client';

import React from 'react';
import { Wrench, ShieldCheck, Activity, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export default function IpsrsPage() {
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
                <th className="py-3 px-4 text-right">Status Kalibrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { name: 'Patient Monitor Mindray iMEC10', room: 'ICU Utama', serial: 'ALK-2024-0012', last: '2025-09-10', next: '2026-09-10', status: 'VALID' },
                { name: 'Defibrillator Nihon Kohden TEC-5600', room: 'IGD Resusitasi', serial: 'ALK-2024-0045', last: '2025-08-01', next: '2026-08-01', status: 'WARNING' },
                { name: 'Ventilator Draeger Evita V300', room: 'ICU Bed A', serial: 'ALK-2023-0889', last: '2025-11-20', next: '2026-11-20', status: 'VALID' }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-slate-100">{item.name}</td>
                  <td className="py-3 px-4 text-slate-300">{item.room}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{item.serial}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.last}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">{item.next}</td>
                  <td className="py-3 px-4 text-right">
                    {item.status === 'WARNING' ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                        ⚠️ RE-KALIBRASI DUE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        ✓ TERKALIBRASI BPFK
                      </span>
                    )}
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
