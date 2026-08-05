'use client';

import React, { useState } from 'react';
import { Video, PhoneCall, MessageSquare, Send, Pill, CheckCircle, Shield } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';

export default function TelemedicinePage() {
  const { activePatient } = useHospitalStore();
  const [isInCall, setIsInCall] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Video className="w-5 h-5 text-teal-400" /> Telemedicine & Portal Konsultasi Digital
          </h2>
          <p className="text-xs text-slate-400">Video Konsultasi Real-time, e-Farmasi Delivery, & Notification Engine (WhatsApp Gateway)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Consultation Screen */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Sesi Telekonsultasi Aktif</h3>
              <p className="text-xs text-slate-400">Pasien: {activePatient?.name} | Dokter: dr. Ahmad Pratama, Sp.PD</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              WebRTC Encrpyted HD Video
            </span>
          </div>

          {/* Video Player Canvas */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-80 flex flex-col justify-center items-center">
            {isInCall ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-teal-950 text-center space-y-3 p-4">
                <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center font-bold text-teal-300 text-xl animate-pulse">
                  DPJP
                </div>
                <p className="font-bold text-slate-100 text-sm">dr. Ahmad Pratama, Sp.PD sedang berbicara...</p>
                <span className="text-xs text-teal-400 font-mono">Durasi: 08:42</span>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <Video className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Kamera & Mikrofon Siap Terhubung</p>
                <button
                  onClick={() => setIsInCall(true)}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20"
                >
                  Mulai Video Call Dokter
                </button>
              </div>
            )}
          </div>

          {isInCall && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setIsInCall(false)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Akhiri Sesi Konsultasi
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Tele-Prescribing & WhatsApp Notification */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">Tele-Farmasi & Delivery</h3>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">Status Pengiriman Kurir Obat:</span>
            <p className="text-emerald-400 font-mono font-semibold">Resep Terisi & Kurir GrabExpress / GoSend En Route</p>
            <p className="text-[11px] text-slate-400">Alamat: {activePatient?.address}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block">WhatsApp Gateway Reminder:</span>
            <p className="text-slate-300">"Halo Budi Santoso, pengingat jadwal minum obat Amlodipine 10mg pukul 08:00 WIB."</p>
            <span className="text-[10px] text-teal-400 block font-mono">WhatsApp Official API Sent ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
