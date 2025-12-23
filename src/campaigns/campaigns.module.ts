import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { RecepientsModule } from 'src/recepients/recepients.module';
import { CampaignRecepient } from './entities/campaign-recepient.entity';
import { EmailsModule } from 'src/emails/emails.module';
import { BullModule } from '@nestjs/bullmq';
import { SendEmailProcessor } from './workers/send-email.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignRecepient]),
    BullModule.registerQueue({
      name: 'send-email-campaign',
    }),
    RecepientsModule,
    EmailsModule,
  ],
  providers: [CampaignsService, SendEmailProcessor],
  controllers: [CampaignsController],
  exports: [CampaignsService],
})
export class CampaignsModule {}
