'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BrainCircuit,
  Users,
  Calendar,
  Stethoscope,
  TestTube,
  ImageIcon,
  Pill,
  CreditCard,
  Activity,
  TrendingUp,
  AlertTriangle,
  Building2,
  X,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from './ToastProvider';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { patients, setActivePatient } = useHospitalStore();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled externally or by global listener
          window.dispatchEvent(new CustomEvent('toggle-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modules = [
    { name: 'AI Command Center', path: '/', category: 'Executive', icon: BrainCircuit },
    { name: 'Pendaftaran & Kiosk Pasien', path: '/pendaftaran', category: 'Pelayanan', icon: Users },
    { name: 'Antrean Display & Caller TV', path: '/antrian', category: 'Pelayanan', icon: Calendar },
    { name: 'EMR / RME & CPPT Multidisiplin', path: '/emr', category: 'Pelayanan', icon: Stethoscope },
    { name: 'Laboratorium LIS & Panic Value', path: '/laboratorium', category: 'Penunjang', icon: TestTube },
    { name: 'Radiologi PACS DICOM Viewer', path: '/radiologi', category: 'Penunjang', icon: ImageIcon },
    { name: 'Farmasi & FEFO Stock', path: '/farmasi', category: 'Penunjang', icon: Pill },
    { name: 'Kasir & Billing Aggregator', path: '/kasir-billing', category: 'Keuangan', icon: CreditCard },
    { name: 'SATUSEHAT FHIR R4 Bridge', path: '/satusehat', category: 'Integrasi', icon: Activity },
    { name: 'BPJS VClaim & INACBG', path: '/bpjs', category: 'Integrasi', icon: TrendingUp },
    { name: 'SDM & STR/SIP Monitor', path: '/sdm', category: 'Manajemen', icon: Building2 },
  ];

  const filteredModules = modules.filter(
    (m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.toLowerCase().includes(query.toLowerCase()) ||
      p.nik.includes(query)
  );

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
    setQuery('');
  };

  const handleSelectPatient = (p: any) => {
    setActivePatient(p);
    router.push('/emr');
    onClose();
    showToast({
      type: 'info',
      title: 'Pasien Terpilih',
      message: `Membuka Rekam Medis Elektronik untuk ${p.name} (${p.mrn})`
    });
  };

  const triggerEmergencyAlert = () => {
    showToast({
      type: 'error',
      title: '🚨 EMERGENCY CODE RED ACTIVATED!',
      message: 'Notifikasi darurat telah dikirim ke Tim Resusitasi & IGD!'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari modul, fitur, nama pasien, NIK, atau No. RM... (Ctrl+K)"
            className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder-slate-400 font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Lists */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Patients Result if searching */}
          {query.trim().length > 0 && filteredPatients.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pasien Terdaftar ({filteredPatients.length})
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className="w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/40 flex items-center justify-between transition group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-100 group-hover:text-blue-300">{p.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        RM: {p.mrn} | NIK: {p.nik} | Gol: {p.bloodType}
                      </p>
                    </div>
                    <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                      Buka EMR <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigasi Modul */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pintas Modul SIMRS Enterprise
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredModules.map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.path}
                    onClick={() => handleNavigate(mod.path)}
                    className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-left flex items-center gap-3 transition group"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white">{mod.name}</p>
                      <span className="text-[10px] text-slate-400">{mod.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action: Emergency Code Red */}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={triggerEmergencyAlert}
              className="w-full p-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 flex items-center justify-between text-xs font-bold transition"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                <span>AKTIFKAN ALERT EMERGENCY CODE RED (IGD / ICU)</span>
              </div>
              <span className="bg-rose-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-extrabold uppercase">
                Trigger Now
              </span>
            </button>
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Gunakan panah untuk navigasi, Enter untuk pilih</span>
          <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">ESC untuk tutup</span>
        </div>
      </div>
    </div>
  );
}
