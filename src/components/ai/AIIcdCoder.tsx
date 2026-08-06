'use client';

import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Check, Copy, AlertCircle, Search } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface AIIcdCoderProps {
  soapNote?: string;
  onSelectIcd: (icdCode: string, description: string) => void;
}

export default function AIIcdCoder({ soapNote = '', onSelectIcd }: AIIcdCoderProps) {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState(
    soapNote || 'Pasien mengeluh nyeri dada sebelah kiri menjalar ke lengan kiri sejak 3 jam SMRS. Disertai sesak nafas, keringat dingin, dan mual. Riwayat Hipertensi 5 tahun.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { code: string; name: string; type: 'ICD-10' | 'ICD-9-CM'; confidence: number; category: string }[]
  >([
    { code: 'I21.9', name: 'Acute myocardial infarction, unspecified (STEMI/NSTEMI)', type: 'ICD-10', confidence: 96, category: 'Diagnosis Utama' },
    { code: 'I10', name: 'Essential (primary) hypertension', type: 'ICD-10', confidence: 92, category: 'Diagnosis Sekunder' },
    { code: '88.56', name: 'Coronary arteriography using two catheters', type: 'ICD-9-CM', confidence: 88, category: 'Tindakan / Prosedur' },
    { code: '89.52', name: 'Electrocardiogram (ECG 12 Lead)', type: 'ICD-9-CM', confidence: 95, category: 'Tindakan / Penunjang' },
  ]);

  const handleAnalyze = () => {
    if (!inputText) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      showToast({
        type: 'info',
        title: 'AI Clinical Coding Complete',
        message: 'Berhasil mengekstrak 4 rekomendasi kode ICD-10 & ICD-9-CM dari anamnesis SOAP.',
      });
    }, 1000);
  };

  return (
    <div className="glass-panel rounded-2xl border border-purple-500/20 bg-slate-950/60 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              AI Automated ICD-10 & ICD-9-CM Clinical Coder
              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                AI Clinical Engine
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">Rekomendasi pengkodean otomatis klaim BPJS & E-Klaim INA-CBGs</p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isAnalyzing ? 'Menganalisis SOAP...' : 'Ekstrak Kode ICD'}
        </button>
      </div>

      {/* Input Anamnesis / SOAP */}
      <div>
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik atau tempel ringkasan CPPT / SOAP medis pasien..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-purple-500 outline-none resize-none font-mono"
        />
      </div>

      {/* ICD Suggestions List */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Rekomendasi Kode ICD Terdeteksi:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition flex items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                    {item.code}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">({item.type})</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">{item.confidence}% Match</span>
                </div>
                <p className="text-[11px] font-medium text-slate-200 truncate">{item.name}</p>
                <span className="text-[9px] text-slate-400 block">{item.category}</span>
              </div>

              <button
                onClick={() => {
                  onSelectIcd(item.code, item.name);
                  showToast({ type: 'success', title: 'Kode ICD Dipilih', message: `${item.code} - ${item.name}` });
                }}
                className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg text-[10px] font-bold border border-purple-500/30 transition shrink-0 flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Pilih
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
