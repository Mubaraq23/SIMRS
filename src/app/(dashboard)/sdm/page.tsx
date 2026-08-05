'use client';

import React, { useState } from 'react';
import { Building2, ShieldAlert, Award, Calendar, Clock, UserCheck, Search, Download, Plus } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function SdmPage() {
  const { medicalStaff } = useHospitalStore();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = medicalStaff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sipNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top HR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tenaga Medis</span>
          <p className="text-2xl font-black text-amber-400 font-mono">428 Pegawai</p>
          <span className="text-[10px] text-amber-400 font-semibold">Dokter: 64 | Perawat: 240 | Penunjang: 124</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Peringatan STR/SIP Warning</span>
          <p className="text-2xl font-black text-amber-400 font-mono">1 Dokter</p>
          <span className="text-[10px] text-amber-400 font-semibold">dr. Ahmad Pratama (&lt; 30 Hari Expired)</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Credentialing</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">98% Valid</p>
          <span className="text-[10px] text-emerald-400">Komite Medik & Keperawatan</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tingkat Kehadiran Shift</span>
          <p className="text-2xl font-black text-blue-400 font-mono">99.2%</p>
          <span className="text-[10px] text-blue-400 font-semibold">Face Recognition Kiosk</span>
        </div>
      </div>

      {/* Staff Credentialing Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" /> Direktori Tenaga Medis & Legalitas STR/SIP
            </h3>
            <p className="text-xs text-slate-400">Monitoring masa berlaku STR Kemenkes dan SIP Dinas Kesehatan</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama / SIP / poli..."
                className="bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
            <button
              onClick={() => showToast({ type: 'info', title: 'Export SDM', message: 'Mengeksport data legalitas STR/SIP ke Excel...' })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-3.5">Nama Tenaga Medis / Perawat</th>
                <th className="p-3.5">Role & Departemen</th>
                <th className="p-3.5">Nomor STR (Kemenkes)</th>
                <th className="p-3.5">Expired STR</th>
                <th className="p-3.5">Nomor SIP (Dinkes)</th>
                <th className="p-3.5">Expired SIP</th>
                <th className="p-3.5 text-right">Status Legality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3.5 font-bold text-slate-100">{staff.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-semibold text-[10px]">
                      {staff.role}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{staff.department}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{staff.strNumber}</td>
                  <td className="p-3.5 font-mono text-slate-300">{staff.strExpiry}</td>
                  <td className="p-3.5 font-mono text-slate-300">{staff.sipNumber}</td>
                  <td className="p-3.5 font-mono">
                    <span className={staff.status === 'EXPIRED_WARNING' ? 'text-amber-400 font-extrabold' : 'text-slate-300'}>
                      {staff.sipExpiry}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {staff.status === 'EXPIRED_WARNING' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] border border-amber-500/30">
                        ⚠️ WARNING (&lt;30 HARI)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                        ✓ AKTIF & VALID
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
