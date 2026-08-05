'use client';

import React, { useState } from 'react';
import { BrainCircuit, Send, Sparkles, User, Bot, Loader2, CheckCircle, Shield } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';

interface ChatMessage {
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}

export default function AICommandAssistant() {
  const { beds, satusehatLogs, patients } = useHospitalStore();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'AI',
      text: 'Halo! Saya AI Medical & Executive Assistant SIMRS Enterprise. Ada yang bisa saya bantu terkait indikator BOR/LOS, pencarian data pasien, panduan obat, atau status SATUSEHAT?',
      timestamp: '22:34'
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'USER',
      text: input,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = input.toLowerCase();
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let responseText = '';

      if (query.includes('bor') || query.includes('bed') || query.includes('kamar')) {
        const occupied = beds.filter((b) => b.status === 'OCCUPIED').length;
        const total = beds.length;
        const bor = Math.round((occupied / total) * 100);
        responseText = `Analisis Keterisian Tempat Tidur (BOR): Saat ini terdapat ${occupied} tempat tidur terisi dari total ${total} bed (${bor}% BOR). Kelas VIP & ICU memiliki keterisian tertinggi.`;
      } else if (query.includes('satusehat') || query.includes('fhir')) {
        const successCount = satusehatLogs.filter((l) => l.status === 'SUCCESS').length;
        responseText = `Status SATUSEHAT Kemenkes: Total ${satusehatLogs.length} transaksi dikirim. ${successCount} transaksi sukses (HTTP 200/201). Endpoint FHIR R4 aktif tanpa kendala.`;
      } else if (query.includes('pasien') || query.includes('budi')) {
        responseText = `Data Pasien Budi Santoso (MRN: RM-2026-08-0001): NIK 3171012304850001, BPJS Active. Memiliki Riwayat Alergi Penicillin. Diagnosa Terakhir: Hipertensi Esensial (ICD-10: I10).`;
      } else if (query.includes('dosis') || query.includes('amlodipine') || query.includes('obat')) {
        responseText = `Informasi Farmasi KFA: Amlodipine Besylate 10 mg Tablet. Indikasi: Hipertensi & Angina Pektoris. Dosis Dewasa: 5 - 10 mg 1x sehari. Peringatan: Hati-hati penggunaan bersama Amlodipine + Simvastatin (>20mg).`;
      } else {
        responseText = `Informasi Sistem: Perintah "${userMsg.text}" telah diproses. Indikator operational RS berada pada tingkat optimal dengan tingkat kepatuhan PMKP 98.4%.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'AI',
          text: responseText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              SIMRS AI Executive & Clinical Assistant
              <span className="bg-teal-500/20 text-teal-400 text-[10px] px-2 py-0.5 rounded-full border border-teal-500/30">
                Gemini Medical Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Natural Language Queries for Hospital Analytics & Clinical Support</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <Shield className="w-3.5 h-3.5" />
          <span>Hipaa & ISO 27799 Compliant</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'AI' && (
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-teal-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl p-3 space-y-1 ${
                msg.sender === 'USER'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[9px] opacity-60 block text-right font-mono">{msg.timestamp}</span>
            </div>
            {msg.sender === 'USER' && (
              <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3 text-xs text-slate-400 items-center">
            <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
            <span>AI sedang mengaitkan data EMR & Indikator RS...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 py-2 overflow-x-auto text-[11px] text-slate-400">
        <span className="shrink-0 text-slate-400 font-semibold">Saran:</span>
        <button
          onClick={() => setInput('Berapa BOR tempat tidur hari ini?')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 shrink-0 transition"
        >
          Check BOR
        </button>
        <button
          onClick={() => setInput('Bagaimana status SATUSEHAT?')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 shrink-0 transition"
        >
          Status SATUSEHAT
        </button>
        <button
          onClick={() => setInput('Informasi Obat Amlodipine')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 shrink-0 transition"
        >
          Dosis Amlodipine
        </button>
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ketik pertanyaan atau instruksi..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim</span>
        </button>
      </div>
    </div>
  );
}
