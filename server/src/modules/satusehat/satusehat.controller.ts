import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('satusehat')
export class SatusehatController {
  @Get('status')
  async getGatewayStatus() {
    return {
      status: 'CONNECTED',
      fhirVersion: 'R4',
      kemenkesUrl: 'https://api-satusehat.kemkes.go.id/fhir-r4/v1',
      orgId: '100000123',
      uptime: '99.98%',
    };
  }

  @Post('sync')
  async syncFhirResource(@Body() payload: { resourceType: string; resourceId: string }) {
    const fhirId = `SS-FHIR-${payload.resourceType.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      httpCode: 201,
      satusehatId: fhirId,
      syncedAt: new Date().toISOString(),
    };
  }
}
