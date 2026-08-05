'use client';

import React, { useState } from 'react';
import { GitBranch, CheckCircle2, AlertTriangle, BookOpen, Plus, X, TrendingUp, Clock, Activity } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

type PathwayItem = { id: string; label: string; checked: boolean; isVariance: boolean };
type PathwayDay = { day: string; items: PathwayItem[]; status: 'PASSED' | 'IN_PROGRESS' | 'PENDING' };

const INITIAL_PATHWAY: PathwayDay[] = [
  {
    day: 'Hari Ke-1 (IGD & Admisi)',
    status: 'PASSED',
    items: [
      { id: 'p1-1', label: 'Pemeriksaan EKG 12 Lead', checked: true, isVariance: false },
      { id: 'p1-2', label: 'TTV & NEWS 2 Score Assessment', checked: true, isVariance: false },
      { id: 'p1-3', label: 'Troponin I / CK-MB Test STAT', checked: true, isVariance: false },
      { id: 'p1-4', label: 'Aspirin 300 mg Loading Dose', checked: false, isVariance: true },
    ]
  },
  {
    day: 'Hari Ke-2 (Rawat Inap ICU)',
    status: 'IN_PROGRESS',
    items: [
      { id: 'p2-1', label: 'Echocardiography Bedside', checked: true, isVariance: false },
      { id: 'p2-2', label: 'Evolusi Enzim Jantung Serial', checked: true, isVariance: false },
      { id: 'p2-3', label: 'Edukasi Diet Rendah Garam & Kolesterol', checked: false, isVariance: false },
      { id: 'p2-4', label: 'Mobilisasi Bertahap (ROM Pasif)', checked: false, isVariance: false },
    ]
  },
  {
    day: 'Hari Ke-3 (Persiapan Discharge)',
    status: 'PENDING',
    items: [
      { id: 'p3-1', label: 'Resep Obat Pulang (Statin + ACE Inhibitor)', checked: false, isVariance: false },
      { id: 'p3-2', label: 'Surat Kontrol Poliklinik V-Claim BPJS', checked: false, isVariance: false },
      { id: 'p3-3', label: 'Resume Medis & Ringkasan Perawatan', checked: false, isVariance: false },
    ]
  }
];

const PATHWAYS_LIBRARY = [
  { name: 'STEMI (ST-Elevation Myocardial Infarction)', icd: 'I21', days: 5, compliance: 94.2 },
  { name: 'Hipertensi Esensial', icd: 'I10', days: 3, compliance: 97.8 },
  { name: 'Diabetes Mellitus Tipe 2 dengan Komplikasi', icd: 'E11', days: 4, compliance: 91.5 },
  { name: 'Community Acquired Pneumonia (CAP)', icd: 'J18.1', days: 5, compliance: 89.3 },
  { name: 'Appendisitis Akut Post-Op Laparoskopi', icd: 'K35.8', days: 3, compliance: 98.1 },
];

export default function ClinicalPathwayPage() {
  const { activePatient, addBillingItemToPatient } = useHospitalStore();
  const { showToast } = useToast();
  const [pathway, setPathway] = useState<PathwayDay[]>(INITIAL_PATHWAY);
  const [showModal, setShowModal] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState('STEMI (ST-Elevation Myocardial Infarction)');
  const [dpjp, setDpjp] = useState('dr. Ahmad Pratama, Sp.PD');

  const totalItems = pathway.flatMap(d => d.items).length;
  const checkedItems = pathway.flatMap(d => d.items).filter(i => i.checked).length;
  const varianceItems = pathway.flatMap(d => d.items).filter(i => i.isVariance).length;
  const compliance = Math.round((checkedItems / totalItems) * 100);

  const toggleItem = (dayIdx: number, itemId: string) => {
    setPathway(prev => prev.map((day, dIdx) =>
      dIdx !== dayIdx ? day : {
        ...day,
        items: day.items.map(item =>
          item.id !== itemId ? item : { ...item, checked: !item.checked }
        )
      }
    ));
    showToast({ type: 'success', title: 'Checklist Diperbarui', message: 'Status item clinical pathway tersimpan.' });
  };

  const handleCreatePathway = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePatient) {
      addBillingItemToPatient(activePatient.mrn, {
        description: `Clinical Pathway: ${selectedPathway} (DPJP: ${dpjp})`,
        category: 'Clinical Pathway',
        amount: 250000
      });
    }
    setShowModal(false);
    showToast({ type: 'success', title: 'Clinical Pathway Dibuat', message: `Pathway ${selectedPathway} berhasil diaktifkan untuk ${activePatient?.name}.` });
  };

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
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
        >
          <Plus className="w-4 h-4" /> + Aktifkan Clinical Pathway
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Kepatuhan Pathway</span>
          <p className={`text-2xl font-black font-mono ${compliance >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{compliance}%</p>
          <span className="text-[10px] text-slate-400">{checkedItems}/{totalItems} item selesai</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Variansi Terdeteksi</span>
          <p className={`text-2xl font-black font-mono ${varianceItems > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{varianceItems} Item</p>
          <span className="text-[10px] text-amber-400">{varianceItems > 0 ? 'Perlu tindak lanjut DPJP' : 'No variance'}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Pasien Aktif</span>
          <p className="text-2xl font-black font-mono text-blue-400">{activePatient?.name?.split(' ')[0]}</p>
          <span className="text-[10px] text-slate-400">{activePatient?.mrn}</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Hari Rawat</span>
          <p className="text-2xl font-black font-mono text-teal-400">Hari 2</p>
          <span className="text-[10px] text-slate-400">Target discharge: Hari 3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Pathway Checklist */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Checklist Clinical Pathway: STEMI – {activePatient?.name}</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${compliance >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              Kepatuhan {compliance}%
            </span>
          </h3>

          <div className="space-y-4">
            {pathway.map((day, dIdx) => (
              <div key={dIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-xs">{day.day}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    day.status === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' :
                    day.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {day.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {day.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(dIdx, item.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition hover:scale-[1.01] ${
                        item.checked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : item.isVariance
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${item.checked ? 'text-emerald-400' : item.isVariance ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                      {item.isVariance && !item.checked && (
                        <span className="ml-auto text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">VARIANSI</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {varianceItems > 0 && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">Variansi Terdeteksi – Perlu Tindak Lanjut DPJP</p>
                <p className="text-amber-400/80 text-[11px]">{varianceItems} item belum selesai melebihi jadwal pathway. Harap dokumentasikan alasan medis (justifikasi variansi) di CPPT.</p>
              </div>
            </div>
          )}
        </div>

        {/* EBM Library & Pathway Registry */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" /> Daftar Pathway Tersedia
            </h3>
            {PATHWAYS_LIBRARY.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <p className="font-bold text-slate-100">{p.name}</p>
                <div className="flex justify-between text-slate-400">
                  <span>ICD-10: <span className="text-teal-400 font-mono">{p.icd}</span></span>
                  <span>{p.days} Hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${p.compliance}%` }} />
                  </div>
                  <span className="text-teal-400 font-mono text-[10px]">{p.compliance}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">📖 Referensi EBM</h3>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">PPK Kardiologi – PERKI 2024</span>
              <p className="text-[11px] text-slate-400">Penatalaksanaan Sindrom Koroner Akut & STEMI</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">PNPK Kemenkes RI</span>
              <p className="text-[11px] text-slate-400">Tata Laksana Hipertensi Pada Dewasa (2024)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">ESC Guidelines 2023</span>
              <p className="text-[11px] text-slate-400">Management of Acute Coronary Syndromes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Aktifkan Clinical Pathway */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-400" /> Aktifkan Clinical Pathway Baru
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePathway} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Pasien (Aktif)</label>
                <input readOnly value={`${activePatient?.name} – ${activePatient?.mrn}`}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-slate-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Pilih Clinical Pathway *</label>
                <select value={selectedPathway} onChange={(e) => setSelectedPathway(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100">
                  {PATHWAYS_LIBRARY.map((p, i) => <option key={i} value={p.name}>{p.name} ({p.icd})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">DPJP Penanggung Jawab *</label>
                <input value={dpjp} onChange={(e) => setDpjp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition">Batal</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition">
                  Aktifkan Pathway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
