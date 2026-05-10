import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Req } from '@nestjs/common';
import { Job } from 'bullmq';
import { CampaignsService } from 'src/campaigns/campaigns.service';
import { EmailsService } from 'src/emails/emails.service';

@Processor('send-email-campaign', { concurrency: 3 })
export class SendEmailProcessor extends WorkerHost {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly emailsService: EmailsService,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    await this.emailsService.sendMail(job.data);
  }

  @OnWorkerEvent('active')
  async onActive(job: Job) {
    console.log(`Got a new job, ${job.id}`);
  }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job) {
    await this.campaignsService.updateSentCampaignRecepient(
      job.data.campaignRecepientId,
    );
    console.log(`Job with ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, err: Error) {
    const attemptsMade = job.attemptsMade;
    const maxAttempts = job.opts.attempts ?? 1;

    console.log(
      `Job ${job.id} failed attempt ${attemptsMade}/${maxAttempts}: ${err.message}`,
    );

    if (attemptsMade >= maxAttempts) {
      await this.campaignsService.markCampaignRecepientFailed(
        job.data.campaignRecepientId,
      );
    }
  }
}
