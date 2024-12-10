import { Test, TestingModule } from '@nestjs/testing';
import { Modules\authService } from './modules\auth.service';

describe('Modules\authService', () => {
  let service: Modules\authService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Modules\authService],
    }).compile();

    service = module.get<Modules\authService>(Modules\authService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
