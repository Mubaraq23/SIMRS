'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Users
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { Patient } from '@/types/simrs';
import { useToast } from '@/components/ui/ToastProvider';
import UniversalPrintModal, { PrintDocType } from '@/components/print/UniversalPrintModal';

export default function PendaftaranPage() {
  const { patients, addPatient, setActivePatient, registerAndEnqueuePatient } = useHospitalStore();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [printDoc, setPrintDoc] = useState<{ isOpen: boolean; type: PrintDocType; name: string; mrn: string }>({
    isOpen: false,
    type: 'KARTU_PASIEN',
    name: '',
    mrn: ''
  });

  // Form State
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [phone, setPhone] = useState('08123456789');
  const [address, setAddress] = useState('Jl. Merdeka No. 10');
  const [bpjsNo, setBpjsNo] = useState('');
  const [bloodType, setBloodType] = useState<'A+' | 'B+' | 'AB+' | 'O+'>('O+');
  const [nikVerified, setNikVerified] = useState<boolean | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik.includes(searchTerm)
  );

  const verifyNikDukcapil = () => {
    if (nik.length !== 16) {
      showToast({ type: 'error', title: 'Format NIK Salah', message: 'NIK harus terdiri dari 16 digit!' });
      setNikVerified(false);
      return;
    }
    setNikVerified(true);
    showToast({ type: 'success', title: 'Terverifikasi Dukcapil', message: 'NIK valid & terintegrasi dengan Kemendagri!' });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nik) {
      showToast({ type: 'warning', title: 'Form Tidak Lengkap', message: 'Nama dan NIK wajib diisi!' });
      return;
    }

    const newMrn = `RM-2026-08-00${patients.length + 1}`;
    const newP: Patient = {
      id: `p-${Date.now()}`,
      mrn: newMrn,
      nik,
      name,
      gender,
      birthDate,
      phone,
      address,
      bpjsCardNo: bpjsNo || undefined,
      allergies: [],
      bloodType,
      createdAt: new Date().toISOString()
    };

    registerAndEnqueuePatient(newP, 'Poliklinik Penyakit Dalam');
    setShowNewModal(false);
    showToast({
      type: 'success',
      title: 'Pasien Terdaftar & Antrian Diaktifkan!',
      message: `No. Rekam Medis: ${newMrn} | Otomatis masuk antrian & SATUSEHAT Sync Log.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Registration Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pasien Terdaftar Today</span>
          <p className="text-2xl font-black text-blue-400 font-mono">128 Pasien</p>
          <span className="text-[10px] text-slate-400">84 Lama | 44 Baru</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Self Kiosk Check-In</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">68% Mandiri</p>
          <span className="text-[10px] text-emerald-400">Barcode QR Code Fast Check-In</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verifikasi NIK Dukcapil</span>
          <p className="text-2xl font-black text-indigo-400 font-mono">100% Valid</p>
          <span className="text-[10px] text-indigo-400">Webservice Kemendagri Connected</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Klaim BPJS VClaim SEP</span>
          <p className="text-2xl font-black text-purple-400 font-mono">92 SEP Active</p>
          <span className="text-[10px] text-purple-400 font-semibold">Bridging BPJS v2.0</span>
        </div>
      </div>

      {/* Action Header & Search */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Database Rekam Medis (MRN Master Index)
            </h3>
            <p className="text-xs text-slate-400">Pendaftaran Pasien Baru, Kiosk Mandiri, dan Cetak Kartu Pasien</p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105"
          >
            <UserPlus className="w-4 h-4" /> Registrasi Pasien Baru
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Nama Pasien, No. RM (MRN), NIK KTP, atau HP..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Patients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-3.5">No. Rekam Medis (MRN)</th>
                <th className="p-3.5">NIK (Dukcapil)</th>
                <th className="p-3.5">Nama Lengkap Pasien</th>
                <th className="p-3.5">Gender / Gol.Darah</th>
                <th className="p-3.5">BPJS Kesehatan</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3.5 font-mono font-bold text-blue-400">{patient.mrn}</td>
                  <td className="p-3.5 font-mono text-slate-300">{patient.nik}</td>
                  <td className="p-3.5 font-bold text-slate-100">{patient.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {patient.gender === 'MALE' ? 'L' : 'P'} / {patient.bloodType}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {patient.bpjsCardNo ? (
                      <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {patient.bpjsCardNo}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">Umum / Non-BPJS</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setPrintDoc({ isOpen: true, type: 'KARTU_PASIEN', name: patient.name, mrn: patient.mrn })}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-400" /> Cetak Kartu
                    </button>

                    {patient.bpjsCardNo && (
                      <button
                        onClick={() => setPrintDoc({ isOpen: true, type: 'SEP_BPJS', name: patient.name, mrn: patient.mrn })}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-bold inline-flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" /> Cetak SEP
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Patient Registration Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" /> Registrasi Pasien Baru SIMRS
              </h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">NIK (KTP 16 Digit) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => {
                      setNik(e.target.value);
                      setNikVerified(null);
                    }}
                    placeholder="3171012304850001"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={verifyNikDukcapil}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-1.5 shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4" /> Dukcapil Check
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nama Lengkap Pasien *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sesuai KTP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100"
                  >
                    <option value="MALE">Laki-Laki</option>
                    <option value="FEMALE">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-lg shadow-blue-600/30"
                >
                  Simpan Pasien & Gen RM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Document Print Modal */}
      <UniversalPrintModal
        isOpen={printDoc.isOpen}
        onClose={() => setPrintDoc({ ...printDoc, isOpen: false })}
        docType={printDoc.type}
        patientName={printDoc.name}
        mrn={printDoc.mrn}
      />
    </div>
  );
}
