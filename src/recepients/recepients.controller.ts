import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RecepientsService } from './recepients.service';
import { createRecepientsListDto } from './dtos/create-recepient-list.dto';
import { CreateRecepientDto } from './dtos/create-recepient.dto';

@UseGuards(JwtAuthGuard)
@Controller('recepients')
export class RecepientsController {
  constructor(private readonly recepientsService: RecepientsService) {}

  // create recepients list
  @Post('list')
  createRecepientsList(
    @Body() createRecepientsListDto: createRecepientsListDto,
    @Req() req,
  ) {
    return this.recepientsService.createRecepientsList(
      createRecepientsListDto,
      req.user.userId,
    );
  }

  // create recepient and add to list
  @Post('add')
  createRecepient(@Body() createRecepientDto: CreateRecepientDto, @Req() req) {
    return this.recepientsService.createRecepient(
      createRecepientDto,
      req.user.userId,
    );
  }

  @Get('list')
  findRecepientListByUserId(@Req() req) {
    return this.recepientsService.findRecepientListByUserId(req.user.userId);
  }
}
