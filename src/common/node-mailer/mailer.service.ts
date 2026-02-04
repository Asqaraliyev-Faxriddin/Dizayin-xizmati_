import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

// mailer.service.ts
@Injectable()
export class MailerService {
  constructor(
    private readonly NewMailerService: NestMailerService
  ) {}

  async createEmail(payload: {
    email: string;
    subject: string;
    code: string;
  }) {
    const { email, subject, code } = payload;

    await this.NewMailerService.sendMail({
      to: email,
      subject,
      template: 'index',
      context: {
        code,
        year: new Date().getFullYear(),
      },
    });
  }
}
