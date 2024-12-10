import { Module } from '@nestjs/common';
import { Modules\authService } from './modules\auth.service';
import { Modules\authController } from './modules\auth.controller';

@Module({
  controllers: [Modules\authController],
  providers: [Modules\authService],
})
export class Modules\authModule {}
