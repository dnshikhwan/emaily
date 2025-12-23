import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dtos/create-campaign.dto';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // create
  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto, @Req() req) {
    return this.campaignsService.create(
      createCampaignDto,
      req.user.userId,
      req.user.email,
    );
  }
}
