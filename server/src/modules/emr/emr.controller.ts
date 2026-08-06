import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmrService } from './emr.service';

@Controller('emr')
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  @Post('cppt')
  async createCppt(@Body() cpptData: any) {
    return this.emrService.createCpptRecord(cpptData);
  }

  @Get('patient/:mrn')
  async getPatientEmrHistory(@Param('mrn') mrn: string) {
    return {
      mrn,
      status: 'ACTIVE',
      totalRecords: 12,
      lastUpdated: new Date().toISOString(),
    };
  }
}
