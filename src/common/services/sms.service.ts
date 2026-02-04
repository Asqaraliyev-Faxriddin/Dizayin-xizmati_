import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '../node-mailer/mailer.service';

@Injectable()
export class SmsService {
    constructor(private mailerService:MailerService){}

    public async sendSMS(message: string, to: string,code:string) {
        try {
         
    
            await this.mailerService.createEmail({email:to,subject:'SMS Verification',code});
    
          return true;
        } catch (err) {
          throw new HttpException(
            'SMS yuborishda xatolik: ' + (err?.response?.data?.message || 'Unknown error'),
            err?.response?.status || HttpStatus.BAD_REQUEST,
          );
        }
      }
}
