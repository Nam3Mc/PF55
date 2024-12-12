import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/config';
import { UserModule } from './modules/user/user.module';
import { AccountModule } from './modules/account/account.module';
import { PropertyModule } from './modules/property/property.module';
import { ImageModule } from './modules/image/image.module';

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
    UserModule,
    AccountModule,
    PropertyModule,
    ImageModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
