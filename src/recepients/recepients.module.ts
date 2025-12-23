import { Module } from '@nestjs/common';
import { RecepientsController } from './recepients.controller';
import { RecepientsService } from './recepients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recepient } from './entities/recepient.entity';
import { RecepientList } from './entities/recepient_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recepient, RecepientList])],
  controllers: [RecepientsController],
  providers: [RecepientsService],
  exports: [RecepientsService],
})
export class RecepientsModule {}
