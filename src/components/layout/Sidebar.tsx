'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Users,
  Calendar,
  Stethoscope,
  HeartPulse,
  GitBranch,
  FileSpreadsheet,
  Video,
  TestTube,
  ImageIcon,
  Scissors,
  Pill,
  Droplet,
  Truck,
  Boxes,
  Wrench,
  CreditCard,
  Landmark,
  TrendingUp,
  Building2,
  Award,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const { activeRole } = useHospitalStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['/', '/emr', '/laboratorium', '/farmasi']);

  const navGroups: NavGroup[] = [
    {
      title: 'EXECUTIVE & DASHBOARD',
      items: [
        { label: 'AI Command Center', href: '/', icon: BrainCircuit, badge: 'AI Live', badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
      ]
    },
    {
      title: 'PENDAFTARAN & PELAYANAN',
      items: [
        { label: 'Pendaftaran & Kiosk', href: '/pendaftaran', icon: Users },
        { label: 'Antrean Display TV', href: '/antrian', icon: Calendar, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
        { label: 'EMR / RME & CPPT', href: '/emr', icon: Stethoscope, badge: 'NEWS2', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
        { label: 'Asuhan Keperawatan (NIS)', href: '/keperawatan', icon: HeartPulse },
        { label: 'Clinical Pathway', href: '/clinical-pathway', icon: GitBranch },
        { label: 'MCU & Health Check', href: '/mcu', icon: FileSpreadsheet },
        { label: 'Telemedicine & Portal', href: '/telemedicine', icon: Video, badge: 'Online', badgeColor: 'bg-teal-500/20 text-teal-300' },
      ]
    },
    {
      title: 'PENUNJANG MEDIS & OPERASI',
      items: [
        { label: 'Laboratorium (LIS)', href: '/laboratorium', icon: TestTube, badge: '1 Panic', badgeColor: 'bg-rose-500 text-white animate-pulse' },
        { label: 'Radiologi (PACS Viewer)', href: '/radiologi', icon: ImageIcon },
        { label: 'Kamar Operasi (OK)', href: '/kamar-operasi', icon: Scissors },
        { label: 'Farmasi & FEFO Stock', href: '/farmasi', icon: Pill, badge: 'KFA', badgeColor: 'bg-cyan-500/20 text-cyan-400' },
        { label: 'Bank Darah & Gizi', href: '/penunjang-lain', icon: Droplet },
      ]
    },
    {
      title: 'SUPPLY CHAIN, ASSET & SCM',
      items: [
        { label: 'SCM, PR/PO & WMS', href: '/scm-procurement', icon: Truck },
        { label: 'Fixed Assets & Depresiasi', href: '/fixed-assets', icon: Boxes },
        { label: 'IPSRS & Kalibrasi Alat', href: '/ipsrs', icon: Wrench },
      ]
    },
    {
      title: 'KEUANGAN & GENERAL LEDGER',
      items: [
        { label: 'Kasir & Billing Aggregator', href: '/kasir-billing', icon: CreditCard },
        { label: 'Financial ERP & COA', href: '/financial-erp', icon: Landmark, badge: 'GL ERP', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
      ]
    },
    {
      title: 'INTEGRASI & TATA KELOLA',
      items: [
        { label: 'SATUSEHAT (FHIR R4)', href: '/satusehat', icon: Activity, badge: 'FHIR R4', badgeColor: 'bg-blue-500/20 text-blue-400' },
        { label: 'BPJS VClaim & INACBG', href: '/bpjs', icon: TrendingUp },
        { label: 'SDM & STR/SIP Alert', href: '/sdm', icon: Building2, badge: '1 Warning', badgeColor: 'bg-amber-500/20 text-amber-400' },
        { label: 'PMKP & Akreditasi KARS', href: '/pmkp-akreditasi', icon: Award },
      ]
    }
  ];

  const toggleFavorite = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorites.includes(href)) {
      setFavorites(favorites.filter((f) => f !== href));
    } else {
      setFavorites([...favorites, href]);
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col h-screen shrink-0 sticky top-0 z-30 transition-all duration-300 shadow-2xl`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-600/30 ring-2 ring-white/10 shrink-0">
            <Activity className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="transition-all animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-100 tracking-tight text-sm">SIMRS Enterprise</h1>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                  v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Hospital ERP Premium</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition border border-slate-700/60"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Instant Search (Only visible when expanded) */}
      {!isCollapsed && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu SIMRS..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {navGroups.map((group, idx) => {
          const filteredItems = group.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>{group.title}</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-mono">
                    {filteredItems.length}
                  </span>
                </p>
              )}

              {filteredItems.map((item) => {
                const isActive = pathname === item.href;
                const isFav = favorites.includes(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-600/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!isCollapsed && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              item.badgeColor || 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => toggleFavorite(e, item.href)}
                          className="opacity-0 group-hover:opacity-100 transition text-slate-500 hover:text-amber-400"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400 opacity-100' : ''}`} />
                        </button>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Role Footer & Logout Button */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400 shrink-0">
            {activeRole.substring(0, 2)}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">Petugas Active</p>
              <p className="text-[10px] text-blue-400 font-mono font-semibold">{activeRole}</p>
            </div>
          )}
        </div>

        <Link
          href="/logout"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition"
          title="Keluar / Logout"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
