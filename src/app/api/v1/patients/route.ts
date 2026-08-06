import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';

    // Mock patient database response with standard SIMRS format
    const patients = [
      {
        id: 'p1',
        mrn: 'RM-2026-08-0001',
        nik: '3171012304850001',
        name: 'Budi Santoso',
        gender: 'MALE',
        birthDate: '1985-04-12',
        phone: '081298765432',
        address: 'Jl. Sudirman No. 45, Jakarta',
        bpjsCardNo: '0001234567890',
        allergies: ['Penicillin'],
        bloodType: 'O+',
        createdAt: '2026-08-01T08:30:00Z'
      },
      {
        id: 'p2',
        mrn: 'RM-2026-08-0002',
        nik: '3171015509900002',
        name: 'Siti Rahmawati',
        gender: 'FEMALE',
        birthDate: '1990-09-15',
        phone: '081311223344',
        address: 'Jl. Gatot Subroto No. 12, Jakarta',
        bpjsCardNo: '0009876543210',
        allergies: [],
        bloodType: 'A+',
        createdAt: '2026-08-02T09:15:00Z'
      },
      {
        id: 'p3',
        mrn: 'RM-2026-08-0003',
        nik: '3171011802780003',
        name: 'Ahmad Dahlan',
        gender: 'MALE',
        birthDate: '1978-02-18',
        phone: '085677889900',
        address: 'Jl. Asia Afrika No. 88, Bandung',
        bpjsCardNo: '0004567891230',
        allergies: ['Aspirin', 'Sulfa'],
        bloodType: 'B+',
        createdAt: '2026-08-03T11:45:00Z'
      }
    ];

    const filtered = query
      ? patients.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.mrn.toLowerCase().includes(query.toLowerCase()) ||
            p.nik.includes(query)
        )
      : patients;

    return NextResponse.json({
      success: true,
      total: filtered.length,
      data: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.nik) {
      return NextResponse.json(
        { success: false, error: 'Nama dan NIK wajib diisi!' },
        { status: 400 }
      );
    }

    const newPatient = {
      id: `p-${Date.now()}`,
      mrn: `RM-2026-08-${Math.floor(1000 + Math.random() * 9000)}`,
      nik: body.nik,
      name: body.name,
      gender: body.gender || 'MALE',
      birthDate: body.birthDate || '1990-01-01',
      phone: body.phone || '-',
      address: body.address || '-',
      bpjsCardNo: body.bpjsCardNo || '',
      allergies: body.allergies || [],
      bloodType: body.bloodType || 'O+',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Pasien baru berhasil didaftarkan ke SIMRS Enterprise v2.0',
      data: newPatient,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
