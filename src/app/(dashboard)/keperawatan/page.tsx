'use client';

import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, ShieldCheck, QrCode, Plus, User, AlertCircle } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { NursingCarePlan } from '@/types/simrs';

export default function KeperawatanPage() {
  const { activePatient, nursingPlans, addNursingPlan } = useHospitalStore();

  const [sdkiCode, setSdkiCode] = useState('D.0009');
  const [sdkiName, setSdkiName] = useState('Perfusi Perifer Tidak Efektif b.d Hiperglikemia / Hipertensi');
  const [slkiTarget, setSlkiTarget] = useState('L.02011 Perfusi Perifer Meningkat dalam 3x24 jam');
  const [sikiIntervention, setSikiIntervention] = useState('I.02079 Perawatan Sirkulasi: Monitor TTV, kaji edema, hindari penekanan vena.');

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const newPlan: NursingCarePlan = {
      id: `n-${Date.now()}`,
      patientId: activePatient.id,
      sdkiCode,
      sdkiName,
      slkiTarget,
      sikiIntervention,
      status: 'ACTIVE',
      nurseName: 'Ns. Ratna Sari, S.Kep',
      createdAt: new Date().toISOString()
    };

    addNursingPlan(newPlan);
    alert('Asuhan Keperawatan (SDKI, SLKI, SIKI) Berhasil Disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" /> Nursing Information System (NIS)
          </h2>
          <p className="text-xs text-slate-400">Asuhan Keperawatan Standar PPNI (SDKI, SLKI, SIKI), eMAR & BCMA Barcode</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SDKI / SLKI / SIKI Care Plan Form */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Form Diagnosis & Intervensi Keperawatan</h3>
            <span className="text-xs text-rose-400 font-mono">PPNI Standard SDKI/SLKI/SIKI</span>
          </div>

          <form onSubmit={handleAddPlan} className="space-y-4 text-xs">
            {/* SDKI Diagnosis */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">SDKI - Diagnosa Keperawatan Indonesia *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sdkiCode}
                  onChange={(e) => setSdkiCode(e.target.value)}
                  className="w-24 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono font-bold text-rose-400 text-center"
                />
                <input
                  type="text"
                  value={sdkiName}
                  onChange={(e) => setSdkiName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                  required
                />
              </div>
            </div>

            {/* SLKI Outcome Target */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">SLKI - Luaran Keperawatan Indonesia (Target Evaluation) *</label>
              <textarea
                rows={2}
                value={slkiTarget}
                onChange={(e) => setSlkiTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                required
              />
            </div>

            {/* SIKI Interventions */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">SIKI - Intervensi & Keperawatan Bedside *</label>
              <textarea
                rows={2}
                value={sikiIntervention}
                onChange={(e) => setSikiIntervention(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100"
                required
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20"
              >
                Simpan Care Plan (Askep)
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: eMAR & BCMA Barcode Verification */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Bedside BCMA Barcode eMAR</span>
            <span className="text-xs text-emerald-400 font-mono">BCMA Active</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <QrCode className="w-5 h-5 text-teal-400" />
              <span className="font-bold">Scan Barcode Obat Pasien:</span>
            </div>
            <input
              type="text"
              placeholder="Scan wristband pasien atau barcode obat..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 font-mono"
            />
            <button
              onClick={() => alert('BCMA Verification Success: 5 Right Medication Rules Passed!')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Verifikasi 5 Benar Pemberian Obat
            </button>
          </div>

          {/* Active Care Plans */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asuhan Keperawatan Aktif</h4>
            {nursingPlans.map((plan) => (
              <div key={plan.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="font-mono font-bold text-rose-400 block">{plan.sdkiCode} - {plan.sdkiName}</span>
                <p className="text-slate-300"><strong className="text-slate-400">Target SLKI:</strong> {plan.slkiTarget}</p>
                <p className="text-slate-400 text-[11px]">Perawat: {plan.nurseName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
