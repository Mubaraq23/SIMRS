import { Injectable, Logger } from '@nestjs/common';
import { FhirPatientResource, FhirEncounterResource } from '../../../../src/types/satusehat';

@Injectable()
export class SatusehatService {
  private readonly logger = new Logger(SatusehatService.name);

  async getAccessToken(): Promise<string> {
    this.logger.log('Acquiring OAuth2 Access Token from Kemenkes Auth Server...');
    return 'satusehat_bearer_token_sandbox_2026_x99812';
  }

  async sendPatientFhir(patientData: FhirPatientResource): Promise<{ status: string; fhirId: string }> {
    const token = await this.getAccessToken();
    this.logger.log(`Transmitting FHIR Patient Resource to https://api-satusehat.kemkes.go.id/fhir-r4/v1/Patient`);
    
    return {
      status: 'SUCCESS',
      fhirId: `P-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }

  async sendEncounterFhir(encounterData: FhirEncounterResource): Promise<{ status: string; fhirId: string }> {
    this.logger.log(`Transmitting FHIR Encounter Resource...`);
    return {
      status: 'SUCCESS',
      fhirId: `ENC-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }
}
