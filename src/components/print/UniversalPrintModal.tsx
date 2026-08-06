'use client';

import React from 'react';
import { X, Printer, Download, CheckCircle2, QrCode, ShieldCheck, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export type PrintDocType = 'KWITANSI' | 'KARTU_PASIEN' | 'RESUME_EMR' | 'HASIL_LAB' | 'EKSPERTISE_RAD' | 'ETIKET_OBAT' | 'SEP_BPJS';

interface UniversalPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PrintDocType;
  patientName?: string;
  mrn?: string;
  invoiceNo?: string;
  data?: any;
}

export default function UniversalPrintModal({
  isOpen,
  onClose,
  docType,
  patientName = 'Budi Santoso',
  mrn = 'RM-2026-08-0001',
  invoiceNo = 'INV-20260806-009',
  data
}: UniversalPrintModalProps) {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    window.print();
    showToast({
      type: 'success',
      title: 'Mencetak Dokumen',
      message: `Dokumen ${docType} dikirim ke antrian pencetak printer RS.`
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 glass-panel-overlay">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700 p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 no-print">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                Official SIMRS Document Print Engine
              </span>
              <span className="text-slate-400 text-xs font-mono">• Status: Ready</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-400" /> Cetak Dokumen Resmi: {docType.replace('_', ' ')}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition"
            >
              <Printer className="w-4 h-4" /> Cetak (Print)
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="printable-document bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-xl space-y-6 text-xs font-sans">
          {/* Header Kop Rumah Sakit */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl">
                RSUD
              </div>
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                  RUMAH SAKIT UMUM DAERAH SEHAT UTAMA
                </h2>
                <p className="text-[10px] text-slate-600 font-medium">
                  Jl. Sudirman No. 45 Jakarta Selatan • Telp: (021) 555-1234 • Email: info@rsudsehat.go.id
                </p>
                <p className="text-[10px] text-slate-500">KARS Akreditasi Paripurna ⭐⭐⭐⭐⭐ • Izin Operasional Kemenkes</p>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-600">
              <p className="font-bold text-slate-900 text-xs">Tgl Cetak: {new Date().toLocaleDateString('id-ID')}</p>
              <p>No. Dokumen: DOC-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* DOCUMENT TYPE: KWITANSI */}
          {docType === 'KWITANSI' && (
            <div className="space-y-4">
              <div className="text-center font-bold uppercase border-b border-slate-300 pb-2">
                <h3 className="text-sm font-extrabold tracking-wider">KWITANSI BUKTI PEMBAYARAN KASIR</h3>
                <p className="text-[11px] font-mono text-slate-600">Nomor Invoice: {invoiceNo}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p><span className="font-bold">Nama Pasien:</span> {patientName}</p>
                  <p><span className="font-bold">No. Rekam Medis (RM):</span> {mrn}</p>
                  <p><span className="font-bold">Penjamin:</span> BPJS Kesehatan / Umum</p>
                </div>
                <div className="text-right">
                  <p><span className="font-bold">Tanggal Transaksi:</span> {new Date().toLocaleDateString('id-ID')}</p>
                  <p><span className="font-bold">Kasir Pembayar:</span> Kasir Utama Lt. 1</p>
                  <p><span className="font-bold">Metode Bayar:</span> QRIS / VA BCA / Cash</p>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-400 text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400 font-bold">
                    <th className="p-2 border-r border-slate-400">Deskripsi Layanan / Obat</th>
                    <th className="p-2 border-r border-slate-400">Kategori</th>
                    <th className="p-2 text-right">Jumlah (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-medium">Jasa Medis Konsultasi Dokter Spesialis</td>
                    <td className="p-2 border-r border-slate-300">Jasa Medis</td>
                    <td className="p-2 text-right font-mono">Rp 250.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-medium">Pemeriksaan Laboratorium: Hematologi Lengkap & LFT</td>
                    <td className="p-2 border-r border-slate-300">Penunjang Lab</td>
                    <td className="p-2 text-right font-mono">Rp 350.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-medium">Pemeriksaan Radiologi: Thorax X-Ray PA View</td>
                    <td className="p-2 border-r border-slate-300">Penunjang Rad</td>
                    <td className="p-2 text-right font-mono">Rp 400.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-medium">Resep Obat CPOE: Amlodipine 10mg & Simvastatin</td>
                    <td className="p-2 border-r border-slate-300">Farmasi</td>
                    <td className="p-2 text-right font-mono">Rp 145.000</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-extrabold border-t border-slate-400">
                    <td colSpan={2} className="p-2 text-right border-r border-slate-400">TOTAL TAGIHAN:</td>
                    <td className="p-2 text-right font-mono">Rp 1.145.000</td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-900 font-extrabold">
                    <td colSpan={2} className="p-2 text-right border-r border-slate-400">DITANGGUNG BPJS KESEHATAN:</td>
                    <td className="p-2 text-right font-mono">Rp 950.000</td>
                  </tr>
                  <tr className="bg-slate-200 text-slate-900 font-black text-sm">
                    <td colSpan={2} className="p-2 text-right border-r border-slate-400">SISA DIBAYAR PASIEN (LUNAS):</td>
                    <td className="p-2 text-right font-mono">Rp 195.000</td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex items-center justify-between pt-6">
                <div className="border border-emerald-600 rounded-xl p-3 bg-emerald-50 text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-black">STEMPEL LUNAS - PAID</p>
                    <p className="text-[9px] font-mono">Verified by SIMRS Kasir Billing</p>
                  </div>
                </div>

                <div className="text-center font-mono text-xs">
                  <p className="mb-8">Petugas Kasir,</p>
                  <p className="font-bold underline">Siti Aminah, Amd.Ak</p>
                  <p className="text-[10px] text-slate-500">NIP: 199208152020122004</p>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT TYPE: RESUME EMR */}
          {docType === 'RESUME_EMR' && (
            <div className="space-y-4">
              <div className="text-center font-bold uppercase border-b border-slate-300 pb-2">
                <h3 className="text-sm font-extrabold">RESUME MEDIS & LEMBAR CPPT RAWAT JALAN / INAP</h3>
                <p className="text-[11px] font-mono text-slate-600">No. Rekam Medis: {mrn}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border p-3 rounded-xl bg-slate-50">
                <div>
                  <p><span className="font-bold">Nama Pasien:</span> {patientName}</p>
                  <p><span className="font-bold">Tanggal Lahir:</span> 12 April 1985 (41 Thn)</p>
                  <p><span className="font-bold">Alamat:</span> Jl. Sudirman No. 45, Jakarta</p>
                </div>
                <div>
                  <p><span className="font-bold">Dokter Penanggung Jawab (DPJP):</span> dr. Ahmad Pratama, Sp.PD</p>
                  <p><span className="font-bold">Poli / Unit:</span> Poliklinik Penyakit Dalam</p>
                  <p><span className="font-bold">Tanggal Pelayanan:</span> {new Date().toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="border p-3 rounded-xl">
                  <h4 className="font-bold uppercase text-blue-900 border-b pb-1 mb-1">S (Subjective) - Anamnesis & Keluhan</h4>
                  <p>Pasien mengeluh nyeri dada sebelah kiri, pusing berputar, dan lemas sejak 2 hari SMRS. Riwayat hipertensi tidak terkontrol.</p>
                </div>

                <div className="border p-3 rounded-xl">
                  <h4 className="font-bold uppercase text-blue-900 border-b pb-1 mb-1">O (Objective) - Tanda Vital & Fisik</h4>
                  <p className="font-mono">TD: 145/88 mmHg | Nadi: 84 bpm | RR: 18 x/m | Suhu: 36.8 °C | SpO2: 98% | NEWS2 Score: 1 (Risiko Rendah)</p>
                </div>

                <div className="border p-3 rounded-xl">
                  <h4 className="font-bold uppercase text-blue-900 border-b pb-1 mb-1">A (Assessment) - Diagnosis Kode ICD-10</h4>
                  <p className="font-bold font-mono">ICD-10: I10 - Essential (primary) hypertension</p>
                  <p className="text-[11px] text-slate-600">Diagnosis Sekunder: E11.9 - Type 2 diabetes mellitus without complications</p>
                </div>

                <div className="border p-3 rounded-xl">
                  <h4 className="font-bold uppercase text-blue-900 border-b pb-1 mb-1">P (Plan) - Terapi & Edukasi</h4>
                  <p>1. Amlodipine 10mg tab 1x1 p.c. (pagi)</p>
                  <p>2. Diet rendah garam & olahraga teratur 30 menit per hari</p>
                  <p>3. Kontrol ulang Poliklinik Penyakit Dalam 1 minggu lagi</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="border border-blue-600 rounded-xl p-2.5 bg-blue-50 text-blue-900 text-[10px]">
                  <p className="font-bold">E-SIGNATURE RSA-256 DIGITAL STAMP</p>
                  <p className="font-mono">Hash: eSign-RSA256-a98f12cb34</p>
                </div>
                <div className="text-center font-mono text-xs">
                  <p className="mb-8">Dokter DPJP,</p>
                  <p className="font-bold underline">dr. Ahmad Pratama, Sp.PD</p>
                  <p className="text-[10px] text-slate-500">SIP: 503/449/DOKTER/2024</p>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT TYPE: HASIL LAB / ETIKET / OTHER */}
          {(docType === 'HASIL_LAB' || docType === 'EKSPERTISE_RAD' || docType === 'SEP_BPJS' || docType === 'KARTU_PASIEN' || docType === 'ETIKET_OBAT') && (
            <div className="space-y-4">
              <div className="text-center font-bold uppercase border-b border-slate-300 pb-2">
                <h3 className="text-sm font-extrabold">{docType.replace('_', ' ')} OFFICIAL REPORT</h3>
                <p className="text-[11px] font-mono text-slate-600">No. RM: {mrn} | Nama: {patientName}</p>
              </div>

              <div className="p-4 border rounded-2xl bg-slate-50 font-mono text-xs space-y-2">
                <p><span className="font-bold">Status Dokumen:</span> Validated & Digital Signed</p>
                <p><span className="font-bold">Tanggal Terbit:</span> {new Date().toLocaleString('id-ID')}</p>
                <p><span className="font-bold">Integrasi:</span> LIS / PACS / BPJS V-Claim / SATUSEHAT R4 Bridge</p>
              </div>

              <div className="text-center pt-4">
                <p className="font-mono text-[10px] text-slate-500">--- Akhir Dokumen Resmi SIMRS Enterprise v2.0 ---</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
