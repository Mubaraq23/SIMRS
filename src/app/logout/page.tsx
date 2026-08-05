'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Activity, CheckCircle2 } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-panel max-w-md w-full rounded-3xl border border-slate-800 p-8 text-center space-y-6 shadow-2xl animate-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
          <LogOut className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-100">Proses Keluar Sistem SIMRS</h2>
          <p className="text-xs text-slate-400">
            Sesi pengguna Anda telah ditutup secara aman. Mengalihkan Anda kembali ke halaman Login...
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-2.5 px-4 rounded-2xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" /> Log Sesi Terenkripsi & Disimpan
        </div>

        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
