'use client';

import React from 'react';
import { Truck, Boxes, PackageCheck, FileText, CheckCircle, Clock } from 'lucide-react';

export default function ScmProcurementPage() {
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
      </div>

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
                <th className="py-3 px-4 text-right">Status Receiving</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { po: 'PO-2026-08-012', vendor: 'PT. Kimia Farma Trading', items: 'Amoxicillin 500mg (50 Box)', total: 18500000, approval: 'APPROVED', status: 'RECEIVED (GRN-091)' },
                { po: 'PO-2026-08-015', vendor: 'PT. Kalbe Farma Tbk', items: 'Infus RL 500ml (200 Karton)', total: 42000000, approval: 'APPROVED', status: 'SHIPPED / IN TRANSIT' },
                { po: 'PO-2026-08-018', vendor: 'PT. OneMed Healthcare', items: 'Spuit 3cc & Kassa Steril', total: 12400000, approval: 'PENDING_DIREKTUR', status: 'DRAFT PO' }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-400">{item.po}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{item.vendor}</td>
                  <td className="py-3 px-4 text-slate-300">{item.items}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    Rp {item.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {item.approval}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
