'use client';

import React, { useState } from 'react';
import { Building2, ShieldAlert, Award, Calendar, Clock, UserCheck, Search, Download, Plus, X } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';
import { MedicalStaff, UserRole } from '@/types/simrs';

export default function SdmPage() {
  const { medicalStaff } = useHospitalStore();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<MedicalStaff[]>(medicalStaff);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('DOKTER');
  const [strNumber, setStrNumber] = useState('STR-31.1.1.100.2.26.');
  const [strExpiry, setStrExpiry] = useState('2028-12-31');
  const [sipNumber, setSipNumber] = useState('SIP-503/449/DOKTER/2026');
  const [sipExpiry, setSipExpiry] = useState('2027-12-31');
  const [department, setDepartment] = useState('Poliklinik Jantung');

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sipNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newStaff: MedicalStaff = {
      id: `st-${Date.now()}`,
      name,
      role,
      strNumber,
      strExpiry,
      sipNumber,
      sipExpiry,
      department,
      status: 'ACTIVE'
    };

    setStaffList([newStaff, ...staffList]);
    setShowAddModal(false);
    showToast({ type: 'success', title: 'Pegawai Baru Didaftarkan', message: `${name} (${role}) berhasil didaftarkan di ${department}.` });
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" /> SDM, Credentialing & Legalitas Tenaga Medis
          </h2>
          <p className="text-xs text-slate-400">Monitoring Surat Tanda Registrasi (STR), Surat Izin Praktik (SIP) & Roster Shift Karyawan</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" /> + Tambah Pegawai Medis
        </button>
      </div>

      {/* Top HR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Tenaga Medis</span>
          <p className="text-2xl font-black text-amber-400 font-mono">{staffList.length + 426} Pegawai</p>
          <span className="text-[10px] text-amber-400 font-semibold">Dokter: 65 | Perawat: 240 | Penunjang: 124</span>
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
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
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

      {/* Modal: Tambah Pegawai Medis */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" /> Form Tambah Pegawai Medis Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: dr. Bambang Sudiro, Sp.JP"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Peran (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  >
                    <option value="DOKTER">DOKTER</option>
                    <option value="PERAWAT">PERAWAT</option>
                    <option value="FARMASI">FARMASI</option>
                    <option value="KASIR">KASIR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Departemen / Unit *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor STR Kemenkes *</label>
                <input
                  type="text"
                  value={strNumber}
                  onChange={(e) => setStrNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nomor SIP Dinkes *</label>
                <input
                  type="text"
                  value={sipNumber}
                  onChange={(e) => setSipNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition"
                >
                  Daftarkan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
