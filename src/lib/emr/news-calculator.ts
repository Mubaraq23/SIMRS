// NEWS 2 (National Early Warning Score) Calculator

export interface NewsInput {
  respiratoryRate: number;
  spo2: number;
  systolicBP: number;
  heartRate: number;
  temperature: number;
  consciousness: 'ALERT' | 'CONFUSED' | 'VOICE' | 'PAIN' | 'UNRESPONSIVE';
}

export interface NewsResult {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionRecommendation: string;
  badgeColor: string;
}

export function calculateNEWS2(input: NewsInput): NewsResult {
  let score = 0;

  // 1. Respiratory Rate (per min)
  if (input.respiratoryRate <= 8) score += 3;
  else if (input.respiratoryRate >= 9 && input.respiratoryRate <= 11) score += 1;
  else if (input.respiratoryRate >= 12 && input.respiratoryRate <= 20) score += 0;
  else if (input.respiratoryRate >= 21 && input.respiratoryRate <= 24) score += 2;
  else if (input.respiratoryRate >= 25) score += 3;

  // 2. SpO2 (%)
  if (input.spo2 <= 91) score += 3;
  else if (input.spo2 >= 92 && input.spo2 <= 93) score += 2;
  else if (input.spo2 >= 94 && input.spo2 <= 95) score += 1;
  else if (input.spo2 >= 96) score += 0;

  // 3. Systolic BP (mmHg)
  if (input.systolicBP <= 90) score += 3;
  else if (input.systolicBP >= 91 && input.systolicBP <= 100) score += 2;
  else if (input.systolicBP >= 101 && input.systolicBP <= 110) score += 1;
  else if (input.systolicBP >= 111 && input.systolicBP <= 219) score += 0;
  else if (input.systolicBP >= 220) score += 3;

  // 4. Heart Rate (bpm)
  if (input.heartRate <= 40) score += 3;
  else if (input.heartRate >= 41 && input.heartRate <= 50) score += 1;
  else if (input.heartRate >= 51 && input.heartRate <= 90) score += 0;
  else if (input.heartRate >= 91 && input.heartRate <= 110) score += 1;
  else if (input.heartRate >= 111 && input.heartRate <= 130) score += 2;
  else if (input.heartRate >= 131) score += 3;

  // 5. Temperature (°C)
  if (input.temperature <= 35.0) score += 3;
  else if (input.temperature >= 35.1 && input.temperature <= 36.0) score += 1;
  else if (input.temperature >= 36.1 && input.temperature <= 38.0) score += 0;
  else if (input.temperature >= 38.1 && input.temperature <= 39.0) score += 1;
  else if (input.temperature >= 39.1) score += 2;

  // 6. Consciousness Level
  if (input.consciousness !== 'ALERT') score += 3;

  // Determine Risk Level & Recommendations
  if (score >= 7) {
    return {
      score,
      riskLevel: 'CRITICAL',
      actionRecommendation: 'Respon Darurat! Panggil Tim Code Blue / ICU segera. Monitoring kontinu.',
      badgeColor: 'bg-rose-500 text-white'
    };
  } else if (score >= 5) {
    return {
      score,
      riskLevel: 'HIGH',
      actionRecommendation: 'Observasi ketat oleh Dokter DPJP / Perawat Senior. Evaluasi tiap 1 jam.',
      badgeColor: 'bg-orange-500 text-white'
    };
  } else if (score >= 1) {
    return {
      score,
      riskLevel: 'MEDIUM',
      actionRecommendation: 'Observasi berkala tiap 4-6 jam. Laporkan jika score naik.',
      badgeColor: 'bg-amber-500 text-white'
    };
  }

  return {
    score,
    riskLevel: 'LOW',
    actionRecommendation: 'Kondisi stabil. Monitoring rutin setiap shift (8 jam).',
    badgeColor: 'bg-emerald-500 text-white'
  };
}
