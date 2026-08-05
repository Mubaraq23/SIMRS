'use client';

import React from 'react';
import { GitBranch, CheckCircle2, AlertTriangle, FileText, BookOpen } from 'lucide-react';

export default function ClinicalPathwayPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-teal-400" /> Clinical Pathway Management & Audit Variansi
          </h2>
          <p className="text-xs text-slate-400">Standar Pelayanan Kedokteran (SPK), Evaluasi Kepatuhan DPJP & Variansi Clinical Pathway</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pathway List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Checklist Clinical Pathway Aktif: Hipertensi Esensial & STEMI</span>
            <span className="text-xs text-teal-400 font-mono">Kepatuhan 94.2%</span>
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { day: 'Hari Ke-1 (IGD & Admisi)', items: ['Pemeriksaan EKG 12 Lead', 'TTV & NEWS 2 Score', 'Trofomin I / CK-MB Test', 'Aspirin 300 mg Loading Dose'], status: 'PASSED' },
              { day: 'Hari Ke-2 (Rawat Inap ICU)', items: ['Echocardiography Bedside', 'Evolusi Enzim Jantung', 'Edukasi Diet Rendah Garam & Kolesterol'], status: 'PASSED' },
              { day: 'Hari Ke-3 (Persiapan Discharge)', items: ['Resep Obat Pulang (Statine + ACE Inhibitor)', 'Surat Kontrol Poliklinik V-Claim'], status: 'IN_PROGRESS' }
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between font-bold text-slate-100">
                  <span>{step.day}</span>
                  <span className="text-teal-400 font-mono">{step.status}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  {step.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EBM Library */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-400" /> Perpustakaan EBM (Evidence Based)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">Panduan Praktik Klinis (PPK) Kardiologi</span>
              <p className="text-[11px] text-slate-400">PERKI Guidelines 2024: Penatalaksanaan Sindrom Koroner Akut</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">Pedoman Nasional Pelayanan Kedokteran (PNPK)</span>
              <p className="text-[11px] text-slate-400">Kepmenkes RI: Tata Laksana Hipertensi Pada Dewasa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
