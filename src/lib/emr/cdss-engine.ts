// Clinical Decision Support System (CDSS) Alert Engine

export interface CdssAlert {
  type: 'DRUG_INTERACTION' | 'ALLERGY_WARNING' | 'DUPLICATE_THERAPY' | 'DOSAGE_WARNING';
  severity: 'HIGH' | 'CRITICAL' | 'WARNING';
  title: string;
  message: string;
  recommendation: string;
}

const DRUG_INTERACTION_RULES = [
  {
    med1: 'WARFARIN',
    med2: 'ASPIRIN',
    severity: 'CRITICAL',
    title: 'Interaksi Berbahaya: Warfarin + Aspirin',
    message: 'Kombinasi Warfarin dan Aspirin meningkatkan risiko perdarahan hebat secara signifikan.',
    recommendation: 'Pertimbangkan menghentikan Aspirin atau berikan PPI gastroprotektor.'
  },
  {
    med1: 'SIMVASTATIN',
    med2: 'AMLODIPINE',
    severity: 'WARNING',
    title: 'Interaksi Dosis: Simvastatin + Amlodipine',
    message: 'Amlodipine meningkatkan kadar Simvastatin plasma, risiko rhabdomyolysis.',
    recommendation: 'Batasi dosis Simvastatin maksimal 20 mg/hari.'
  },
  {
    med1: 'CIPROFLOXACIN',
    med2: 'ANTACID',
    severity: 'WARNING',
    title: 'Absorpsi Terganggu: Ciprofloxacin + Antasida',
    message: 'Kation antasida mengikat Ciprofloxacin sehingga menurunkan efektivitas antibakteri.',
    recommendation: 'Beri jeda minimal 2 jam antara konsumsi Antasida dan Ciprofloxacin.'
  }
];

export function checkCdssAlerts(
  prescribedMeds: string[],
  patientAllergies: string[]
): CdssAlert[] {
  const alerts: CdssAlert[] = [];
  const upperMeds = prescribedMeds.map((m) => m.toUpperCase());

  // 1. Check Drug Allergy Warnings
  for (const allergy of patientAllergies) {
    const upperAllergy = allergy.toUpperCase();
    for (const med of prescribedMeds) {
      if (med.toUpperCase().includes(upperAllergy) || upperAllergy.includes(med.toUpperCase())) {
        alerts.push({
          type: 'ALLERGY_WARNING',
          severity: 'CRITICAL',
          title: `PERINGATAN ALERGI: ${med}`,
          message: `Pasien memiliki riwayat alergi terdata terhadap: ${allergy}.`,
          recommendation: 'Ganti obat dengan alternatif golongan lain segera!'
        });
      }
    }
  }

  // 2. Check Drug-Drug Interactions
  for (const rule of DRUG_INTERACTION_RULES) {
    const hasMed1 = upperMeds.some((m) => m.includes(rule.med1));
    const hasMed2 = upperMeds.some((m) => m.includes(rule.med2));

    if (hasMed1 && hasMed2) {
      alerts.push({
        type: 'DRUG_INTERACTION',
        severity: rule.severity as 'CRITICAL' | 'WARNING',
        title: rule.title,
        message: rule.message,
        recommendation: rule.recommendation
      });
    }
  }

  // 3. Duplicate Therapy Warning
  const categories = upperMeds.map((m) => {
    if (m.includes('PARACETAMOL') || m.includes('PCT') || m.includes('SANMOL')) return 'PARACETAMOL';
    if (m.includes('AMOXICILLIN') || m.includes('AMPICILLIN')) return 'PENICILLIN_ANTIBIOTIC';
    return null;
  }).filter(Boolean);

  const duplicates = categories.filter((item, index) => categories.indexOf(item) !== index);
  if (duplicates.length > 0) {
    alerts.push({
      type: 'DUPLICATE_THERAPY',
      severity: 'WARNING',
      title: 'Peringatan Duplikasi Terapi',
      message: `Terdapat obat dengan golongan / zat aktif sama teresepkan berulang (${duplicates.join(', ')}).`,
      recommendation: 'Periksa kembali daftar resep untuk menghindari overdosis.'
    });
  }

  return alerts;
}
