// SIMRS Enterprise Core Types

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'DIREKTUR'
  | 'DOKTER'
  | 'PERAWAT'
  | 'APOTEKER'
  | 'PETUGAS_LAB'
  | 'RADIOGRAFER'
  | 'KASIR'
  | 'PETUGAS_PENDAFTARAN'
  | 'MANAJER_SDM'
  | 'PETUGAS_IPSRS';

export type TriagePriority = 'P1_EMERGENCY' | 'P2_URGENT' | 'P3_NON_URGENT' | 'P0_DECEASED';

export interface HospitalBranch {
  id: string;
  code: string;
  name: string;
  city: string;
  type: string;
  satusehatOrgId: string;
}

export interface Patient {
  id: string;
  mrn: string; // RM-2026-08-0012
  nik: string; // 3171012345670001
  name: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  phone: string;
  address: string;
  bpjsCardNo?: string;
  allergies: string[];
  bloodType: 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-';
  createdAt: string;
}

export interface VitalSigns {
  systolic: number;
  diastolic: number;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  spo2: number;
  news2Score: number;
  news2Risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recordedAt: string;
}

export interface CpptNote {
  id: string;
  encounterId: string;
  authorName: string;
  authorRole: UserRole;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  vitals?: VitalSigns;
  icd10Code?: string;
  icd10Name?: string;
  icd9Code?: string;
  icd9Name?: string;
  digitalSignatureHash?: string;
  createdAt: string;
}

export interface NursingCarePlan {
  id: string;
  patientId: string;
  sdkiCode: string; // Diagnosa Keperawatan Indonesia
  sdkiName: string;
  slkiTarget: string; // Luaran Keperawatan Indonesia
  sikiIntervention: string; // Intervensi Keperawatan
  status: 'ACTIVE' | 'RESOLVED';
  nurseName: string;
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  kfaCode: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  price: number;
  batchNo: string;
  expiryDate: string;
  isRacikan: boolean;
  racikanComposition?: string;
}

export interface LabTestItem {
  parameter: string;
  value: string;
  unit: string;
  refRange: string;
  isAbnormal: boolean;
  isPanicValue: boolean;
}

export interface LabOrder {
  id: string;
  encounterId: string;
  patientName: string;
  mrn: string;
  testName: string;
  loincCode: string;
  status: 'REQUESTED' | 'SAMPLE_TAKEN' | 'TESTING' | 'VALIDATED' | 'COMPLETED';
  sampleBarcode: string;
  results: LabTestItem[];
  technicianName?: string;
  doctorSignName?: string;
  createdAt: string;
}

export interface PacsStudy {
  id: string;
  radOrderId: string;
  patientName: string;
  mrn: string;
  modality: 'CT-SCAN' | 'MRI' | 'X-RAY' | 'ULTRASOUND';
  bodyPart: string;
  studyDate: string;
  dicomFrames: string[]; // Mock DICOM canvas frames
  status: 'SCHEDULED' | 'CAPTURED' | 'REPORTED';
  findings?: string;
  impression?: string;
  radiologistName?: string;
}

export interface BedInfo {
  id: string;
  roomName: string;
  classType: 'VVIP' | 'VIP' | 'KELAS_1' | 'KELAS_2' | 'KELAS_3' | 'ICU' | 'NICU' | 'ISOLASI';
  bedNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';
  patientName?: string;
  dailyRate: number;
}

export interface MedicineStock {
  id: string;
  kfaCode: string;
  name: string;
  category: 'ANTIBIOTIC' | 'ANALGESIC' | 'CARDIAC' | 'EMERGENCY' | 'BMHP';
  batchNo: string;
  stockQty: number;
  unit: string;
  expiryDate: string; // YYYY-MM-DD
  purchasePrice: number;
  sellingPrice: number;
  reorderPoint: number;
  venCategory: 'VITAL' | 'ESSENTIAL' | 'NON_ESSENTIAL';
  abcCategory: 'A' | 'B' | 'C';
}

export interface BillingInvoice {
  id: string;
  invoiceNo: string;
  mrn: string;
  patientName: string;
  items: { description: string; category: string; amount: number }[];
  totalAmount: number;
  bpjsCovered: number;
  patientPayable: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  paymentMethod?: 'CASH' | 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'CREDIT_CARD';
  createdAt: string;
}

export interface SatusehatTelemetry {
  id: string;
  resourceType: 'Patient' | 'Encounter' | 'Condition' | 'Observation' | 'MedicationRequest' | 'MedicationDispense' | 'DiagnosticReport' | 'Procedure';
  resourceId: string;
  satusehatId: string;
  status: 'SUCCESS' | 'FAILED' | 'QUEUED';
  syncTime: string;
  httpCode: number;
}

export interface MedicalStaff {
  id: string;
  name: string;
  role: UserRole;
  strNumber: string;
  strExpiry: string;
  sipNumber: string;
  sipExpiry: string;
  department: string;
  status: 'ACTIVE' | 'EXPIRED_WARNING' | 'EXPIRED';
}

export interface PmkpIncident {
  id: string;
  incidentNo: string;
  incidentType: 'SENTINEL' | 'KTD' | 'KNC' | 'KTC' | 'KPS';
  title: string;
  location: string;
  reportedDate: string;
  status: 'REPORTED' | 'RCA_IN_PROGRESS' | 'CAPA_DONE' | 'CLOSED';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
}
