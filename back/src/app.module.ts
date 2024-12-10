import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { AccountModule } from './modules/account/account/account.module';
import { Modules\authModule } from './modules/auth/modules/auth.module';
import typeorm from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('typeorm'),
      }),
    }),
    AccountModule,
    Modules\authModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
