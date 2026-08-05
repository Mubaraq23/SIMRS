'use client';

import React from 'react';
import { Droplet, Utensils, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function PenunjangLainPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-400" /> Bank Darah (BDRS) & Gizi Klinik
          </h2>
          <p className="text-xs text-slate-400">Manajemen Kantong Darah (ABO/Rh), Crossmatching, Asesmen Gizi & Kitchen Meal Schedule</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Blood Bank Stock Matrix */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Stok Kantong Darah (BDRS)</span>
            <span className="text-xs text-rose-400 font-mono">UTD PMI Ready</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { type: 'A+', stock: 24, status: 'Cukup' },
              { type: 'B+', stock: 18, status: 'Cukup' },
              { type: 'AB+', stock: 6, status: 'Kritis' },
              { type: 'O+', stock: 42, status: 'Melimpah' }
            ].map((blood, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-lg font-black font-mono text-rose-400 block">{blood.type}</span>
                <span className="text-xs font-bold text-slate-100 block">{blood.stock} Kantong</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {blood.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-rose-300">Form Permintaan Crossmatch Blood Test:</p>
            <p className="text-[11px] text-slate-400">Order ID: BDRS-20260805-01 (Pasien Budi Santoso - 2 Kantong Packed Red Cell PRC O+)</p>
          </div>
        </div>

        {/* Right: Nutrition & Dietary Kitchen Schedule */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" /> Distribusi Gizi & Diet Pasien
            </span>
            <span className="text-xs text-emerald-400 font-mono">Kitchen Schedule</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-100">
                <span>Mawar 101 - Bed A (Budi Santoso)</span>
                <span className="text-emerald-400">Diet Rendah Garam (RG I)</span>
              </div>
              <p className="text-[11px] text-slate-400">Asesmen Gizi: Kebutuhan Kalori 1800 kcal, Protein 65g. Makanan Lunak Bubur Nasi.</p>
              <span className="text-[10px] text-emerald-400 font-semibold block">Status: Porsi Siang Terdistribusi ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
