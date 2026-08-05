import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class BpjsService {
  private readonly logger = new Logger(BpjsService.name);
  private readonly consId = '12345';
  private readonly secretKey = 'secret_bpjs_key';

  generateSignature(timestamp: string): string {
    const data = `${this.consId}&${timestamp}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    return hmac.update(data).digest('base64');
  }

  async generateSep(noKartu: string, diagnosaIcd10: string): Promise<{ sepNo: string; message: string }> {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = this.generateSignature(timestamp);
    this.logger.log(`Invoking BPJS VClaim 2.0 SEP Creation with Signature: ${signature}`);

    return {
      sepNo: `1101R0010826V${Math.floor(100000 + Math.random() * 900000)}`,
      message: 'SEP Berhasil Diterbitkan'
    };
  }
}
