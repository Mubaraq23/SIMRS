'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  UserCheck,
  Bell,
  Wifi,
  Download,
  Moon,
  Sun,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronRight,
  User,
  Sparkles,
  Command,
  LogOut
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { UserRole } from '@/types/simrs';
import { useToast } from '../ui/ToastProvider';
import KemenkesReportModal from '../reports/KemenkesReportModal';

export default function TopHeader() {
  const pathname = usePathname();
  const { activeBranch, branches, setBranch, activeRole, setRole, themeMode, toggleTheme } = useHospitalStore();
  const { showToast } = useToast();
  const [timeString, setTimeString] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    setTimeString(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (themeMode === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [themeMode]);

  const rolesList: UserRole[] = [
    'DIREKTUR',
    'DOKTER',
    'PERAWAT',
    'APOTEKER',
    'PETUGAS_LAB',
    'RADIOGRAFER',
    'KASIR',
    'PETUGAS_PENDAFTARAN',
    'PETUGAS_IPSRS'
  ];

  const getBreadcrumbs = () => {
    if (pathname === '/') return ['Executive Command Center', 'Dashboard Utama'];
    const parts = pathname.split('/').filter(Boolean);
    const formatted = parts.map((p) =>
      p
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
    return ['SIMRS Enterprise', ...formatted];
  };

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('toggle-command-palette'));
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-2xl border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-md transition-colors">
      {/* Left: Breadcrumb & Search Command Bar */}
      <div className="flex items-center gap-4">
        {/* Breadcrumb Trail */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400">
          {getBreadcrumbs().map((crumb, idx, arr) => (
            <React.Fragment key={idx}>
              <span className={idx === arr.length - 1 ? 'text-blue-400 font-bold' : ''}>{crumb}</span>
              {idx < arr.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
            </React.Fragment>
          ))}
        </div>

        {/* Global Search Bar Button */}
        <button
          onClick={handleOpenCommandPalette}
          className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition shadow-inner"
        >
          <Search className="w-4 h-4 text-blue-500" />
          <span className="hidden sm:inline font-medium">Cari fitur, pasien, NIK, RM...</span>
          <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
            <Command className="w-3 h-3" /> K
          </span>
        </button>
      </div>

      {/* Right Controls: Branch, Role, Connectivity, Dark Mode, Notifications */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Branch Selector */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200">
          <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
          <select
            value={activeBranch.id}
            onChange={(e) => {
              const b = branches.find((item) => item.id === e.target.value);
              if (b) {
                setBranch(b);
                showToast({ type: 'info', title: 'Cabang Berubah', message: `Aktif: ${b.name}` });
              }
            }}
            className="bg-transparent outline-none font-semibold cursor-pointer text-slate-100 max-w-[150px] truncate"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={activeRole}
            onChange={(e) => {
              const newRole = e.target.value as UserRole;
              setRole(newRole);
              showToast({ type: 'success', title: 'Role Pengguna', message: `Beralih ke hak akses: ${newRole}` });
            }}
            className="bg-transparent outline-none font-bold cursor-pointer text-emerald-400 font-mono"
          >
            {rolesList.map((r) => (
              <option key={r} value={r} className="bg-slate-900 text-slate-200">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* SATUSEHAT Connectivity Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Wifi className="w-3.5 h-3.5" />
          <span className="text-[11px]">SATUSEHAT Live</span>
        </div>

        {/* Laporan Kemenkes RL Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Laporan RL SIRS</span>
        </button>

        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition"
          title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 relative transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-extrabold text-slate-100">Notifikasi Real-Time</h4>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
                  3 Baru
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-300">Nilai Kritis Lab (Panic Value)</p>
                    <p className="text-[11px] text-slate-300">Leukosit 11.8 /uL - Pasien Budi Santoso</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-300">Peringatan Expired SIP Dokter</p>
                    <p className="text-[11px] text-slate-300">SIP dr. Ahmad Pratama &lt; 30 hari lagi</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-300">SATUSEHAT Sync Berhasil</p>
                    <p className="text-[11px] text-slate-300">Encounter ENC-887123 tersinkronisasi</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md border border-white/10 transition"
            title="Profil & Logout"
          >
            <User className="w-4 h-4" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 space-y-2 z-50 animate-in fade-in duration-150 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-slate-100">Petugas Active SIMRS</p>
                <p className="text-[11px] text-blue-400 font-mono font-bold mt-0.5">Role: {activeRole}</p>
                <p className="text-[10px] text-slate-400">{activeBranch.name}</p>
              </div>

              <div className="pt-1 border-t border-slate-800">
                <Link
                  href="/login"
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-bold transition"
                  onClick={() => setShowUserMenu(false)}
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Keluar / Logout Sistem</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <KemenkesReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
    </header>
  );
}
