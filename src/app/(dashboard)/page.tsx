'use client';

import React, { useState } from 'react';
import {
  Activity,
  Bed,
  Users,
  TrendingUp,
  DollarSign,
  HeartPulse,
  BrainCircuit,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Building2,
  AlertTriangle,
  TestTube,
  ImageIcon,
  CheckCircle2,
  ShieldAlert,
  Layers,
  MapPin,
  RefreshCw,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import AICommandAssistant from '@/components/ai/AICommandAssistant';
import { useToast } from '@/components/ui/ToastProvider';

export default function ExecutiveDashboard() {
  const { activeBranch, beds, satusehatLogs, patients, labOrders, queueList } = useHospitalStore();
  const { showToast } = useToast();
  const [selectedFloor, setSelectedFloor] = useState<'Gedung A (ICU/VIP)' | 'Gedung B (Rawat Inap)'>('Gedung A (ICU/VIP)');

  const occupiedBeds = beds.filter((b) => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;
  const borPercentage = Math.round((occupiedBeds / totalBeds) * 100);

  // Chart Mock Data
  const visitData = [
    { time: '08:00', rawatJalan: 45, igd: 12, revenue: 15.4 },
    { time: '10:00', rawatJalan: 98, igd: 28, revenue: 38.2 },
    { time: '12:00', rawatJalan: 140, igd: 42, revenue: 64.0 },
    { time: '14:00', rawatJalan: 185, igd: 55, revenue: 89.5 },
    { time: '16:00', rawatJalan: 210, igd: 68, revenue: 112.8 },
    { time: '18:00', rawatJalan: 245, igd: 82, revenue: 145.2 },
    { time: '20:00', rawatJalan: 280, igd: 95, revenue: 168.0 },
  ];

  const bedClassData = [
    { name: 'VIP', occupied: 1, available: 1, total: 2 },
    { name: 'Kelas 1', occupied: 1, available: 1, total: 2 },
    { name: 'ICU', occupied: 1, available: 1, total: 2 },
  ];

  const departmentData = [
    { name: 'Poli Dalam', value: 40, color: '#2563EB' },
    { name: 'Poli Anak', value: 25, color: '#10B981' },
    { name: 'IGD Emergency', value: 20, color: '#EF4444' },
    { name: 'Bedah / OK', value: 15, color: '#8B5CF6' },
  ];

  const kpis = [
    { title: 'BOR (Bed Occupancy Rate)', value: `${borPercentage}%`, target: 'Target 85%', isUp: true, color: 'text-blue-400', icon: Bed, sub: `${occupiedBeds}/${totalBeds} Bed Terisi` },
    { title: 'LOS (Length of Stay)', value: '3.2 Hari', target: 'Standar KARS 3-5 hr', isUp: false, color: 'text-emerald-400', icon: Clock, sub: 'Rata-Rata Rawat Inap' },
    { title: 'TOI (Turn Over Interval)', value: '1.4 Hari', target: 'Efisien (1-3 hr)', isUp: true, color: 'text-cyan-400', icon: RefreshCw, sub: 'Jeda Tempat Tidur' },
    { title: 'BTO (Bed Turn Over)', value: '42.5x', target: 'Optimal / Tahun', isUp: true, color: 'text-indigo-400', icon: TrendingUp, sub: 'Pemakaian Bed Per Bed' },
    { title: 'NDR / GDR (Death Rate)', value: '0.8 / 1.2', target: 'Aman < 25‰', isUp: false, color: 'text-purple-400', icon: HeartPulse, sub: 'Per 1.000 Pasien Keluar' },
    { title: 'Pendapatan Hari Ini', value: 'Rp 168.5M', target: '+14.2% MoM', isUp: true, color: 'text-emerald-400', icon: DollarSign, sub: 'BPJS 68% | Umum 32%' },
    { title: 'Pasien IGD Emergency', value: '95 Orang', target: 'Respon Triage < 5m', isUp: true, color: 'text-rose-400', icon: ShieldAlert, sub: 'P1: 4 | P2: 18 | P3: 73' },
    { title: 'SATUSEHAT FHIR Sync', value: '99.8%', target: 'Connected R4', isUp: true, color: 'text-blue-400', icon: Activity, sub: '3.421 Records Valid' },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current" /> Executive Command Center (ECC)
              </span>
              <span className="text-slate-400 text-xs font-mono">• {activeBranch.name}</span>
              <span className="bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-Time Telemetry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              Hospital Command Center & AI Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Pemantauan terpusat indikator mutu rumah sakit (BOR, LOS, TOI, BTO, NDR, GDR), pendapatan keuangan, okupansi bed heatmap, serta rekomendasi AI medis secara real-time.
            </p>
          </div>

          {/* Emergency Alert Widget & Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast({ type: 'error', title: '🚨 CODE RED IGD', message: 'Notifikasi darurat disebarkan ke tim medis!' })}
              className="px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition hover:scale-105"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" /> Emergency Code Red
            </button>

            <button
              onClick={() => showToast({ type: 'info', title: 'SATUSEHAT Sync', message: 'Semua 3.421 record FHIR tersinkronisasi sempurna.' })}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition hover:scale-105"
            >
              <Activity className="w-4 h-4" /> Sync SATUSEHAT
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Matrix (Grid of 8 KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2.5 hover:border-blue-500/40 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-black font-mono ${kpi.color}`}>{kpi.value}</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {kpi.target}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Row: Patient Visits & Revenue Trend + Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts Area Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Tren Kunjungan Pasien & Realisasi Income Hari Ini
              </h3>
              <p className="text-[11px] text-slate-400">Monitoring volume pasien Rawat Jalan, IGD, dan Pendapatan</p>
            </div>
            <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Live Recharts
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitData}>
                <defs>
                  <linearGradient id="colorRajal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIgd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="rawatJalan" name="Rawat Jalan" stroke="#2563EB" fillOpacity={1} fill="url(#colorRajal)" strokeWidth={2} />
                <Area type="monotone" dataKey="igd" name="IGD Emergency" stroke="#EF4444" fillOpacity={1} fill="url(#colorIgd)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Pie Chart Department Workload */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Beban Layanan Poliklinik
              </h3>
              <span className="text-[10px] text-slate-400">Hari Ini</span>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              {departmentData.map((dept, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                  <div>
                    <p className="font-semibold text-slate-200 text-[11px] truncate">{dept.name}</p>
                    <p className="text-[10px] text-slate-400">{dept.value}% Pasien</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row: Floor Map & Bed Occupancy Matrix + AI Intelligence Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bed Occupancy Matrix & Floor Map */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" /> Hospital Floor Map & Okupansi Tempat Tidur
              </h3>
              <p className="text-[11px] text-slate-400">Visualisasi real-time status kamar per gedung</p>
            </div>
            <select
              value={selectedFloor}
              onChange={(e: any) => setSelectedFloor(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-blue-400 font-semibold outline-none cursor-pointer"
            >
              <option value="Gedung A (ICU/VIP)">Gedung A (ICU/VIP)</option>
              <option value="Gedung B (Rawat Inap)">Gedung B (Rawat Inap)</option>
            </select>
          </div>

          {/* Bed Heatmap Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {beds.map((bed) => (
              <div
                key={bed.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                  bed.status === 'OCCUPIED'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    : bed.status === 'CLEANING'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-100">{bed.roomName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                      {bed.classType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{bed.bedNumber}</p>
                  {bed.patientName && (
                    <p className="text-[11px] font-bold text-slate-200 mt-1">Pasien: {bed.patientName}</p>
                  )}
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    bed.status === 'OCCUPIED'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                      : bed.status === 'CLEANING'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  }`}
                >
                  {bed.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Intelligence Command Assistant */}
        <AICommandAssistant />
      </div>
    </div>
  );
}
