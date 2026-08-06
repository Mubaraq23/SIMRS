import { create } from 'zustand';
import {
  UserRole,
  HospitalBranch,
  Patient,
  CpptNote,
  NursingCarePlan,
  LabOrder,
  LabTestItem,
  PacsStudy,
  BedInfo,
  MedicineStock,
  BillingInvoice,
  SatusehatTelemetry,
  MedicalStaff,
  PmkpIncident
} from '@/types/simrs';

interface HospitalStoreState {
  // Global Active Context
  activeBranch: HospitalBranch;
  activeRole: UserRole;
  themeMode: 'dark' | 'light';
  branches: HospitalBranch[];
  setBranch: (branch: HospitalBranch) => void;
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;

  // Interconnected Patient Core
  patients: Patient[];
  activePatient: Patient | null;
  setActivePatient: (patient: Patient | null) => void;
  addPatient: (patient: Patient) => void;

  // EMR & Multidisciplinary Clinical Modules
  cpptNotes: CpptNote[];
  addCpptNote: (note: CpptNote) => void;
  nursingPlans: NursingCarePlan[];
  addNursingPlan: (plan: NursingCarePlan) => void;

  // Queue & Kiosk
  activeQueueNumber: string;
  queueList: { number: string; service: string; status: 'WAITING' | 'CALLING' | 'DONE' }[];
  callQueue: (num: string) => void;

  // Interconnected Diagnostic Modules (LIS & PACS)
  labOrders: LabOrder[];
  addLabOrder: (order: LabOrder) => void;
  updateLabStatus: (id: string, status: LabOrder['status']) => void;
  updateLabResults: (id: string, results: LabTestItem[], doctorSign: string) => void;
  pacsStudies: PacsStudy[];
  activePacsStudy: PacsStudy | null;
  setActivePacsStudy: (study: PacsStudy | null) => void;
  addPacsStudy: (study: PacsStudy) => void;

  // Pharmacy & Bed Matrix
  beds: BedInfo[];
  updateBedStatus: (id: string, status: BedInfo['status']) => void;
  medicineStock: MedicineStock[];
  dispenseMedicine: (medicineId: string, qty: number) => void;

  // Interconnected Financial ERP & Billing
  billingInvoices: BillingInvoice[];
  activeInvoice: BillingInvoice | null;
  payInvoice: (invoiceId: string, paymentMethod: string) => void;
  addBillingItemToPatient: (mrn: string, item: { description: string; category: string; amount: number }) => void;

  // Interconnected SATUSEHAT & BPJS
  satusehatLogs: SatusehatTelemetry[];
  addSatusehatLog: (log: SatusehatTelemetry) => void;

  // Interconnected HR, IPSRS & PMKP
  medicalStaff: MedicalStaff[];
  pmkpIncidents: PmkpIncident[];
  addPmkpIncident: (incident: PmkpIncident) => void;

  // Inter-module Workflow Integrations
  registerAndEnqueuePatient: (patient: Patient, serviceUnit: string) => void;
  createCompleteMedicalOrder: (order: {
    mrn: string;
    doctorName: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    icd10Code: string;
    icd10Name: string;
    prescriptions?: { name: string; qty: number; price: number }[];
    labTests?: string[];
    radTests?: string[];
  }) => void;
  admitPatientToBedRoom: (mrn: string, bedId: string, dailyRate: number) => void;
}

const INITIAL_BRANCHES: HospitalBranch[] = [
  { id: 'b1', code: 'RS-001', name: 'RSUD Sehat Utama (Pusat)', city: 'Jakarta Selatan', type: 'Rumah Sakit Kelas A', satusehatOrgId: '100000123' },
  { id: 'b2', code: 'RS-002', name: 'RS Sehat Cabang Barat', city: 'Jakarta Barat', type: 'Rumah Sakit Kelas B', satusehatOrgId: '100000124' },
  { id: 'b3', code: 'RS-003', name: 'Klinik Utama Sehat', city: 'Tangerang', type: 'Klinik Pratama', satusehatOrgId: '100000125' },
];

const INITIAL_PATIENTS: Patient[] = [
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
    nik: '3171016509920003',
    name: 'Siti Aminah',
    gender: 'FEMALE',
    birthDate: '1992-09-25',
    phone: '085712345678',
    address: 'Jl. Gatot Subroto No. 12, Jakarta',
    bpjsCardNo: '0009876543210',
    allergies: ['Aspirin', 'Sulfa'],
    bloodType: 'A+',
    createdAt: '2026-08-02T10:15:00Z'
  },
  {
    id: 'p3',
    mrn: 'RM-2026-08-0003',
    nik: '3172021103780005',
    name: 'Drs. Herman Wijaya',
    gender: 'MALE',
    birthDate: '1978-03-11',
    phone: '081311223344',
    address: 'Jl. Asia Afrika No. 88, Jakarta',
    bpjsCardNo: '0005544332211',
    allergies: [],
    bloodType: 'B+',
    createdAt: '2026-08-04T14:00:00Z'
  }
];

const INITIAL_CPPT: CpptNote[] = [
  {
    id: 'c1',
    encounterId: 'enc-101',
    authorName: 'dr. Ahmad Pratama, Sp.PD',
    authorRole: 'DOKTER',
    subjective: 'Pasien mengeluh lemas, pusing berputar, dan mual sejak 2 hari yang lalu. Riwayat Hipertensi (+).',
    objective: 'Kesadaran Compos Mentis. TD 150/90 mmHg, Nadi 88x/mnt, RR 18x/mnt, Suhu 36.8 C, SpO2 98%.',
    assessment: 'Hipertensi Esensial Primer (ICD-10: I10), Suspect Vertigo Perifer (ICD-10: H81.3)',
    plan: '1. Amlodipine 10 mg 1x1 tab\n2. Betahistine Mesylate 6 mg 3x1 tab\n3. Order Hematologi Lengkap & EKG\n4. Edukasi diet rendah garam',
    vitals: {
      systolic: 150,
      diastolic: 90,
      heartRate: 88,
      respiratoryRate: 18,
      temperature: 36.8,
      spo2: 98,
      news2Score: 1,
      news2Risk: 'LOW',
      recordedAt: '2026-08-05T09:00:00Z'
    },
    icd10Code: 'I10',
    icd10Name: 'Essential (primary) hypertension',
    digitalSignatureHash: 'eSign-RSA256-a9f8e7d6c5b4a321',
    createdAt: '2026-08-05T09:15:00Z'
  }
];

const INITIAL_NURSING: NursingCarePlan[] = [
  {
    id: 'n1',
    patientId: 'p1',
    sdkiCode: 'D.0009',
    sdkiName: 'Perfusi Perifer Tidak Efektif b.d Hiperglikemia / Hipertensi',
    slkiTarget: 'L.02011 Perfusi Perifer Meningkat dalam 3x24 jam',
    sikiIntervention: 'I.02079 Perawatan Sirkulasi: Monitor TTV, kaji edema, hindari penekanan vena.',
    status: 'ACTIVE',
    nurseName: 'Ns. Ratna Sari, S.Kep',
    createdAt: '2026-08-05T09:30:00Z'
  }
];

const INITIAL_BEDS: BedInfo[] = [
  { id: 'bed-1', roomName: 'Mawar 101', classType: 'VIP', bedNumber: 'Bed A', status: 'OCCUPIED', patientName: 'Budi Santoso', dailyRate: 1200000 },
  { id: 'bed-2', roomName: 'Mawar 101', classType: 'VIP', bedNumber: 'Bed B', status: 'AVAILABLE', dailyRate: 1200000 },
  { id: 'bed-3', roomName: 'Anggrek 201', classType: 'KELAS_1', bedNumber: 'Bed A', status: 'OCCUPIED', patientName: 'Siti Aminah', dailyRate: 750000 },
  { id: 'bed-4', roomName: 'Anggrek 201', classType: 'KELAS_1', bedNumber: 'Bed B', status: 'CLEANING', dailyRate: 750000 },
  { id: 'bed-5', roomName: 'ICU Utama', classType: 'ICU', bedNumber: 'Bed ICU-01', status: 'OCCUPIED', patientName: 'Drs. Herman Wijaya', dailyRate: 3500000 },
  { id: 'bed-6', roomName: 'ICU Utama', classType: 'ICU', bedNumber: 'Bed ICU-02', status: 'AVAILABLE', dailyRate: 3500000 },
];

const INITIAL_MEDICINES: MedicineStock[] = [
  {
    id: 'm1',
    kfaCode: '93000123',
    name: 'Amlodipine Besylate 10 mg Tablet',
    category: 'CARDIAC',
    batchNo: 'BATCH-2026-01A',
    stockQty: 2450,
    unit: 'Tablet',
    expiryDate: '2027-12-31',
    purchasePrice: 450,
    sellingPrice: 1200,
    reorderPoint: 500,
    venCategory: 'VITAL',
    abcCategory: 'A'
  },
  {
    id: 'm2',
    kfaCode: '93000456',
    name: 'Amoxicillin Trihydrate 500 mg Kaplet',
    category: 'ANTIBIOTIC',
    batchNo: 'BATCH-2026-02B',
    stockQty: 180,
    unit: 'Kaplet',
    expiryDate: '2026-09-15',
    purchasePrice: 600,
    sellingPrice: 1800,
    reorderPoint: 300,
    venCategory: 'VITAL',
    abcCategory: 'A'
  },
  {
    id: 'm3',
    kfaCode: '93000789',
    name: 'Paracetamol 500 mg Tablet',
    category: 'ANALGESIC',
    batchNo: 'BATCH-2026-03C',
    stockQty: 5400,
    unit: 'Tablet',
    expiryDate: '2028-05-20',
    purchasePrice: 200,
    sellingPrice: 500,
    reorderPoint: 1000,
    venCategory: 'ESSENTIAL',
    abcCategory: 'B'
  }
];

const INITIAL_STAFF: MedicalStaff[] = [
  {
    id: 'st-1',
    name: 'dr. Ahmad Pratama, Sp.PD',
    role: 'DOKTER',
    strNumber: 'STR-31.1.1.100.2.19.123456',
    strExpiry: '2028-11-20',
    sipNumber: 'SIP-503/449/DOKTER/2024',
    sipExpiry: '2026-09-01',
    department: 'Poliklinik Penyakit Dalam',
    status: 'EXPIRED_WARNING'
  },
  {
    id: 'st-2',
    name: 'Ns. Ratna Sari, S.Kep',
    role: 'PERAWAT',
    strNumber: 'STR-31.2.2.200.3.20.654321',
    strExpiry: '2027-04-15',
    sipNumber: 'SIK-440/112/PERAWAT/2023',
    sipExpiry: '2027-04-15',
    department: 'Rawat Inap Mawar',
    status: 'ACTIVE'
  }
];

const INITIAL_INVOICES: BillingInvoice[] = [
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

export const useHospitalStore = create<HospitalStoreState>((set) => ({
  activeBranch: INITIAL_BRANCHES[0],
  activeRole: 'DOKTER',
  themeMode: 'dark',
  branches: INITIAL_BRANCHES,
  setBranch: (branch) => set({ activeBranch: branch }),
  setRole: (role) => set({ activeRole: role }),
  toggleTheme: () => set((state) => ({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' })),

  patients: INITIAL_PATIENTS,
  activePatient: INITIAL_PATIENTS[0],
  setActivePatient: (patient) => set({ activePatient: patient }),
  addPatient: (patient) => set((state) => ({ patients: [patient, ...state.patients] })),

  cpptNotes: INITIAL_CPPT,
  addCpptNote: (note) => set((state) => ({ cpptNotes: [note, ...state.cpptNotes] })),
  nursingPlans: INITIAL_NURSING,
  addNursingPlan: (plan) => set((state) => ({ nursingPlans: [plan, ...state.nursingPlans] })),

  activeQueueNumber: 'A-012',
  queueList: [
    { number: 'A-010', service: 'Poli Penyakit Dalam', status: 'DONE' },
    { number: 'A-011', service: 'Poli Penyakit Dalam', status: 'DONE' },
    { number: 'A-012', service: 'Poli Penyakit Dalam', status: 'CALLING' },
    { number: 'A-013', service: 'Poli Penyakit Dalam', status: 'WAITING' },
    { number: 'B-005', service: 'Poli Jantung', status: 'WAITING' }
  ],
  callQueue: (num) =>
    set((state) => ({
      activeQueueNumber: num,
      queueList: state.queueList.map((q) => (q.number === num ? { ...q, status: 'CALLING' } : q))
    })),

  labOrders: [
    {
      id: 'lab-1',
      encounterId: 'enc-101',
      patientName: 'Budi Santoso',
      mrn: 'RM-2026-08-0001',
      testName: 'Hematologi Lengkap (LOINC: 58410-2)',
      loincCode: '58410-2',
      status: 'VALIDATED',
      sampleBarcode: 'LAB-20260805-091',
      results: [
        { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', refRange: '13.2 - 17.3', isAbnormal: false, isPanicValue: false },
        { parameter: 'Leukosit', value: '11.8', unit: '10^3/uL', refRange: '3.8 - 10.6', isAbnormal: true, isPanicValue: false },
        { parameter: 'Trombosit', value: '245', unit: '10^3/uL', refRange: '150 - 440', isAbnormal: false, isPanicValue: false }
      ],
      technicianName: 'Analisis Sinta, A.Md.AK',
      doctorSignName: 'dr. Sp.PK Budi, M.Kes',
      createdAt: '2026-08-05T09:30:00Z'
    }
  ],
  addLabOrder: (order) => set((state) => ({ labOrders: [order, ...state.labOrders] })),
  updateLabStatus: (id, status) =>
    set((state) => ({
      labOrders: state.labOrders.map((o) => (o.id === id ? { ...o, status } : o))
    })),
  updateLabResults: (id, results, doctorSign) =>
    set((state) => ({
      labOrders: state.labOrders.map((o) =>
        o.id === id ? { ...o, results, doctorSignName: doctorSign, status: 'VALIDATED' } : o
      )
    })),

  pacsStudies: [
    {
      id: 'pacs-1',
      radOrderId: 'rad-101',
      patientName: 'Budi Santoso',
      mrn: 'RM-2026-08-0001',
      modality: 'X-RAY',
      bodyPart: 'Thorax PA View',
      studyDate: '2026-08-05 10:00',
      dicomFrames: ['/dicom/chest1.jpg'],
      status: 'REPORTED',
      findings: 'Cor tak membesar, CTR < 50%. Pulmo: tampak infiltrat di lobus kanan bawah. Sinus kostofrenikus kanan tumpul.',
      impression: 'Gambaran Bronkopneumonia Lobus Dextra. Cardiomegaly (-).',
      radiologistName: 'dr. Maya Sp.Rad'
    }
  ],
  activePacsStudy: null,
  setActivePacsStudy: (study) => set({ activePacsStudy: study }),
  addPacsStudy: (study) => set((state) => ({ pacsStudies: [study, ...state.pacsStudies] })),

  beds: INITIAL_BEDS,
  updateBedStatus: (id, status) =>
    set((state) => ({
      beds: state.beds.map((b) => (b.id === id ? { ...b, status } : b))
    })),

  medicineStock: INITIAL_MEDICINES,
  dispenseMedicine: (medicineId, qty) =>
    set((state) => ({
      medicineStock: state.medicineStock.map((m) =>
        m.id === medicineId ? { ...m, stockQty: Math.max(0, m.stockQty - qty) } : m
      )
    })),

  billingInvoices: INITIAL_INVOICES,
  activeInvoice: INITIAL_INVOICES[0],
  payInvoice: (invoiceId, paymentMethod) =>
    set((state) => ({
      billingInvoices: state.billingInvoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: 'PAID', paymentMethod: paymentMethod as any } : inv
      )
    })),
  addBillingItemToPatient: (mrn, newItem) =>
    set((state) => {
      const existingInv = state.billingInvoices.find((inv) => inv.mrn === mrn);
      if (existingInv) {
        const updatedItems = [...existingInv.items, newItem];
        const newTotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
        const newPayable = Math.max(0, newTotal - existingInv.bpjsCovered);
        return {
          billingInvoices: state.billingInvoices.map((inv) =>
            inv.mrn === mrn
              ? { ...inv, items: updatedItems, totalAmount: newTotal, patientPayable: newPayable }
              : inv
          )
        };
      } else {
        const newInv: BillingInvoice = {
          id: `inv-${Date.now()}`,
          invoiceNo: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          mrn,
          patientName: state.patients.find((p) => p.mrn === mrn)?.name || 'Pasien Baru',
          items: [newItem],
          totalAmount: newItem.amount,
          bpjsCovered: 0,
          patientPayable: newItem.amount,
          status: 'UNPAID',
          createdAt: new Date().toISOString()
        };
        return { billingInvoices: [newInv, ...state.billingInvoices] };
      }
    }),

  satusehatLogs: [
    { id: 'sat-1', resourceType: 'Patient', resourceId: 'p1', satusehatId: 'P-1000982', status: 'SUCCESS', syncTime: '2026-08-05 08:31', httpCode: 200 },
    { id: 'sat-2', resourceType: 'Encounter', resourceId: 'enc-101', satusehatId: 'ENC-887123', status: 'SUCCESS', syncTime: '2026-08-05 09:05', httpCode: 201 },
    { id: 'sat-3', resourceType: 'Condition', resourceId: 'c1', satusehatId: 'COND-44129', status: 'SUCCESS', syncTime: '2026-08-05 09:16', httpCode: 201 }
  ],
  addSatusehatLog: (log) => set((state) => ({ satusehatLogs: [log, ...state.satusehatLogs] })),

  medicalStaff: INITIAL_STAFF,
  pmkpIncidents: [
    {
      id: 'pmkp-1',
      incidentNo: 'INC-2026-004',
      incidentType: 'KNC',
      title: 'Near Miss KNC: Pasien hampir menerima obat Alergi Penicillin',
      location: 'Depo Farmasi Rawat Inap',
      reportedDate: '2026-08-04',
      status: 'CAPA_DONE',
      severity: 'MODERATE'
    }
  ],
  addPmkpIncident: (incident) => set((state) => ({ pmkpIncidents: [incident, ...state.pmkpIncidents] })),

  // Inter-module Workflow Integrations Implementation
  registerAndEnqueuePatient: (newPatient, serviceUnit) =>
    set((state) => {
      const qNum = `A-${Math.floor(100 + Math.random() * 900)}`;
      const newQueueItem = { number: qNum, service: serviceUnit, status: 'WAITING' as const };
      const satLog: SatusehatTelemetry = {
        id: `sat-${Date.now()}`,
        resourceType: 'Patient',
        resourceId: newPatient.id,
        satusehatId: `P-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'SUCCESS',
        syncTime: new Date().toLocaleTimeString('id-ID'),
        httpCode: 201
      };
      const regFee = { description: `Pendaftaran Admisi Pasien Baru (${serviceUnit})`, category: 'Registration', amount: 50000 };
      const existingInv = state.billingInvoices.find((inv) => inv.mrn === newPatient.mrn);
      let updatedInvoices = state.billingInvoices;
      if (existingInv) {
        updatedInvoices = state.billingInvoices.map((inv) =>
          inv.mrn === newPatient.mrn ? { ...inv, items: [...inv.items, regFee], totalAmount: inv.totalAmount + 50000, patientPayable: inv.patientPayable + 50000 } : inv
        );
      } else {
        const newInv: BillingInvoice = {
          id: `inv-${Date.now()}`,
          invoiceNo: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          mrn: newPatient.mrn,
          patientName: newPatient.name,
          items: [regFee],
          totalAmount: 50000,
          bpjsCovered: newPatient.bpjsCardNo ? 50000 : 0,
          patientPayable: newPatient.bpjsCardNo ? 0 : 50000,
          status: 'UNPAID',
          createdAt: new Date().toISOString()
        };
        updatedInvoices = [newInv, ...state.billingInvoices];
      }
      return {
        patients: [newPatient, ...state.patients],
        activePatient: newPatient,
        queueList: [newQueueItem, ...state.queueList],
        satusehatLogs: [satLog, ...state.satusehatLogs],
        billingInvoices: updatedInvoices
      };
    }),

  createCompleteMedicalOrder: ({ mrn, doctorName, subjective, objective, assessment, plan, icd10Code, icd10Name, prescriptions = [], labTests = [], radTests = [] }) =>
    set((state) => {
      const patient = state.patients.find((p) => p.mrn === mrn) || state.activePatient;
      const patientName = patient?.name || 'Pasien';

      // 1. Add CPPT
      const cppt: CpptNote = {
        id: `c-${Date.now()}`,
        encounterId: 'enc-current',
        authorName: doctorName,
        authorRole: 'DOKTER',
        subjective,
        objective,
        assessment: `${assessment} (${icd10Code})`,
        plan,
        icd10Code,
        icd10Name,
        digitalSignatureHash: `eSign-RSA256-${Math.random().toString(36).substring(2, 10)}`,
        createdAt: new Date().toISOString()
      };

      // 2. Billing Items
      const billingItems: { description: string; category: string; amount: number }[] = [
        { description: `Jasa Medis ${doctorName}`, category: 'Doctor Fee', amount: 250000 }
      ];

      // 3. Process Prescriptions
      prescriptions.forEach((rx) => {
        billingItems.push({ description: `Obat: ${rx.name} (x${rx.qty})`, category: 'Farmasi', amount: rx.price * rx.qty });
      });

      // 4. Process Lab
      const newLabOrders: LabOrder[] = [...state.labOrders];
      if (labTests.length > 0) {
        const labItem: LabOrder = {
          id: `lab-${Date.now()}`,
          orderNo: `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          mrn,
          patientName,
          testCategory: 'Hematologi & Kimia Klinik',
          status: 'IN_PROGRESS',
          items: labTests.map((t) => ({ name: t, result: 'Diproses LIS...', normalRange: '-', unit: '-', isPanicValue: false })),
          orderedBy: doctorName,
          createdAt: new Date().toISOString()
        };
        newLabOrders.unshift(labItem);
        billingItems.push({ description: `Laboratorium: ${labTests.join(', ')}`, category: 'Penunjang Lab', amount: 350000 });
      }

      // 5. Process PACS Radiologi
      const newPacs: PacsStudy[] = [...state.pacsStudies];
      if (radTests.length > 0) {
        const radItem: PacsStudy = {
          id: `rad-${Date.now()}`,
          accessionNo: `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
          mrn,
          patientName,
          modality: 'CR',
          bodyPart: radTests[0],
          studyDate: new Date().toISOString().slice(0, 10),
          status: 'UNREAD',
          imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
          radiologistName: 'dr. Maya Sp.Rad'
        };
        newPacs.unshift(radItem);
        billingItems.push({ description: `Radiologi PACS: ${radTests.join(', ')}`, category: 'Penunjang Rad', amount: 400000 });
      }

      // 6. Update Billing
      const existingInv = state.billingInvoices.find((inv) => inv.mrn === mrn);
      let updatedInvoices = state.billingInvoices;
      if (existingInv) {
        const updatedItems = [...existingInv.items, ...billingItems];
        const newTotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
        const newPayable = Math.max(0, newTotal - existingInv.bpjsCovered);
        updatedInvoices = state.billingInvoices.map((inv) =>
          inv.mrn === mrn ? { ...inv, items: updatedItems, totalAmount: newTotal, patientPayable: newPayable } : inv
        );
      } else {
        const total = billingItems.reduce((acc, curr) => acc + curr.amount, 0);
        const newInv: BillingInvoice = {
          id: `inv-${Date.now()}`,
          invoiceNo: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
          mrn,
          patientName,
          items: billingItems,
          totalAmount: total,
          bpjsCovered: patient?.bpjsCardNo ? Math.round(total * 0.8) : 0,
          patientPayable: patient?.bpjsCardNo ? Math.round(total * 0.2) : total,
          status: 'UNPAID',
          createdAt: new Date().toISOString()
        };
        updatedInvoices = [newInv, ...state.billingInvoices];
      }

      // 7. SATUSEHAT Sync Log
      const fhirLog: SatusehatTelemetry = {
        id: `sat-${Date.now()}`,
        resourceType: 'Condition',
        resourceId: `cond-${Date.now()}`,
        satusehatId: `COND-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'SUCCESS',
        syncTime: new Date().toLocaleTimeString('id-ID'),
        httpCode: 201
      };

      return {
        cpptNotes: [cppt, ...state.cpptNotes],
        labOrders: newLabOrders,
        pacsStudies: newPacs,
        billingInvoices: updatedInvoices,
        satusehatLogs: [fhirLog, ...state.satusehatLogs]
      };
    }),

  admitPatientToBedRoom: (mrn, bedId, dailyRate) =>
    set((state) => {
      const bed = state.beds.find((b) => b.id === bedId);
      const bedName = bed ? `${bed.roomName} (${bed.bedNumber})` : 'Kamar Inap';
      const chargeItem = { description: `Akomodasi Kamar Inap: ${bedName}`, category: 'Bed Charge', amount: dailyRate };

      const updatedBeds = state.beds.map((b) => (b.id === bedId ? { ...b, status: 'OCCUPIED' as const } : b));
      const existingInv = state.billingInvoices.find((inv) => inv.mrn === mrn);
      let updatedInvoices = state.billingInvoices;
      if (existingInv) {
        const updatedItems = [...existingInv.items, chargeItem];
        const newTotal = updatedItems.reduce((acc, curr) => acc + curr.amount, 0);
        updatedInvoices = state.billingInvoices.map((inv) =>
          inv.mrn === mrn ? { ...inv, items: updatedItems, totalAmount: newTotal, patientPayable: Math.max(0, newTotal - inv.bpjsCovered) } : inv
        );
      }
      return {
        beds: updatedBeds,
        billingInvoices: updatedInvoices
      };
    })
}));
