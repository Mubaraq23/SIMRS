'use client';

import React, { useState } from 'react';
import { Scissors, CheckSquare, Clock, ShieldAlert, User, Activity, Plus, Calendar, FilePlus } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function KamarOperasiPage() {
  const { patients, addBillingItemToPatient, addSatusehatLog } = useHospitalStore();
  const { showToast } = useToast();

  const [signInDone, setSignInDone] = useState(true);
  const [timeOutDone, setTimeOutDone] = useState(true);
  const [signOutDone, setSignOutDone] = useState(false);
  const [aldreteScore, setAldreteScore] = useState(9);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Booking Form State
  const [selectedMrn, setSelectedMrn] = useState(patients[0]?.mrn || 'RM-2026-08-0001');
  const [procedureName, setProcedureName] = useState('Laparoscopic Cholecystectomy');
  const [surgeonName, setSurgeonName] = useState('dr. H. Hendra, Sp.B');
  const [anesthesiologistName, setAnesthesiologistName] = useState('dr. Rian, Sp.An');
  const [operatingRoom, setOperatingRoom] = useState('OK Utama - Room 2');
  const [scheduledTime, setScheduledTime] = useState('2026-08-06 09:00');

  const handleCreateSurgeryBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.mrn === selectedMrn) || patients[0];

    // 1. Add Billing item for surgery
    addBillingItemToPatient(patientObj.mrn, {
      description: `Tindakan Operasi OK: ${procedureName} (${operatingRoom})`,
      category: 'Tindakan Bedah',
      amount: 6800000
    });

    // 2. Add SATUSEHAT Procedure telemetry log
    addSatusehatLog({
      id: `sat-${Date.now()}`,
      resourceType: 'Procedure',
      resourceId: `proc-${Math.floor(1000 + Math.random() * 9000)}`,
      satusehatId: `SS-PROC-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'SUCCESS',
      syncTime: new Date().toLocaleString('id-ID'),
      httpCode: 201
    });

    setShowBookingModal(false);
    showToast({
      type: 'success',
      title: 'Jadwal Operasi Dibuat!',
      message: `Tindakan ${procedureName} untuk ${patientObj.name} berhasil dijadwalkan di ${operatingRoom}. Tagihan & SATUSEHAT tersinkronisasi.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Operating Room KPI Cards & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-rose-400" /> Kamar Operasi (OK) & WHO Surgical Safety Checklist
          </h2>
          <p className="text-xs text-slate-400">Jadwal Operasi, Checklist WHO (Sign In, Time Out, Sign Out), Anaesthesia Record & PACU Recovery</p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition hover:scale-105"
        >
          <FilePlus className="w-4 h-4" /> + Booking Jadwal Operasi (OK)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: WHO Surgical Safety Checklist */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Checklist Keselamatan Operasi WHO (Surgical Safety Protocol)
            </h3>
            <span className="text-xs text-rose-400 font-mono font-bold">KARS & STARKES Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Phase 1: SIGN IN */}
            <div className={`p-4 rounded-2xl border space-y-3 ${signInDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-2">
                <span className="text-slate-100 font-extrabold">1. SIGN IN</span>
                <span className="text-[10px] text-emerald-400 font-bold">Sebelum Anestesi</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">✓ Konfirmasi Identitas Pasien</li>
                <li className="flex items-center gap-2">✓ Marker Lokasi Operasi</li>
                <li className="flex items-center gap-2">✓ Mesin & Obat Anestesi Cek</li>
                <li className="flex items-center gap-2">✓ Pulse Oksimeter Terpasang</li>
              </ul>
              <button
                onClick={() => setSignInDone(!signInDone)}
                className={`w-full py-2 rounded-xl text-[11px] font-extrabold transition ${signInDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {signInDone ? 'Verified Sign In ✓' : 'Verifikasi Sign In'}
              </button>
            </div>

            {/* Phase 2: TIME OUT */}
            <div className={`p-4 rounded-2xl border space-y-3 ${timeOutDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-2">
                <span className="text-slate-100 font-extrabold">2. TIME OUT</span>
                <span className="text-[10px] text-emerald-400 font-bold">Sebelum Insisi</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">✓ Perkenalan Anggota Tim</li>
                <li className="flex items-center gap-2">✓ Konfirmasi Nama & Insisi</li>
                <li className="flex items-center gap-2">✓ Antisipasi Pendarahan</li>
                <li className="flex items-center gap-2">✓ Profilaksis Antibiotik</li>
              </ul>
              <button
                onClick={() => setTimeOutDone(!timeOutDone)}
                className={`w-full py-2 rounded-xl text-[11px] font-extrabold transition ${timeOutDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'}`}
              >
                {timeOutDone ? 'Verified Time Out ✓' : 'Verifikasi Time Out'}
              </button>
            </div>

            {/* Phase 3: SIGN OUT */}
            <div className={`p-4 rounded-2xl border space-y-3 ${signOutDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-2">
                <span className="text-slate-100 font-extrabold">3. SIGN OUT</span>
                <span className="text-[10px] text-emerald-400 font-bold">Sebelum Keluar OK</span>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">✓ Hitung Kassa & Instrumen</li>
                <li className="flex items-center gap-2">✓ Pelabelan Spesimen</li>
                <li className="flex items-center gap-2">✓ Masalah Peralatan</li>
                <li className="flex items-center gap-2">✓ Catatan Pemulihan (PACU)</li>
              </ul>
              <button
                onClick={() => setSignOutDone(!signOutDone)}
                className={`w-full py-2 rounded-xl text-[11px] font-extrabold transition ${signOutDone ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
              >
                {signOutDone ? 'Verified Sign Out ✓' : 'Verifikasi Sign Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Recovery Room (PACU) & Aldrete Score */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Recovery Room (PACU) - Score Aldrete
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Skor Pemulihan Anestesi (Aldrete):</span>
              <span className="text-xl font-black font-mono text-emerald-400">{aldreteScore} / 10</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {aldreteScore >= 9 ? 'Pasien AMAN dipindahkan ke Ruang Rawat Inap (Skor >= 9).' : 'Pasien masih memerlukan observasi ketat di PACU.'}
            </p>

            <button
              onClick={() => showToast({ type: 'success', title: 'Transfer Approved', message: 'Transfer Pasien dari Kamar Operasi ke Rawat Inap Disetujui!' })}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition"
            >
              Approve Transfer Rawat Inap
            </button>
          </div>
        </div>
      </div>

      {/* Modal Booking Operasi */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-rose-400" /> Booking Jadwal Operasi / Bedah Sentral
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSurgeryBooking} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Pasien Terdaftar *</label>
                <select
                  value={selectedMrn}
                  onChange={(e) => setSelectedMrn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-semibold cursor-pointer outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.mrn} className="bg-slate-900 text-slate-100">
                      {p.name} ({p.mrn}) - NIK: {p.nik}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Tindakan Operasi *</label>
                <input
                  type="text"
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dokter Bedah (Operator)</label>
                  <input
                    type="text"
                    value={surgeonName}
                    onChange={(e) => setSurgeonName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dokter Anestesi</label>
                  <input
                    type="text"
                    value={anesthesiologistName}
                    onChange={(e) => setAnesthesiologistName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Ruang Kamar Operasi</label>
                  <input
                    type="text"
                    value={operatingRoom}
                    onChange={(e) => setOperatingRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Jadwal Tanggal & Jam</label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold shadow-lg shadow-rose-600/30"
                >
                  Simpan Jadwal Operasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
