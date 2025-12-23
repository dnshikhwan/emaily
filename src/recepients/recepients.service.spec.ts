import { Test, TestingModule } from '@nestjs/testing';
import { RecepientsService } from './recepients.service';

describe('RecepientsService', () => {
  let service: RecepientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecepientsService],
    }).compile();

    service = module.get<RecepientsService>(RecepientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
