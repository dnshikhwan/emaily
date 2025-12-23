import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Req } from '@nestjs/common';
import { type EmailJobData } from 'src/campaigns/interfaces/email-job-data.interface';

@Injectable()
export class EmailsService {
  constructor(private readonly mailService: MailerService) {}

  // send email
  async sendMail(data: EmailJobData) {
    await this.mailService.sendMail({
      from: data.senderEmail,
      to: data.recepientEmail,
      subject: data.subject,
      text: data.body,
    });
  }
}
