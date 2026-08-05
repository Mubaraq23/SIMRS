'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  UserCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { UserRole } from '@/types/simrs';

export default function LoginPage() {
  const router = useRouter();
  const { branches, setBranch, setRole } = useHospitalStore();

  const [email, setEmail] = useState('dokter.ahmad@simrs.sehat.id');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0].id);
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOKTER');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find((b) => b.id === selectedBranchId) || branches[0];
    setBranch(branch);
    setRole(selectedRole);
    router.push('/');
  };

  const handleQuickDemo = (role: UserRole, demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glowing Orbs & Grids */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-4xl glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 relative z-10 animate-in fade-in zoom-in duration-300">
        {/* Left Side: Hospital Illustration & Branding */}
        <div className="bg-gradient-to-br from-blue-900/90 via-slate-900 to-indigo-950 p-8 flex flex-col justify-between relative overflow-hidden hidden sm:flex">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/40 ring-2 ring-white/10">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-xl text-white tracking-tight">SIMRS Enterprise</h1>
                <p className="text-xs text-blue-300 font-semibold">Hospital ERP Premium v2.5</p>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <h2 className="text-2xl font-black text-white leading-tight">
                Solusi Enterprise Manajemen Rumah Sakit Modern
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Platform terintegrasi SATUSEHAT Kemenkes (FHIR R4), BPJS VClaim 2.0, e-Rekam Medis (EMR/CPPT), LIS Laboratorium, PACS Radiologi, dan ERP Keuangan.
              </p>
            </div>
          </div>

          {/* Hospital Features Highlights */}
          <div className="space-y-2 text-xs pt-8 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-blue-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Standard Akreditasi KARS & ISO 27001 Security</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time SATUSEHAT FHIR Telemetry Gateway</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 space-y-6 flex flex-col justify-center bg-slate-900/90">
          <div>
            <h3 className="text-xl font-extrabold text-slate-100">Portal Masuk Sistem</h3>
            <p className="text-xs text-slate-400 mt-1">Masukkan kredensial akun SIMRS Enterprise Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Hospital Branch Selection */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-400" /> Pilih Cabang Rumah Sakit
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-slate-100 font-semibold outline-none focus:border-blue-500 transition cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Email Akses SIMRS</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-slate-100 outline-none focus:border-blue-500 transition font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-slate-100 outline-none focus:border-blue-500 transition font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Switcher */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Masuk Sebagai Role:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('DOKTER', 'dokter.ahmad@simrs.sehat.id')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    selectedRole === 'DOKTER'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  👨‍⚕️ Dokter Spesialis
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('DIREKTUR', 'direktur@simrs.sehat.id')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    selectedRole === 'DIREKTUR'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  🏢 Direktur RS
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('APOTEKER', 'apoteker@simrs.sehat.id')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    selectedRole === 'APOTEKER'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  💊 Apoteker
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo('KASIR', 'kasir@simrs.sehat.id')}
                  className={`p-2.5 rounded-xl border text-center font-bold transition ${
                    selectedRole === 'KASIR'
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  💳 Kasir / Billing
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Ingat Sesi Login Saya</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline">Lupa Password?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <span>Masuk Ke Executive Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
