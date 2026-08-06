export interface MedicalAuditLog {
  id: string;
  timestamp: string;
  userRole: string;
  action: 'READ_EMR' | 'CREATE_CPPT' | 'UPDATE_CPPT' | 'DISPENSE_MEDICINE' | 'VIEW_LAB_RESULTS' | 'PRINT_DOCUMENT';
  mrn: string;
  patientName: string;
  details: string;
  ipAddress: string;
}

const auditLogsStore: MedicalAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-06 08:30:12',
    userRole: 'DOKTER',
    action: 'CREATE_CPPT',
    mrn: 'RM-2026-08-0001',
    patientName: 'Budi Santoso',
    details: 'Penambahan CPPT SOAP & Rekomendasi ICD-10 I10',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-06 08:35:40',
    userRole: 'KASIR',
    action: 'PRINT_DOCUMENT',
    mrn: 'RM-2026-08-0001',
    patientName: 'Budi Santoso',
    details: 'Cetak Kwitansi Kuitansi Lunas INV-20260806-009',
    ipAddress: '192.168.1.88'
  }
];

export function logMedicalActivity(log: Omit<MedicalAuditLog, 'id' | 'timestamp' | 'ipAddress'>): MedicalAuditLog {
  const newLog: MedicalAuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('id-ID'),
    ipAddress: '192.168.1.100'
  };
  auditLogsStore.unshift(newLog);
  console.log(`[PERMENKES 24/2022 AUDIT LOG] ${newLog.timestamp} | ${newLog.userRole} | ${newLog.action} | Pasien: ${newLog.mrn}`);
  return newLog;
}

export function getAuditLogs(): MedicalAuditLog[] {
  return auditLogsStore;
}
