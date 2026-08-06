import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const queueList = [
      { number: 'A-101', service: 'Poliklinik Penyakit Dalam', status: 'WAITING', patientName: 'Budi Santoso', mrn: 'RM-2026-08-0001' },
      { number: 'A-102', service: 'Poliklinik Penyakit Dalam', status: 'CALLING', patientName: 'Siti Rahmawati', mrn: 'RM-2026-08-0002' },
      { number: 'B-201', service: 'Poliklinik Anak', status: 'WAITING', patientName: 'Ahmad Dahlan', mrn: 'RM-2026-08-0003' },
      { number: 'E-001', service: 'IGD Emergency', status: 'CALLING', patientName: 'Rudi Hermawan', mrn: 'RM-2026-08-0004' },
    ];

    return NextResponse.json({
      success: true,
      total: queueList.length,
      data: queueList,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, mrn, patientName } = body;

    const qNum = `${service?.charAt(0).toUpperCase() || 'A'}-${Math.floor(100 + Math.random() * 900)}`;
    const newQueue = {
      id: `q-${Date.now()}`,
      number: qNum,
      service: service || 'Poliklinik Umum',
      status: 'WAITING',
      patientName: patientName || 'Pasien Admisi',
      mrn: mrn || 'RM-2026-08-0005',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Nomor antrian ${qNum} berhasil diterbitkan`,
      data: newQueue,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
