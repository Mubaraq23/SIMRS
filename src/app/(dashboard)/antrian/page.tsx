'use client';

import React, { useState } from 'react';
import { Volume2, Play, SkipForward, Tv, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function AntrianPage() {
  const { activeQueueNumber, queueList, callQueue } = useHospitalStore();
  const { showToast } = useToast();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioText, setAudioText] = useState('');

  const speakQueue = (num: string, destination: string) => {
    const text = `Nomor antrean ${num}, silakan menuju ke ${destination}`;
    setAudioText(text);
    setIsPlayingAudio(true);
    callQueue(num);
    showToast({ type: 'info', title: 'Memanggil Antrean', message: text });

    // Browser Speech Synthesis
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Tv className="w-5 h-5 text-blue-400" /> Antrean Display TV & Audio Voice Caller Engine
          </h2>
          <p className="text-xs text-slate-400">Panggilan antrean pasien otomatis terintegrasi dengan BPJS Antrean Online</p>
        </div>
      </div>

      {/* Main Queue TV Display Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Called Queue Card */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30 font-extrabold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>PANGGILAN AKTIF SEKARANG</span>
          </div>

          <div className="py-8 space-y-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest block">NOMOR ANTREAN</span>
            <div className="text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 font-mono tracking-tight drop-shadow-2xl">
              {activeQueueNumber}
            </div>
            <div className="inline-block bg-slate-950/90 border border-slate-800 px-6 py-2.5 rounded-2xl">
              <p className="text-sm font-extrabold text-slate-100">POLIKLINIK PENYAKIT DALAM - LOKET 01</p>
            </div>
          </div>

          {/* Voice Synthesizer Audio Bar */}
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

        {/* Waiting List Queue Sidebar */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3 mb-3">
              Daftar Antrean Selanjutnya
            </h3>

            <div className="space-y-2.5">
              {queueList.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition ${
                    item.status === 'CALLING'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold shadow-lg'
                      : item.status === 'DONE'
                      ? 'bg-slate-950 border-slate-800/80 text-slate-500 opacity-60'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-base text-blue-400">{item.number}</span>
                    <div>
                      <p className="font-bold text-slate-100">{item.service}</p>
                      <span className="text-[10px] opacity-75">{item.status}</span>
                    </div>
                  </div>

                  {item.status === 'WAITING' && (
                    <button
                      onClick={() => speakQueue(item.number, item.service)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <SkipForward className="w-3.5 h-3.5" /> Panggil
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 text-center font-medium">
            Terhubung dengan <span className="text-blue-400 font-bold">BPJS Antrean Online Webhook</span>
          </div>
        </div>
      </div>
    </div>
  );
}
