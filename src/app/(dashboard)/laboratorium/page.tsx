'use client';

import React, { useState } from 'react';
import {
  TestTube,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FlaskConical,
  Search,
  Filter,
  Plus,
  Printer,
  FileCheck,
  FilePlus,
  ShieldCheck
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function LaboratoriumPage() {
  const { labOrders, updateLabStatus, updateLabResults, patients, addBillingItemToPatient, addSatusehatLog } = useHospitalStore();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);

  // Form Input Hasil Lab
  const [selectedMrn, setSelectedMrn] = useState(patients[0]?.mrn || 'RM-2026-08-0001');
  const [testCategory, setTestCategory] = useState('Hematologi Lengkap & LFT');
  const [hbValue, setHbValue] = useState('14.2');
  const [leukositValue, setLeukositValue] = useState('11.8');
  const [trombositValue, setTrombositValue] = useState('245');
  const [gulaDarahValue, setGulaDarahValue] = useState('110');
  const [doctorSign, setDoctorSign] = useState('dr. Sp.PK Budi, M.Kes');

  const filteredOrders = labOrders.filter(
    (order) =>
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sampleBarcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveLabResult = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.mrn === selectedMrn) || patients[0];
    const isLeukositPanic = parseFloat(leukositValue) > 11.0;

    const newBarcode = `LAB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
      id: `lab-${Date.now()}`,
      encounterId: 'enc-101',
      patientName: patientObj.name,
      mrn: patientObj.mrn,
      testName: testCategory,
      loincCode: '58410-2',
      status: 'VALIDATED' as const,
      sampleBarcode: newBarcode,
      results: [
        { parameter: 'Hemoglobin', value: hbValue, unit: 'g/dL', refRange: '13.2 - 17.3', isAbnormal: false, isPanicValue: false },
        { parameter: 'Leukosit', value: leukositValue, unit: '10^3/uL', refRange: '3.8 - 10.6', isAbnormal: isLeukositPanic, isPanicValue: isLeukositPanic },
        { parameter: 'Trombosit', value: trombositValue, unit: '10^3/uL', refRange: '150 - 440', isAbnormal: false, isPanicValue: false },
        { parameter: 'Gula Darah Sewaktu', value: gulaDarahValue, unit: 'mg/dL', refRange: '< 140', isAbnormal: false, isPanicValue: false }
      ],
      technicianName: 'Analisis Sinta, A.Md.AK',
      doctorSignName: doctorSign,
      createdAt: new Date().toISOString()
    };

    // 1. Save to labOrders
    updateLabResults(newOrder.id, newOrder.results, doctorSign);

    // 2. Interconnect with Billing Invoice
    addBillingItemToPatient(patientObj.mrn, {
      description: `Laboratorium: ${testCategory} (${newBarcode})`,
      category: 'Penunjang Lab',
      amount: 480000
    });

    // 3. Interconnect with SATUSEHAT FHIR Telemetry
    addSatusehatLog({
      id: `sat-${Date.now()}`,
      resourceType: 'DiagnosticReport',
      resourceId: newOrder.id,
      satusehatId: `SS-LAB-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'SUCCESS',
      syncTime: new Date().toLocaleString('id-ID'),
      httpCode: 201
    });

    setShowInputModal(false);
    showToast({
      type: isLeukositPanic ? 'warning' : 'success',
      title: isLeukositPanic ? '🚨 NILAI KRITIS (PANIC VALUE) LAB' : 'Hasil Lab Ter-Input!',
      message: `Hasil Lab untuk ${patientObj.name} tervalidasi! Tagihan Billing & SATUSEHAT tersinkronisasi.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top LIS Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Lab Hari Ini</span>
          <p className="text-2xl font-black text-blue-400 font-mono">84 Spesimen</p>
          <span className="text-[10px] text-slate-400">Hematologi | Kimia | Serologi</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Nilai Kritis (Panic Value)</span>
          <p className="text-2xl font-black text-rose-400 font-mono">1 Kasus</p>
          <span className="text-[10px] text-rose-400 font-semibold">Leukosit 11.8 /uL (Peringatan)</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tervalidasi (Sp.PK)</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">76 Order</p>
          <span className="text-[10px] text-emerald-400">Signature Hash Ready</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TAT Rata-Rata Lab</span>
          <p className="text-2xl font-black text-indigo-400 font-mono">28 Menit</p>
          <span className="text-[10px] text-indigo-400">Target &lt; 45 Menit (SLA OK)</span>
        </div>
      </div>

      {/* Specimen Workflow & Action Header */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-blue-400" /> Workflow LIMS Spesimen & Input Hasil Lab
            </h3>
            <p className="text-xs text-slate-400">Tracking spesimen darah/urine, Input Parameter Hasil, & Approval Sp.PK</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari barcode / sampel..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setShowInputModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-105"
            >
              <FilePlus className="w-4 h-4" /> + Input Hasil Lab Baru
            </button>
          </div>
        </div>

        {/* Orders Table with Sticky Header */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 sticky top-0">
              <tr>
                <th className="p-3.5">No. Barcode & RM</th>
                <th className="p-3.5">Nama Pasien</th>
                <th className="p-3.5">Pemeriksaan Lab</th>
                <th className="p-3.5">Hasil Parameter Key</th>
                <th className="p-3.5">Status Flow</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3.5 font-mono">
                    <span className="text-blue-400 font-bold block">{order.sampleBarcode}</span>
                    <span className="text-slate-500 text-[10px]">{order.mrn}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-200">{order.patientName}</td>
                  <td className="p-3.5 font-medium text-slate-300">
                    {order.testName}
                    <span className="block text-[10px] text-slate-500 font-mono">LOINC: {order.loincCode}</span>
                  </td>
                  <td className="p-3.5">
                    {order.results.map((r, idx) => (
                      <span
                        key={idx}
                        className={`inline-block mr-2 mb-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                          r.isPanicValue
                            ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {r.parameter}: {r.value} {r.unit}
                      </span>
                    ))}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                        order.status === 'VALIDATED'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() =>
                        showToast({ type: 'info', title: 'Hasil LIS', message: `Mencetak lembar hasil laboratorium ${order.patientName}...` })
                      }
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-[11px]"
                    >
                      Cetak Hasil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Hasil Lab Baru */}
      {showInputModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-blue-400" /> Input Hasil Pemeriksaan Laboratorium
              </h3>
              <button onClick={() => setShowInputModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLabResult} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Pasien Terdaftar *</label>
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
                <label className="block text-slate-300 font-bold mb-1">Jenis Paket Pemeriksaan Lab</label>
                <input
                  type="text"
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              {/* Parameters Input Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 font-bold">Hemoglobin (g/dL)</label>
                  <input
                    type="text"
                    value={hbValue}
                    onChange={(e) => setHbValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-rose-400 text-[10px] mb-1 font-bold">Leukosit (10^3/uL) *Panic Check</label>
                  <input
                    type="text"
                    value={leukositValue}
                    onChange={(e) => setLeukositValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-rose-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 font-bold">Trombosit (10^3/uL)</label>
                  <input
                    type="text"
                    value={trombositValue}
                    onChange={(e) => setTrombositValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-1 font-bold">Gula Darah Sewaktu (mg/dL)</label>
                  <input
                    type="text"
                    value={gulaDarahValue}
                    onChange={(e) => setGulaDarahValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-slate-100 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Dokter Spesialis Patologi Klinik (Sp.PK) Sign</label>
                <input
                  type="text"
                  value={doctorSign}
                  onChange={(e) => setDoctorSign(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-lg shadow-blue-600/30"
                >
                  Simpan & Validasi LIMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
