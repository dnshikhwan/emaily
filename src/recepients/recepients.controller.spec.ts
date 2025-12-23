import { Test, TestingModule } from '@nestjs/testing';
import { RecepientsController } from './recepients.controller';

describe('RecepientsController', () => {
  let controller: RecepientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecepientsController],
    }).compile();

    controller = module.get<RecepientsController>(RecepientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
