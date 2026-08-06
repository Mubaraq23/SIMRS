'use client';

import React, { useState } from 'react';
import { Tv, Volume2, Play, SkipForward, Plus, X, Users, CheckCircle2, Clock, Activity } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

const SERVICES = [
  'Poliklinik Penyakit Dalam',
  'Poliklinik Jantung',
  'Poliklinik Anak',
  'Poliklinik Bedah',
  'Poliklinik Obgyn',
  'Poliklinik Saraf',
  'IGD / UGD',
  'Farmasi',
  'Laboratorium',
  'Radiologi',
  'Kasir',
];

export default function AntrianPage() {
  const { activeQueueNumber, queueList, callQueue } = useHospitalStore();
  const { showToast } = useToast();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioText, setAudioText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState(SERVICES[0]);
  const [newName, setNewName] = useState('');
  const [localQueue, setLocalQueue] = useState(queueList);

  const totalWaiting = localQueue.filter(q => q.status === 'WAITING').length;
  const totalDone = localQueue.filter(q => q.status === 'DONE').length;
  const totalCalling = localQueue.filter(q => q.status === 'CALLING').length;

  const speakQueue = (num: string, destination: string) => {
    const text = `Nomor antrean ${num}, silakan menuju ke ${destination}`;
    setAudioText(text);
    setIsPlayingAudio(true);
    callQueue(num);
    setLocalQueue(prev => prev.map(q => q.number === num ? { ...q, status: 'CALLING' as const } : q));
    showToast({ type: 'info', title: 'Memanggil Antrean', message: text });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const markDone = (num: string) => {
    setLocalQueue(prev => prev.map(q => q.number === num ? { ...q, status: 'DONE' as const } : q));
    showToast({ type: 'success', title: 'Selesai Dilayani', message: `Nomor ${num} telah selesai dilayani.` });
  };

  const handleAddQueue = (e: React.FormEvent) => {
    e.preventDefault();
    const prefix = newService.includes('Jantung') ? 'B' : newService.includes('Farmasi') ? 'F' : newService.includes('Lab') ? 'L' : 'A';
    const nextNum = `${prefix}-${String(localQueue.filter(q => q.number.startsWith(prefix)).length + 1).padStart(3, '0')}`;
    setLocalQueue(prev => [...prev, { number: nextNum, service: newService, status: 'WAITING' }]);
    setShowModal(false);
    showToast({ type: 'success', title: `Nomor Antrean ${nextNum}`, message: `Pasien ${newName || 'baru'} terdaftar di ${newService}.` });
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Tv className="w-5 h-5 text-blue-400" /> Antrean Display TV & Audio Voice Caller Engine
          </h2>
          <p className="text-xs text-slate-400">Panggilan antrean pasien otomatis terintegrasi dengan BPJS Antrean Online</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition"
        >
          <Plus className="w-4 h-4" /> + Tambah Nomor Antrean
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Antrean</span>
          <p className="text-2xl font-black font-mono text-blue-400">{localQueue.length}</p>
          <span className="text-[10px] text-slate-400">Semua poli & layanan</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-amber-400 uppercase font-bold tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Menunggu</span>
          <p className="text-2xl font-black font-mono text-amber-400">{totalWaiting}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Pasien dalam antrian</span>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-blue-400 uppercase font-bold tracking-wider flex items-center gap-1"><Activity className="w-3 h-3" /> Dipanggil</span>
          <p className="text-2xl font-black font-mono text-blue-400">{totalCalling}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</span>
          <p className="text-2xl font-black font-mono text-emerald-400">{totalDone}</p>
        </div>
      </div>

      {/* Main Queue Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Called Queue Card */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30 font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>PANGGILAN AKTIF SEKARANG</span>
          </div>

          <div className="py-8 space-y-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block">NOMOR ANTREAN</span>
            <div className="text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 font-mono tracking-tight drop-shadow-2xl">
              {activeQueueNumber}
            </div>
            <div className="inline-block bg-slate-950/90 border border-slate-800 px-6 py-2.5 rounded-2xl">
              <p className="text-sm font-extrabold text-slate-100">POLIKLINIK PENYAKIT DALAM – LOKET 01</p>
            </div>
          </div>

          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200">Voice Synthesizer Caller</p>
                <p className="text-[11px] text-blue-400 font-mono italic">{audioText || 'Siap memanggil nomor antrian...'}</p>
              </div>
            </div>
            <button
              onClick={() => speakQueue(activeQueueNumber, 'Poliklinik Penyakit Dalam')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" /> Panggil Ulang Voice
            </button>
          </div>
        </div>

        {/* Queue List */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-3 flex flex-col">
          <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
            Daftar Antrean ({localQueue.length})
          </h3>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-80 pr-1">
            {localQueue.map((item, idx) => (
              <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                item.status === 'CALLING' ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold shadow-lg'
                : item.status === 'DONE' ? 'bg-slate-950 border-slate-800/80 text-slate-500 opacity-50'
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-blue-400">{item.number}</span>
                  <div>
                    <p className="font-bold text-slate-100 text-[10px]">{item.service}</p>
                    <span className="text-[9px] opacity-70">{item.status}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {item.status === 'WAITING' && (
                    <button onClick={() => speakQueue(item.number, item.service)}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition">
                      <SkipForward className="w-3 h-3" />
                    </button>
                  )}
                  {item.status === 'CALLING' && (
                    <button onClick={() => markDone(item.number)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition">
                      ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 text-center font-medium">
            Terhubung dengan <span className="text-blue-400 font-bold">BPJS Antrean Online Webhook</span>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Antrean */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-sm rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" /> Daftarkan Antrean Baru
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddQueue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Nama Pasien</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nama pasien (opsional)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Tujuan Layanan *</label>
                <select value={newService} onChange={(e) => setNewService(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100">
                  {SERVICES.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition">Batal</button>
                <button type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition">
                  Cetak Nomor Antrean
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
