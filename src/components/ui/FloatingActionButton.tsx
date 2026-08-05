'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Search, UserPlus, Pill, ShieldAlert, Zap } from 'lucide-react';
import { useToast } from './ToastProvider';

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleCommandPalette = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  };

  const handleQuickPatient = () => {
    setOpen(false);
    router.push('/pendaftaran');
  };

  const handleQuickPharmacy = () => {
    setOpen(false);
    router.push('/farmasi');
  };

  const handleEmergencyAlert = () => {
    setOpen(false);
    showToast({
      type: 'error',
      title: '🚨 EMERGENCY ALERT DISPATCHED',
      message: 'Tim Medis Reaksi Cepat (TMRC) telah dinotifikasi!'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Sub Menu Buttons */}
      {open && (
        <div className="flex flex-col items-end gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <button
            onClick={handleEmergencyAlert}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition hover:scale-105"
          >
            <span>Emergency Code Red</span>
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </button>

          <button
            onClick={handleQuickPharmacy}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 shadow-lg transition hover:scale-105"
          >
            <span>Resep & Obat</span>
            <Pill className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={handleQuickPatient}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 shadow-lg transition hover:scale-105"
          >
            <span>Daftar Pasien Baru</span>
            <UserPlus className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={handleCommandPalette}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 shadow-lg transition hover:scale-105"
          >
            <span>Command Palette (Ctrl+K)</span>
            <Search className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      )}

      {/* Main Trigger FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40 ring-4 ring-blue-500/20 transition-all transform hover:scale-110 active:scale-95"
        title="Quick Actions FAB"
      >
        {open ? <X className="w-6 h-6" /> : <Zap className="w-6 h-6 fill-current" />}
      </button>
    </div>
  );
}
