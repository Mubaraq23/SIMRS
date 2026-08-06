'use client';

import React, { useState } from 'react';
import { Truck, Boxes, PackageCheck, FileText, CheckCircle, Clock, Plus, X, ArrowUpRight } from 'lucide-react';
import { useHospitalStore } from '@/lib/store/useHospitalStore';
import { useToast } from '@/components/ui/ToastProvider';

type PurchaseOrder = {
  id: string;
  po: string;
  vendor: string;
  items: string;
  total: number;
  approval: 'APPROVED' | 'PENDING_DIREKTUR' | 'REJECTED';
  status: 'RECEIVED (GRN)' | 'SHIPPED / IN TRANSIT' | 'DRAFT PO';
  createdDate: string;
};

const INITIAL_POS: PurchaseOrder[] = [
  { id: 'po-1', po: 'PO-2026-08-012', vendor: 'PT. Kimia Farma Trading', items: 'Amoxicillin 500mg (50 Box)', total: 18500000, approval: 'APPROVED', status: 'RECEIVED (GRN)', createdDate: '2026-08-01' },
  { id: 'po-2', po: 'PO-2026-08-015', vendor: 'PT. Kalbe Farma Tbk', items: 'Infus RL 500ml (200 Karton)', total: 42000000, approval: 'APPROVED', status: 'SHIPPED / IN TRANSIT', createdDate: '2026-08-03' },
  { id: 'po-3', po: 'PO-2026-08-018', vendor: 'PT. OneMed Healthcare', items: 'Spuit 3cc & Kassa Steril', total: 12400000, approval: 'PENDING_DIREKTUR', status: 'DRAFT PO', createdDate: '2026-08-05' },
];

export default function ScmProcurementPage() {
  const { medicineStock } = useHospitalStore();
  const { showToast } = useToast();
  const [poList, setPoList] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [showPrModal, setShowPrModal] = useState(false);

  // Form states
  const [vendor, setVendor] = useState('PT. Kimia Farma Trading');
  const [itemName, setItemName] = useState('Amlodipine Besylate 10mg');
  const [qty, setQty] = useState(100);
  const [unitPrice, setUnitPrice] = useState(450);

  const handleCreatePr = (e: React.FormEvent) => {
    e.preventDefault();
    const totalVal = qty * unitPrice;
    const newPo: PurchaseOrder = {
      id: `po-${Date.now()}`,
      po: `PO-2026-08-${Math.floor(100 + Math.random() * 900)}`,
      vendor,
      items: `${itemName} (${qty} Box/Unit)`,
      total: totalVal,
      approval: 'APPROVED',
      status: 'SHIPPED / IN TRANSIT',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setPoList([newPo, ...poList]);
    setShowPrModal(false);
    showToast({ type: 'success', title: 'Purchase Request / PO Diterbitkan', message: `Nomor ${newPo.po} ke ${vendor} berhasil diajukan.` });
  };

  const handleReceiveGRN = (id: string, poNo: string) => {
    setPoList(prev => prev.map(p => p.id === id ? { ...p, status: 'RECEIVED (GRN)' as const } : p));
    showToast({ type: 'success', title: 'Penerimaan Barang (GRN)', message: `Barang untuk ${poNo} telah diterima di Gudang Utama dan stok diperbarui.` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-400" /> Supply Chain Management (SCM) & Warehouse WMS
          </h2>
          <p className="text-xs text-slate-400">e-Procurement, Purchase Request (PR), Purchase Order (PO), Receiving (GRN) & Multi-Gudang RFID</p>
        </div>

        <button
          onClick={() => setShowPrModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition"
        >
          <Plus className="w-4 h-4" /> + Buat Purchase Request (PR)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total PO Aktif</span>
          <p className="text-2xl font-black font-mono text-teal-400">{poList.length} Transaksi</p>
          <span className="text-[10px] text-slate-400">Bulan Agustus 2026</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Total Value Pengadaan</span>
          <p className="text-2xl font-black font-mono text-slate-100">
            Rp {poList.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('id-ID')}
          </p>
          <span className="text-[10px] text-teal-400 font-semibold">Approved by Direktur</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-amber-400 uppercase font-bold tracking-wider">Pending Delivery</span>
          <p className="text-2xl font-black font-mono text-amber-400">
            {poList.filter(p => p.status === 'SHIPPED / IN TRANSIT').length} PO
          </p>
          <span className="text-[10px] text-amber-400">Dalam pengiriman distributor</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">Received GRN</span>
          <p className="text-2xl font-black font-mono text-emerald-400">
            {poList.filter(p => p.status === 'RECEIVED (GRN)').length} PO
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">Stok gudang terisi</span>
        </div>
      </div>

      {/* Main Table PO List */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Daftar Purchase Order (PO) Gudang Farmasi & BMHP</span>
          <span className="text-xs text-teal-400 font-mono">Workflow e-Procurement Active</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">No. Purchase Order</th>
                <th className="py-3 px-4">Vendor / Distributor</th>
                <th className="py-3 px-4">Item Barang & Jumlah</th>
                <th className="py-3 px-4">Total Nilai (Rp)</th>
                <th className="py-3 px-4">Approval Direktur</th>
                <th className="py-3 px-4 text-right">Status & Aksi GRN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {poList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-400">{item.po}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{item.vendor}</td>
                  <td className="py-3 px-4 text-slate-300">{item.items}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    Rp {item.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      item.approval === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {item.approval}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] inline-block mb-1 sm:mb-0">
                      {item.status}
                    </span>
                    {item.status === 'SHIPPED / IN TRANSIT' && (
                      <button
                        onClick={() => handleReceiveGRN(item.id, item.po)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow transition"
                      >
                        ✓ Terima GRN
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Buat Purchase Request */}
      {showPrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-400" /> Form Purchase Request (PR) Baru
              </h3>
              <button onClick={() => setShowPrModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePr} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Vendor / Distributor *</label>
                <select
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                >
                  <option value="PT. Kimia Farma Trading">PT. Kimia Farma Trading</option>
                  <option value="PT. Kalbe Farma Tbk">PT. Kalbe Farma Tbk</option>
                  <option value="PT. OneMed Healthcare">PT. OneMed Healthcare</option>
                  <option value="PT. Sanbe Farma">PT. Sanbe Farma</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Barang / Obat *</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Nama obat / alkes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jumlah (Qty) *</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Satuan (Rp) *</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl flex justify-between font-bold text-teal-300">
                <span>Total Estimasi PO:</span>
                <span className="font-mono">Rp {(qty * unitPrice).toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPrModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 transition"
                >
                  Ajukan PR / Dapatkan PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
