'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  CheckCircle2,
  DollarSign,
  QrCode,
  Building2,
  Receipt,
  Download,
  Search,
  ShieldCheck,
  Plus,
  FilePlus
} from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

export default function KasirBillingPage() {
  const { billingInvoices, payInvoice, patients, addBillingItemToPatient } = useHospitalStore();
  const { showToast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState(billingInvoices[0]);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA_BCA' | 'CASH'>('QRIS');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Form Add Item State
  const [selectedMrn, setSelectedMrn] = useState(patients[0]?.mrn || 'RM-2026-08-0001');
  const [itemDescription, setItemDescription] = useState('Konsultasi Dokter Spesialis Tambahan');
  const [itemCategory, setItemCategory] = useState('Doctor Fee');
  const [itemAmount, setItemAmount] = useState(250000);

  const handleProcessPayment = () => {
    payInvoice(selectedInvoice.id, paymentMethod);
    showToast({
      type: 'success',
      title: 'Pembayaran Lunas!',
      message: `Invoice ${selectedInvoice.invoiceNo} telah dilunasi via ${paymentMethod}`
    });
    setShowReceiptModal(true);
  };

  const handleAddBillingItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find((p) => p.mrn === selectedMrn) || patients[0];

    addBillingItemToPatient(patientObj.mrn, {
      description: itemDescription,
      category: itemCategory,
      amount: Number(itemAmount)
    });

    setShowAddItemModal(false);
    showToast({
      type: 'success',
      title: 'Item Tagihan Ditambahkan!',
      message: `Item '${itemDescription}' (Rp ${itemAmount.toLocaleString('id-ID')}) telah ditambahkan ke invoice ${patientObj.name}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Billing KPI Cards & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Omzet Billing Today</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">Rp 482.5M</p>
            <span className="text-[10px] text-emerald-400">92% Terkumpul</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Klaim BPJS Cover</span>
            <p className="text-2xl font-black text-blue-400 font-mono">Rp 328.0M</p>
            <span className="text-[10px] text-blue-400">Kover INACBG CBG</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Out-Of-Pocket Pasien</span>
            <p className="text-2xl font-black text-indigo-400 font-mono">Rp 154.5M</p>
            <span className="text-[10px] text-indigo-400">QRIS / VA / Tunai</span>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Invoice</span>
            <p className="text-2xl font-black text-purple-400 font-mono">98% Lunas</p>
            <span className="text-[10px] text-purple-400">Zero Outstanding</span>
          </div>
        </div>
      </div>

      {/* Main Cashier Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Invoice Itemized Breakdown */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" /> Rincian Tagihan Billing Aggregator
                </h3>
                <span className="font-mono text-emerald-400 text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                  {selectedInvoice.invoiceNo}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pasien: {selectedInvoice.patientName} | RM: {selectedInvoice.mrn}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddItemModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition hover:scale-105"
              >
                <FilePlus className="w-4 h-4" /> + Tambah Item Tagihan
              </button>

              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  selectedInvoice.status === 'PAID'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                STATUS: {selectedInvoice.status}
              </span>
            </div>
          </div>

          {/* Itemized Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Deskripsi Layanan / Obat</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5 text-right">Biaya Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium text-slate-200">
                {selectedInvoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition">
                    <td className="p-3.5 font-semibold text-slate-100">{item.description}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold">
                      Rp {item.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary Footer */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Biaya Perawatan:</span>
              <span className="font-mono text-slate-200">Rp {selectedInvoice.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-blue-400 font-bold">
              <span>Dikover BPJS Health (INACBG):</span>
              <span className="font-mono">- Rp {selectedInvoice.bpjsCovered.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-emerald-400 text-sm font-extrabold pt-2 border-t border-slate-800">
              <span>Sisa Yang Harus Dibayar Pasien:</span>
              <span className="font-mono">Rp {selectedInvoice.patientPayable.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Payment Processor & Simulator */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
              Metode Pembayaran Aggregator
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('QRIS')}
                className={`p-3 rounded-2xl border text-center transition ${
                  paymentMethod === 'QRIS'
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <span className="text-[10px] block">QRIS</span>
              </button>

              <button
                onClick={() => setPaymentMethod('VA_BCA')}
                className={`p-3 rounded-2xl border text-center transition ${
                  paymentMethod === 'VA_BCA'
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-[10px] block">Virtual Acc</span>
              </button>

              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border text-center transition ${
                  paymentMethod === 'CASH'
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="text-[10px] block">Tunai / Cash</span>
              </button>
            </div>

            {/* Payment Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              {paymentMethod === 'QRIS' && (
                <div className="space-y-2">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-black" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Scan QRIS via Mobile Banking / e-Wallet</p>
                </div>
              )}

              {paymentMethod === 'VA_BCA' && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Nomor Virtual Account BCA:</span>
                  <p className="font-mono text-base font-extrabold text-blue-400">8801 9283 7481 0092</p>
                  <span className="text-[9px] text-slate-500 block">Otomatis terverifikasi real-time</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {selectedInvoice.status !== 'PAID' ? (
              <button
                onClick={handleProcessPayment}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Proses Pelunasan (Rp {selectedInvoice.patientPayable.toLocaleString('id-ID')})
              </button>
            ) : (
              <button
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-extrabold text-xs transition flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" /> Cetak Kwitansi Kuitansi Lunas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Add Billing Item */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" /> Tambah Item Tagihan Manual
              </h3>
              <button onClick={() => setShowAddItemModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBillingItemSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pilih Pasien *</label>
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
                <label className="block text-slate-300 font-bold mb-1">Deskripsi Item Layanan / Obat *</label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kategori Biaya</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 outline-none"
                  >
                    <option value="Doctor Fee">Jasa Medis Dokter</option>
                    <option value="Tindakan Bedah">Tindakan Bedah</option>
                    <option value="Penunjang Lab">Penunjang Lab</option>
                    <option value="Penunjang Rad">Penunjang Radiologi</option>
                    <option value="Farmasi">Farmasi / Alkes</option>
                    <option value="Bed Charge">Kamar Inap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nominal Biaya (Rp)</label>
                  <input
                    type="number"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3 py-2 text-slate-100 font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow-lg shadow-emerald-600/30"
                >
                  Tambah Ke Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal Preview */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-emerald-500/50 p-6 space-y-4 shadow-2xl animate-in zoom-in duration-150 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-100 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" /> Kuitansi Pembayaran Lunas
              </h3>
              <span className="font-mono text-emerald-400 font-bold">{selectedInvoice.invoiceNo}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
              <p className="text-slate-300">Pasien: {selectedInvoice.patientName}</p>
              <p className="text-slate-300">RM: {selectedInvoice.mrn}</p>
              <p className="text-slate-300">Metode: {selectedInvoice.paymentMethod || paymentMethod}</p>
              <p className="text-emerald-400 font-bold text-sm pt-2 border-t border-slate-800">
                TOTAL LUNAS: Rp {selectedInvoice.patientPayable.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  showToast({ type: 'info', title: 'Cetak Kwitansi', message: 'Kwitansi tercetak!' });
                  setShowReceiptModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
