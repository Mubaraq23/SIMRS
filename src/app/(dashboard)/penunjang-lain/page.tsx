'use client';

import React, { useState } from 'react';
import { Droplet, Utensils, ShieldCheck, CheckCircle2, Plus, X } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

type BloodStock = { type: string; stock: number; status: string };

const INITIAL_BLOODS: BloodStock[] = [
  { type: 'A+', stock: 24, status: 'Cukup' },
  { type: 'B+', stock: 18, status: 'Cukup' },
  { type: 'AB+', stock: 6, status: 'Kritis' },
  { type: 'O+', stock: 42, status: 'Melimpah' }
];

type DietOrder = {
  room: string;
  patientName: string;
  dietType: string;
  calories: string;
  status: string;
};

const INITIAL_DIETS: DietOrder[] = [
  { room: 'Mawar 101 - Bed A', patientName: 'Budi Santoso', dietType: 'Diet Rendah Garam (RG I)', calories: '1800 kcal, Protein 65g', status: 'Porsi Siang Terdistribusi ✓' },
  { room: 'Anggrek 201 - Bed A', patientName: 'Siti Aminah', dietType: 'Diet DM 1700 kcal (Bubur Nasi)', calories: '1700 kcal, Low GI', status: 'Persiapan Kitchen Pagi' }
];

export default function PenunjangLainPage() {
  const { activePatient, addBillingItemToPatient } = useHospitalStore();
  const { showToast } = useToast();
  const [bloodStocks, setBloodStocks] = useState<BloodStock[]>(INITIAL_BLOODS);
  const [dietOrders, setDietOrders] = useState<DietOrder[]>(INITIAL_DIETS);

  const [showBloodModal, setShowBloodModal] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);

  // Form Blood
  const [bloodType, setBloodType] = useState('O+');
  const [qtyBags, setQtyBags] = useState(2);

  // Form Diet
  const [dietType, setDietType] = useState('Diet Rendah Garam (RG I)');
  const [caloriesInfo, setCaloriesInfo] = useState('1800 kcal, Makanan Lunak');

  const handleRequestBlood = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePatient) {
      addBillingItemToPatient(activePatient.mrn, {
        description: `BDRS: Crossmatch & Kantong Darah (${qtyBags} Bag ${bloodType})`,
        category: 'Bank Darah BDRS',
        amount: qtyBags * 450000
      });
    }

    setBloodStocks(prev => prev.map(b => b.type === bloodType ? { ...b, stock: Math.max(0, b.stock - qtyBags) } : b));
    setShowBloodModal(false);
    showToast({ type: 'success', title: 'Permintaan BDRS Diterbitkan', message: `Order ${qtyBags} kantong darah ${bloodType} untuk ${activePatient?.name} berhasil dikirim.` });
  };

  const handleAddDiet = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiet: DietOrder = {
      room: 'Mawar 101',
      patientName: activePatient?.name || 'Pasien',
      dietType,
      calories: caloriesInfo,
      status: 'Terdaftar Kitchen Schedule'
    };

    setDietOrders([newDiet, ...dietOrders]);
    setShowDietModal(false);
    showToast({ type: 'success', title: 'Order Diet Gizi Berhasil', message: `Preset ${dietType} untuk ${activePatient?.name} didaftarkan.` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-400" /> Bank Darah (BDRS) & Gizi Klinik
          </h2>
          <p className="text-xs text-slate-400">Manajemen Kantong Darah (ABO/Rh), Crossmatching, Asesmen Gizi & Kitchen Meal Schedule</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowDietModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
          >
            <Utensils className="w-4 h-4 text-emerald-400" /> + Order Diet Gizi
          </button>
          <button
            onClick={() => setShowBloodModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20 transition"
          >
            <Plus className="w-4 h-4" /> + Request BDRS Crossmatch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Blood Bank Stock Matrix */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>Stok Kantong Darah (BDRS)</span>
            <span className="text-xs text-rose-400 font-mono">UTD PMI Ready</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bloodStocks.map((blood, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <span className="text-lg font-black font-mono text-rose-400 block">{blood.type}</span>
                <span className="text-xs font-bold text-slate-100 block">{blood.stock} Kantong</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {blood.status}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-rose-300">Form Permintaan Crossmatch Blood Test Active:</p>
            <p className="text-[11px] text-slate-400">Order ID: BDRS-20260805-01 (Pasien {activePatient?.name} - 2 Kantong Packed Red Cell PRC O+)</p>
          </div>
        </div>

        {/* Right: Nutrition & Dietary Kitchen Schedule */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-400" /> Distribusi Gizi & Diet Pasien
            </span>
            <span className="text-xs text-emerald-400 font-mono">Kitchen Schedule</span>
          </h3>

          <div className="space-y-3 text-xs">
            {dietOrders.map((d, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between font-bold text-slate-100">
                  <span>{d.room} ({d.patientName})</span>
                  <span className="text-emerald-400">{d.dietType}</span>
                </div>
                <p className="text-[11px] text-slate-400">Asesmen Gizi: {d.calories}</p>
                <span className="text-[10px] text-emerald-400 font-semibold block">Status: {d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Request Darah */}
      {showBloodModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-rose-400" /> Form Order Kantong Darah BDRS
              </h3>
              <button onClick={() => setShowBloodModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestBlood} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pasien (Aktif)</label>
                <input readOnly value={`${activePatient?.name} – ${activePatient?.mrn}`}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-2.5 text-slate-400" />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Golongan Darah *</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O+">O+</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Jumlah Kantong (Bags) *</label>
                <input
                  type="number"
                  value={qtyBags}
                  onChange={(e) => setQtyBags(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBloodModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition"
                >
                  Request Kantong Darah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Order Diet Gizi */}
      {showDietModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-400" /> Form Asesmen & Preset Diet Gizi
              </h3>
              <button onClick={() => setShowDietModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDiet} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preset Preskripsi Diet *</label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="Diet Rendah Garam (RG I)">Diet Rendah Garam (RG I)</option>
                  <option value="Diet Diabetes Mellitus 1700 kcal">Diet Diabetes Mellitus 1700 kcal</option>
                  <option value="Diet Tinggi Kalori Tinggi Protein (TKTP)">Diet Tinggi Kalori Tinggi Protein (TKTP)</option>
                  <option value="Diet Bubur Saring NGT">Diet Bubur Saring NGT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Kalori & Makronutrisi *</label>
                <input
                  type="text"
                  value={caloriesInfo}
                  onChange={(e) => setCaloriesInfo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDietModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition"
                >
                  Daftarkan Preskripsi Diet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
