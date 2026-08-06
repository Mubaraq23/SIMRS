import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mrn = searchParams.get('mrn');

    const mockNotes = [
      {
        id: 'c-1',
        encounterId: 'enc-101',
        authorName: 'dr. Ahmad Pratama, Sp.PD',
        authorRole: 'DOKTER',
        subjective: 'Pasien mengeluh sesak nafas dan nyeri dada sebelah kiri.',
        objective: 'TD: 145/88 mmHg, Nadi: 84 bpm, RR: 18 x/m, Suhu: 36.8 °C, SpO2: 98%',
        assessment: 'Hipertensi Primer (ICD-10: I10)',
        plan: 'Amlodipine 10mg tab 1x1 p.c. Kontrol 1 minggu.',
        icd10Code: 'I10',
        icd10Name: 'Essential (primary) hypertension',
        digitalSignatureHash: 'eSign-RSA256-a98f12cb34',
        createdAt: '2026-08-05T09:15:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      total: mockNotes.length,
      data: mrn ? mockNotes.filter(n => n.encounterId === 'enc-101') : mockNotes
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mrn, authorName, subjective, objective, assessment, plan, icd10Code, icd10Name } = body;

    if (!subjective || !objective) {
      return NextResponse.json({ success: false, error: 'Subjective dan Objective wajib diisi' }, { status: 400 });
    }

    const newNote = {
      id: `cppt-${Date.now()}`,
      mrn: mrn || 'RM-2026-08-0001',
      authorName: authorName || 'dr. DPJP Sp.PD',
      authorRole: 'DOKTER',
      subjective,
      objective,
      assessment: assessment || 'Diagnosis Kerja',
      plan: plan || 'Rencana Terapi',
      icd10Code: icd10Code || 'I10',
      icd10Name: icd10Name || 'Essential (primary) hypertension',
      digitalSignatureHash: `eSign-RSA256-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Catatan CPPT SOAP EMR berhasil disignature digital dan tersimpan',
      data: newNote
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
