import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const invoices = [
      {
        id: 'inv-1',
        invoiceNo: 'INV-20260805-0042',
        mrn: 'RM-2026-08-0001',
        patientName: 'Budi Santoso',
        items: [
          { description: 'Akomodasi Kamar VIP Mawar 101 (2 Hari)', category: 'Bed Charge', amount: 2400000 },
          { description: 'Jasa Medis Dokter Spesialis Penyakit Dalam', category: 'Doctor Fee', amount: 350000 },
          { description: 'Laboratorium: Hematologi Lengkap & LFT', category: 'Penunjang Lab', amount: 480000 },
          { description: 'Radiologi: Thorax X-Ray PA View', category: 'Penunjang Rad', amount: 320000 },
          { description: 'Obat CPOE: Amlodipine & Betahistine', category: 'Farmasi', amount: 145000 }
        ],
        totalAmount: 3695000,
        bpjsCovered: 3200000,
        patientPayable: 495000,
        status: 'UNPAID',
        createdAt: '2026-08-05T10:00:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      total: invoices.length,
      data: invoices
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, paymentMethod } = body;

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoiceId} berhasil dilunasi via ${paymentMethod || 'QRIS'}`,
      paymentTime: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
