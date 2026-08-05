// Kemenkes SATUSEHAT FHIR R4 Types

export interface FhirMeta {
  profile: string[];
}

export interface FhirCoding {
  system: string;
  code: string;
  display: string;
}

export interface FhirCodeableConcept {
  coding: FhirCoding[];
  text?: string;
}

export interface FhirIdentifier {
  use?: string;
  system: string;
  value: string;
}

export interface FhirReference {
  reference: string;
  display?: string;
}

export interface FhirPatientResource {
  resourceType: 'Patient';
  id?: string;
  meta?: FhirMeta;
  identifier: FhirIdentifier[];
  active: boolean;
  name: { use: string; text: string }[];
  telecom: { system: string; value: string; use: string }[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
}

export interface FhirEncounterResource {
  resourceType: 'Encounter';
  id?: string;
  meta?: FhirMeta;
  identifier: FhirIdentifier[];
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';
  class: FhirCoding;
  subject: FhirReference;
  participant: { individual: FhirReference }[];
  period: { start: string; end?: string };
  location?: { location: FhirReference }[];
  statusHistory?: { status: string; period: { start: string; end: string } }[];
}

export interface FhirConditionResource {
  resourceType: 'Condition';
  id?: string;
  meta?: FhirMeta;
  clinicalStatus: FhirCodeableConcept;
  category: FhirCodeableConcept[];
  code: FhirCodeableConcept; // ICD-10
  subject: FhirReference;
  encounter: FhirReference;
  recordedDate: string;
}

export interface FhirObservationResource {
  resourceType: 'Observation';
  id?: string;
  meta?: FhirMeta;
  status: 'final' | 'amended';
  category: FhirCodeableConcept[];
  code: FhirCodeableConcept; // LOINC
  subject: FhirReference;
  encounter: FhirReference;
  effectiveDateTime: string;
  valueQuantity?: { value: number; unit: string; system: string; code: string };
  component?: { code: FhirCodeableConcept; valueQuantity: { value: number; unit: string } }[];
}

export interface FhirMedicationRequestResource {
  resourceType: 'MedicationRequest';
  id?: string;
  meta?: FhirMeta;
  status: 'active' | 'completed';
  intent: 'order';
  medicationCodeableConcept: FhirCodeableConcept; // KFA Code
  subject: FhirReference;
  encounter: FhirReference;
  authoredOn: string;
  requester: FhirReference;
  dosageInstruction: { text: string }[];
}
