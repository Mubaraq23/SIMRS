'use client';

import React, { useState } from 'react';
import { Video, PhoneCall, MessageSquare, Send, Pill, CheckCircle, Shield, PhoneOff, Mic, MicOff, MessageCircle } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

type ChatMessage = { sender: 'DOKTER' | 'PASIEN'; text: string; time: string };

export default function TelemedicinePage() {
  const { activePatient } = useHospitalStore();
  const { showToast } = useToast();
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'DOKTER', text: 'Halo Bapak Budi, selamat pagi. Bagaimana keluhan pusingnya hari ini?', time: '08:30' },
    { sender: 'PASIEN', text: 'Pagi dokter. Masih agak melayang pas bangun tidur dok.', time: '08:31' },
    { sender: 'DOKTER', text: 'Baik pak, tensinya sudah diukur pagi ini?', time: '08:32' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      sender: 'DOKTER',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Simulate patient response after 2 seconds
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'PASIEN',
        text: 'Baik dok, siap saya laksanakan petunjuk dokter.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
  };

  const handleSendWaReminder = () => {
    showToast({
      type: 'success',
      title: 'WhatsApp Reminder Blast Terkirim',
      message: `Pesan pengingat minum obat & jadwal kontrol berhasil dikirim ke nomor WhatsApp ${activePatient?.phone || 'pasien'}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Video className="w-5 h-5 text-teal-400" /> Telemedicine & Portal Konsultasi Digital
          </h2>
          <p className="text-xs text-slate-400">Video Konsultasi Real-time, Chat Interaktif, e-Farmasi Delivery & WhatsApp Notification Engine</p>
        </div>

        <button
          onClick={handleSendWaReminder}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <MessageCircle className="w-4 h-4" /> Blast WA Reminder Pasien
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Video Consultation Screen & Live Chat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Canvas */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Sesi Telekonsultasi Encrypted</h3>
                <p className="text-xs text-slate-400">Pasien: {activePatient?.name} | Dokter: dr. Ahmad Pratama, Sp.PD</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                WebRTC HD Secure
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 h-80 flex flex-col justify-center items-center shadow-2xl">
              {isInCall ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-center space-y-3 p-4">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center font-bold text-teal-300 text-xl animate-pulse">
                    DPJP
                  </div>
                  <p className="font-bold text-slate-100 text-sm">dr. Ahmad Pratama, Sp.PD (Tersambung)</p>
                  <span className="text-xs text-teal-400 font-mono bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                    Durasi: 08:42 | Status: {isMuted ? 'Muted' : 'Microphone Active'}
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <Video className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Kamera & Mikrofon Siap Terhubung</p>
                  <button
                    onClick={() => { setIsInCall(true); showToast({ type: 'info', title: 'Video Call Dimulai', message: 'Tersambung ke sesi WebRTC pasien.' }); }}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 transition hover:scale-105"
                  >
                    Mulai Video Call Dokter
                  </button>
                </div>
              )}
            </div>

            {isInCall && (
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <button
                  onClick={() => { setIsInCall(false); showToast({ type: 'warning', title: 'Sesi Diakhiri', message: 'Telekonsultasi telah selesai.' }); }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30"
                >
                  <PhoneOff className="w-4 h-4" /> Akhiri Konsultasi
                </button>
              </div>
            )}
          </div>

          {/* Interactive Chat Panel */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-400" /> Live Text Chat Consultation
            </h3>

            <div className="h-48 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'DOKTER' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.sender === 'DOKTER'
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-75 block text-right mt-1 font-mono">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ketik balasan untuk pasien..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
              >
                <Send className="w-4 h-4" /> Kirim
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Tele-Prescribing & WhatsApp Delivery */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Pill className="w-4 h-4 text-teal-400" /> Tele-Farmasi & Delivery Kurir
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block">Status Pengiriman Kurir Obat:</span>
              <p className="text-emerald-400 font-mono font-semibold">Resep Terisi & Kurir GrabExpress / GoSend En Route</p>
              <p className="text-[11px] text-slate-400">Alamat: {activePatient?.address}</p>
              <span className="text-[10px] text-teal-400 block font-mono">Live Tracking #GRAB-881923</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block">WhatsApp Gateway Reminder Engine:</span>
              <p className="text-slate-300 italic">"Halo {activePatient?.name}, pengingat jadwal minum obat Amlodipine 10mg pukul 08:00 WIB."</p>
              <span className="text-[10px] text-teal-400 block font-mono">WhatsApp Official API Sent ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
