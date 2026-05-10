import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './entities/campaign.entity';
import { Repository } from 'typeorm';
import { CreateCampaignDto } from './dtos/create-campaign.dto';
import { RecepientsService } from 'src/recepients/recepients.service';
import {
  CampaignRecepient,
  Status,
} from './entities/campaign-recepient.entity';
import { EmailsService } from 'src/emails/emails.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailJobData } from './interfaces/email-job-data.interface';
import {
  CampaignPriority,
  PRIORITY_VALUES,
} from './types/campaign-priority.enum';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignsRepository: Repository<Campaign>,
    @InjectRepository(CampaignRecepient)
    private readonly campaignRecepientRepository: Repository<CampaignRecepient>,
    private readonly recepientsService: RecepientsService,
    @InjectQueue('send-email-campaign') private readonly sendEmailQueue: Queue,
  ) {}

  // create
  async create(
    createCampaignDto: CreateCampaignDto,
    user_id: string,
    email: string,
  ) {
    const { name, subject, body, recepient_list_id, priority } =
      createCampaignDto;

    // create campaign entity
    const campaign = this.campaignsRepository.create({
      name,
      subject,
      body,
      user: {
        id: user_id,
      },
    });
    // save campaign entity
    await this.campaignsRepository.save(campaign);

    // find list with list_id
    const recepients =
      await this.recepientsService.findRecepientsByListId(recepient_list_id);
    if (recepients.length === 0)
      throw new BadRequestException(
        'No recepients found in the recepients list',
      );

    // create campaign_recepients with all the recepient in the list
    const campaignRecepients = recepients.map((recepient) => ({
      campaign: {
        id: campaign.id,
      },
      recepient: {
        id: recepient.id,
      },
    }));

    // save campaign_recepient entity

    const savedCampaignRecepients =
      await this.campaignRecepientRepository.save(campaignRecepients);

    const priorityValue = PRIORITY_VALUES[priority ?? CampaignPriority.NORMAL];

    // send email process to queue
    for (let index = 0; index < campaignRecepients.length; index++) {
      // send job to queue
      const jobData: EmailJobData = {
        campaignId: savedCampaignRecepients[index].campaign.id,
        campaignRecepientId: savedCampaignRecepients[index].id,
        recepientEmail: recepients[index].email,
        recepientName: recepients[index].name,
        senderEmail: email,
        subject,
        body,
      };

      await this.sendEmailQueue.add('process-send-email', jobData, {
        priority: priorityValue,
      });
    }

    return {
      message: 'Campaign successfully created',
      campaign,
    };
  }

  findCampaignRecepientById(id: string) {
    return this.campaignRecepientRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateSentCampaignRecepient(id: string) {
    const campaign_recepient = await this.findCampaignRecepientById(id);
    if (!campaign_recepient)
      throw new NotFoundException("Campaign's recepient not found");

    await this.campaignRecepientRepository.update(
      {
        id,
      },
      {
        status: Status.SENT,
      },
    );
  }

  async markCampaignRecepientFailed(id: string) {
    await this.campaignRecepientRepository.update(
      { id },
      { status: Status.FAILED },
    );
  }
}
