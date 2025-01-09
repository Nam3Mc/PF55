import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './config/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountModule } from './modules/account/account.module';
import { PropertyModule } from './modules/property/property.module';
import { LoggingMiddleware } from './midledware/loggingMiddleware';
import { ContractModule } from './modules/contract/contract.module';
import { AmenitiesModule } from './modules/amenities/amenities.module';
import { PreloadModule } from './modules/preload/preload.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessagesModule } from './modules/messages/messages.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PaypalModule } from './modules/paypal/paypal.module';

const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


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
    AuthModule,
    AccountModule,
    PropertyModule,
    ContractModule,
    AmenitiesModule,
    PreloadModule,
    NotificationsModule,
    MessagesModule,
    PaymentsModule,
    PaypalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}
