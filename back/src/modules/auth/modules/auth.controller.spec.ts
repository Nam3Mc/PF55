import { Test, TestingModule } from '@nestjs/testing';
import { Modules\authController } from './modules\auth.controller';
import { Modules\authService } from './modules\auth.service';

describe('Modules\authController', () => {
  let controller: Modules\authController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Modules\authController],
      providers: [Modules\authService],
    }).compile();

    controller = module.get<Modules\authController>(Modules\authController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
