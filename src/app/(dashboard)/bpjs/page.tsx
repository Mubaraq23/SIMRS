'use client';

import React, { useState } from 'react';
import { TrendingUp, FileText, CheckCircle2, Search, DollarSign, Calculator, ShieldCheck } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { calculateInacbg, InacbgResult } from '@/lib/bpjs/inacbg-calculator';
import { useToast } from '@/components/ui/ToastProvider';

export default function BpjsPage() {
  const { activePatient } = useHospitalStore();
  const { showToast } = useToast();

  const [sepNumber, setSepNumber] = useState('1101R0010826V000142');
  const [primaryIcd10, setPrimaryIcd10] = useState('I10');
  const [procedureIcd9, setProcedureIcd9] = useState('88.72');
  const [classType, setClassType] = useState<'VIP' | 'KELAS_1' | 'KELAS_2' | 'KELAS_3'>('KELAS_1');
  const [inacbgResult, setInacbgResult] = useState<InacbgResult | null>(null);

  const handleCalculateInacbg = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculateInacbg({
      primaryIcd10,
      procedureIcd9,
      classType,
      age: 42,
      gender: 'MALE'
    });
    setInacbgResult(result);
    showToast({
      type: 'success',
      title: 'Grouping INACBG Selesai',
      message: `Kode CBG ${result.code} - Estimasi Tarif: Rp ${result.estimatedTariff.toLocaleString('id-ID')}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top BPJS KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Klaim BPJS Klaim Active</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">Rp 328.0M</p>
          <span className="text-[10px] text-emerald-400">Verifikasi FPK Terpenuhi</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Terbit SEP VClaim Today</span>
          <p className="text-2xl font-black text-blue-400 font-mono">92 SEP</p>
          <span className="text-[10px] text-blue-400 font-semibold">VClaim API v2.0 Live</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rasio Pending Klaim</span>
          <p className="text-2xl font-black text-indigo-400 font-mono">0.4% Low</p>
          <span className="text-[10px] text-indigo-400 font-semibold">Minimalisasi Dispute Klaim</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Antrean Online</span>
          <p className="text-2xl font-black text-purple-400 font-mono">CONNECTED</p>
          <span className="text-[10px] text-purple-400 font-semibold">Bridging BPJS Antrean</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: SEP VClaim Generator */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Surat Eligibilitas Peserta (SEP BPJS VClaim)
            </h3>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              VClaim v2.0
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold block">No. Kartu BPJS Peserta:</span>
              <p className="font-mono font-black text-emerald-400 text-base">{activePatient?.bpjsCardNo || '0001234567890'}</p>
              <p className="text-slate-100 font-bold mt-1">{activePatient?.name}</p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Nomor SEP Diterbitkan *</label>
              <input
                type="text"
                value={sepNumber}
                onChange={(e) => setSepNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono font-bold text-emerald-400 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => showToast({ type: 'success', title: 'SEP Diterbitkan', message: `SEP BPJS ${sepNumber} berhasil dicetak!` })}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition hover:scale-105"
            >
              Cetak SEP BPJS (VClaim API)
            </button>
          </div>
        </div>

        {/* Right Col: INACBG Grouping Calculator */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-400" /> Calculator Grouping INACBG 5.x
            </h3>
            <span className="text-xs text-slate-400 font-mono">Tarif RS Kelas A</span>
          </div>

          <form onSubmit={handleCalculateInacbg} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Kode ICD-10 Utama</label>
                <input
                  type="text"
                  value={primaryIcd10}
                  onChange={(e) => setPrimaryIcd10(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-blue-400 font-bold outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">ICD-9-CM Prosedur</label>
                <input
                  type="text"
                  value={procedureIcd9}
                  onChange={(e) => setProcedureIcd9(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Hak Kelas Rawat BPJS</label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-slate-100 outline-none cursor-pointer"
              >
                <option value="VIP">Kelas VIP (Naik Kelas)</option>
                <option value="KELAS_1">Kelas 1</option>
                <option value="KELAS_2">Kelas 2</option>
                <option value="KELAS_3">Kelas 3</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              Hitung Grouping INACBG
            </button>
          </form>

          {inacbgResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-mono font-bold text-blue-400">
                <span>Kode CBG: {inacbgResult.code}</span>
                <span>Tingkat Keparahan: {inacbgResult.severityLevel}</span>
              </div>
              <p className="font-bold text-slate-200">{inacbgResult.description}</p>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-slate-400 font-bold">Tarif Paket INACBG:</span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  Rp {inacbgResult.estimatedTariff.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
