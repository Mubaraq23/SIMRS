// BPJS INACBG Grouping & Tariff Calculator

export interface InacbgRequest {
  primaryIcd10: string; // e.g. I10, E11.9, J44.9
  procedureIcd9?: string; // e.g. 88.72, 38.93
  classType: 'VIP' | 'KELAS_1' | 'KELAS_2' | 'KELAS_3';
  age: number;
  gender: 'MALE' | 'FEMALE';
}

export interface InacbgResult {
  code: string;
  description: string;
  severityLevel: 'I (Ringan)' | 'II (Sedang)' | 'III (Berat)';
  estimatedTariff: number;
  bpjsCoveredPercentage: number;
}

const INACBG_TARIFF_MAP: Record<string, { code: string; name: string; baseTariff: number }> = {
  'I10': { code: 'I-4-10-I', name: 'Hipertensi Esensial Primer (Ringan)', baseTariff: 3200000 },
  'E11.9': { code: 'E-4-10-II', name: 'Diabetes Melitus Tipe 2 Tanpa Komplikasi', baseTariff: 4500000 },
  'J44.9': { code: 'J-4-15-III', name: 'PPOK Akut Eksaserbasi (Berat)', baseTariff: 8900000 },
  'I21.9': { code: 'I-4-12-III', name: 'Infar Miokard Akut / STEMI (Sangat Berat)', baseTariff: 18500000 },
  'DEFAULT': { code: 'Z-3-10-I', name: 'Rawat Jalan Poliklinik Umum / Spesialis', baseTariff: 2500000 }
};

export function calculateInacbg(req: InacbgRequest): InacbgResult {
  const match = INACBG_TARIFF_MAP[req.primaryIcd10] || INACBG_TARIFF_MAP['DEFAULT'];
  
  let multiplier = 1.0;
  if (req.classType === 'VIP') multiplier = 1.25;
  if (req.classType === 'KELAS_1') multiplier = 1.15;
  if (req.classType === 'KELAS_2') multiplier = 1.0;
  if (req.classType === 'KELAS_3') multiplier = 0.9;

  let procedureAddon = 0;
  if (req.procedureIcd9) procedureAddon = 1200000;

  const estimatedTariff = Math.round(match.baseTariff * multiplier + procedureAddon);

  return {
    code: match.code,
    description: match.name,
    severityLevel: req.procedureIcd9 ? 'II (Sedang)' : 'I (Ringan)',
    estimatedTariff,
    bpjsCoveredPercentage: 100
  };
}
