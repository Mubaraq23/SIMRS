// Kemenkes SATUSEHAT FHIR R4 Transformer

import {
  FhirPatientResource,
  FhirEncounterResource,
  FhirConditionResource,
  FhirObservationResource,
  FhirMedicationRequestResource,
} from '@/types/satusehat';
import { Patient, CpptNote, VitalSigns } from '@/types/simrs';

const ORG_ID = '100000123'; // Default SATUSEHAT Hospital Organization ID

export function transformPatientToFhir(patient: Patient): FhirPatientResource {
  return {
    resourceType: 'Patient',
    meta: {
      profile: ['https://fhir.kemkes.go.id/r4/StructureDefinition/Patient']
    },
    identifier: [
      {
        use: 'official',
        system: 'https://fhir.kemkes.go.id/id/nik',
        value: patient.nik
      },
      {
        use: 'secondary',
        system: `https://fhir.kemkes.go.id/id/pasien/${ORG_ID}`,
        value: patient.mrn
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        text: patient.name
      }
    ],
    telecom: [
      {
        system: 'phone',
        value: patient.phone,
        use: 'mobile'
      }
    ],
    gender: patient.gender === 'MALE' ? 'male' : 'female',
    birthDate: patient.birthDate
  };
}

export function transformEncounterToFhir(
  encounterId: string,
  patientSatusehatId: string,
  doctorSatusehatId: string,
  locationName: string
): FhirEncounterResource {
  return {
    resourceType: 'Encounter',
    meta: {
      profile: ['https://fhir.kemkes.go.id/r4/StructureDefinition/Encounter']
    },
    identifier: [
      {
        system: `https://fhir.kemkes.go.id/id/encounter/${ORG_ID}`,
        value: encounterId
      }
    ],
    status: 'in-progress',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory'
    },
    subject: {
      reference: `Patient/${patientSatusehatId}`
    },
    participant: [
      {
        individual: {
          reference: `Practitioner/${doctorSatusehatId}`
        }
      }
    ],
    period: {
      start: new Date().toISOString()
    },
    location: [
      {
        location: {
          reference: `Location/${ORG_ID}-LOC-POLI-01`,
          display: locationName
        }
      }
    ]
  };
}

export function transformConditionToFhir(
  encounterSatusehatId: string,
  patientSatusehatId: string,
  icd10Code: string,
  icd10Name: string
): FhirConditionResource {
  return {
    resourceType: 'Condition',
    meta: {
      profile: ['https://fhir.kemkes.go.id/r4/StructureDefinition/Condition']
    },
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active',
          display: 'Active'
        }
      ]
    },
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/condition-category',
            code: 'encounter-diagnosis',
            display: 'Encounter Diagnosis'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://hl7.org/fhir/sid/icd-10',
          code: icd10Code,
          display: icd10Name
        }
      ]
    },
    subject: {
      reference: `Patient/${patientSatusehatId}`
    },
    encounter: {
      reference: `Encounter/${encounterSatusehatId}`
    },
    recordedDate: new Date().toISOString()
  };
}

export function transformObservationTtvToFhir(
  encounterSatusehatId: string,
  patientSatusehatId: string,
  vitals: VitalSigns
): FhirObservationResource {
  return {
    resourceType: 'Observation',
    meta: {
      profile: ['https://fhir.kemkes.go.id/r4/StructureDefinition/Observation']
    },
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'vital-signs',
            display: 'Vital Signs'
          }
        ]
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '85354-9',
          display: 'Blood pressure panel with all children optional'
        }
      ]
    },
    subject: {
      reference: `Patient/${patientSatusehatId}`
    },
    encounter: {
      reference: `Encounter/${encounterSatusehatId}`
    },
    effectiveDateTime: new Date().toISOString(),
    component: [
      {
        code: {
          coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }]
        },
        valueQuantity: { value: vitals.systolic, unit: 'mmHg' }
      },
      {
        code: {
          coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }]
        },
        valueQuantity: { value: vitals.diastolic, unit: 'mmHg' }
      }
    ]
  };
}
