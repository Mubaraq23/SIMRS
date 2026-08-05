'use client';

import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  CheckCircle2,
  Boxes,
  Truck,
  Search,
  Filter,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Zap,
  Plus,
  FilePlus
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function FarmasiPage() {
  const { medicineStock, dispenseMedicine, patients, addBillingItemToPatient, addSatusehatLog } = useHospitalStore();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'VITAL' | 'EXPIRED_WARNING'>('ALL');
  const [showDispenseModal, setShowDispenseModal] = useState(false);

  // Dispense Form State
  const [selectedMrn, setSelectedMrn] = useState(patients[0]?.mrn || 'RM-2026-08-0001');
  const [selectedMedicineId, setSelectedMedicineId] = useState(medicineStock[0]?.id || 'm1');
  const [dispenseQty, setDispenseQty] = useState(10);

  const filteredMedicines = medicineStock.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.kfaCode.includes(searchQuery) ||
      m.batchNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'VITAL') return matchesSearch && m.venCategory === 'VITAL';
    if (selectedFilter === 'EXPIRED_WARNING') return matchesSearch && m.stockQty < m.reorderPoint;
    return matchesSearch;
  });

  const handleDispenseMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.mrn === selectedMrn) || patients[0];
    const medObj = medicineStock.find((m) => m.id === selectedMedicineId) || medicineStock[0];

    const totalCost = medObj.sellingPrice * dispenseQty;

    // 1. Dispense Medicine Stock
    dispenseMedicine(medObj.id, dispenseQty);

    // 2. Interconnect with Billing Invoice
    addBillingItemToPatient(patientObj.mrn, {
      description: `Obat CPOE: ${medObj.name} (${dispenseQty} ${medObj.unit})`,
      category: 'Farmasi',
      amount: totalCost
    });

    // 3. Interconnect with SATUSEHAT FHIR Telemetry
    addSatusehatLog({
      id: `sat-${Date.now()}`,
      resourceType: 'MedicationDispense',
      resourceId: `disp-${Math.floor(1000 + Math.random() * 9000)}`,
      satusehatId: `SS-MED-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'SUCCESS',
      syncTime: new Date().toLocaleString('id-ID'),
      httpCode: 201
    });

    setShowDispenseModal(false);
    showToast({
      type: 'success',
      title: 'Obat Berhasil Di-dispense!',
      message: `${dispenseQty} ${medObj.unit} ${medObj.name} dikeluarkan untuk ${patientObj.name}. Tagihan Rp ${totalCost.toLocaleString('id-ID')} & SATUSEHAT tersinkronisasi.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Pharmacy KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total SKUs Obat (KFA)</span>
          <p className="text-2xl font-black text-cyan-400 font-mono">1.840 SKU</p>
          <span className="text-[10px] text-cyan-400 font-semibold">Tersambung KFA Kemenkes</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Peringatan Stok FEFO (Reorder)</span>
          <p className="text-2xl font-black text-amber-400 font-mono">1 Obat</p>
          <span className="text-[10px] text-amber-400 font-semibold">Amoxicillin &lt; Safety Stock</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Analisis VEN (Kategori Vital)</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">65% Vital</p>
          <span className="text-[10px] text-emerald-400">Emergency & Lifesaving Meds</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Metode Pengeluaran Stok</span>
          <p className="text-2xl font-black text-blue-400 font-mono">FEFO Standard</p>
          <span className="text-[10px] text-blue-400">First Expired First Out</span>
        </div>
      </div>

      {/* Visual ABC / VEN Analysis Matrix & Actions */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Matriks Inventory Farmasi FEFO & Dispense e-Resep
            </h3>
            <p className="text-xs text-slate-400">Klasifikasi VEN/ABC, Pengeluaran Stok Obat FEFO, & Penagihan Billing</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  selectedFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua SKU
              </button>
              <button
                onClick={() => setSelectedFilter('VITAL')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  selectedFilter === 'VITAL' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Kategori Vital
              </button>
              <button
                onClick={() => setSelectedFilter('EXPIRED_WARNING')}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                  selectedFilter === 'EXPIRED_WARNING' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Restock Alert
              </button>
            </div>

            <button
              onClick={() => setShowDispenseModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition hover:scale-105"
            >
              <FilePlus className="w-4 h-4" /> + Dispense e-Resep Pasien
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari obat, kode KFA, atau no batch..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Medicine Inventory Sticky Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-3.5">Kode KFA & Nama Obat</th>
                <th className="p-3.5">Batch & Expired (FEFO)</th>
                <th className="p-3.5">Sisa Stok</th>
                <th className="p-3.5">Kategori VEN / ABC</th>
                <th className="p-3.5">Harga Beli / Jual</th>
                <th className="p-3.5 text-right">Aksi Quick Dispense</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMedicines.map((med) => {
                const isReorderNeeded = med.stockQty <= med.reorderPoint;
                return (
                  <tr key={med.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-100">{med.name}</p>
                      <span className="font-mono text-[10px] text-cyan-400">KFA: {med.kfaCode}</span>
                    </td>
                    <td className="p-3.5 font-mono">
                      <span className="text-slate-300 font-bold block">{med.batchNo}</span>
                      <span className="text-[10px] text-amber-400">Exp: {med.expiryDate}</span>
                    </td>
                    <td className="p-3.5 font-bold font-mono">
                      <span className={isReorderNeeded ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}>
                        {med.stockQty} {med.unit}
                      </span>
                      {isReorderNeeded && (
                        <span className="block text-[9px] text-rose-400 font-sans">Min: {med.reorderPoint}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                          VEN: {med.venCategory}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">
                          ABC: {med.abcCategory}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      Rp {med.sellingPrice.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          dispenseMedicine(med.id, 10);
                          addBillingItemToPatient('RM-2026-08-0001', {
                            description: `Obat CPOE: ${med.name} (10 ${med.unit})`,
                            category: 'Farmasi',
                            amount: med.sellingPrice * 10
                          });
                          showToast({
                            type: 'success',
                            title: 'Dispense Obat FEFO',
                            message: `10 ${med.unit} ${med.name} dikeluarkan & ditagihkan!`
                          });
                        }}
                        className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-[11px] shadow-md shadow-cyan-600/20 transition"
                      >
                        Dispense (-10)
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dispense e-Resep Pasien */}
      {showDispenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <Pill className="w-5 h-5 text-cyan-400" /> Dispense Obat e-Resep Pasien
              </h3>
              <button onClick={() => setShowDispenseModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleDispenseMedicineSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Pasien Penerima e-Resep *</label>
                <select
                  value={selectedMrn}
                  onChange={(e) => setSelectedMrn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-semibold cursor-pointer outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.mrn} className="bg-slate-900 text-slate-100">
                      {p.name} ({p.mrn}) - NIK: {p.nik}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Obat dari Inventori FEFO *</label>
                <select
                  value={selectedMedicineId}
                  onChange={(e) => setSelectedMedicineId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-semibold cursor-pointer outline-none"
                >
                  {medicineStock.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-900 text-slate-100">
                      {m.name} (Stok: {m.stockQty} {m.unit}) - Rp {m.sellingPrice.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Jumlah Qty Dispense</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-mono font-bold outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDispenseModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-extrabold shadow-lg shadow-cyan-600/30"
                >
                  Dispense & Sinkron Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
