import { Test, TestingModule } from '@nestjs/testing';
import { CatFactsService } from './cat-facts.service';

describe('CatFactsService', () => {
  let service: CatFactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatFactsService],
    }).compile();

    service = module.get<CatFactsService>(CatFactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
