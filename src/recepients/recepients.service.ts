import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecepientList } from './entities/recepient_list.entity';
import { In, Repository } from 'typeorm';
import { Recepient } from './entities/recepient.entity';
import { createRecepientsListDto } from './dtos/create-recepient-list.dto';
import { CreateRecepientDto } from './dtos/create-recepient.dto';

@Injectable()
export class RecepientsService {
  constructor(
    @InjectRepository(RecepientList)
    private readonly recepientsListRepository: Repository<RecepientList>,
    @InjectRepository(Recepient)
    private readonly recepientsRepository: Repository<Recepient>,
  ) {}

  // create recepients list
  async createRecepientsList(
    createRecepientsListDto: createRecepientsListDto,
    user_id: string,
  ) {
    const { name, description } = createRecepientsListDto;

    const recepient_list = this.recepientsListRepository.create({
      name,
      description,
      user: {
        id: user_id,
      },
    });

    await this.recepientsListRepository.save(recepient_list);

    return {
      message: 'Recepient list successfully created',
      recepient_list,
    };
  }

  // create recepient and attach to a list
  async createRecepient(
    createRecepientDto: CreateRecepientDto,
    user_id: string,
  ) {
    const { list_id, name, email } = createRecepientDto;

    const recepient_list = await this.recepientsListRepository.findOne({
      where: {
        id: list_id,
        user: {
          id: user_id,
        },
      },
    });

    if (!recepient_list) throw new ForbiddenException();

    const recepient = this.recepientsRepository.create({
      recepientsList: {
        id: list_id,
      },
      name,
      email,
    });
    await this.recepientsRepository.save(recepient);
    return {
      message: 'Recepient successfully added',
      recepient,
    };
  }

  // find recepient list by lists id
  findRecepientsByListId(list_id: string[]) {
    return this.recepientsRepository.find({
      where: {
        recepientsList: In(list_id),
      },
    });
  }

  // find recepient list by user_id
  findRecepientListByUserId(user_id: string) {
    return this.recepientsListRepository.find({
      where: {
        user: {
          id: user_id,
        },
      },
      relations: {
        recepients: true,
      },
    });
  }
}
