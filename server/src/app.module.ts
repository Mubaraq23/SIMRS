import { Module } from '@nestjs/common';
import { SatusehatService } from './modules/satusehat/satusehat.service';
import { BpjsService } from './modules/bpjs/bpjs.service';
import { EmrService } from './modules/emr/emr.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SatusehatService, BpjsService, EmrService],
})
export class AppModule {}
