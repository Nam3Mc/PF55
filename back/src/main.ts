import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PreloadServices } from './modules/preload/preload.service';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SocketService } from './modules/socket/socket.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const socketService = app.get(SocketService);
  
  app.useWebSocketAdapter(new IoAdapter(app));

  const httpServer = app.getHttpServer();
  
  socketService.setServer(httpServer);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RentaFacil')
    .setDescription('This is RentaFacil Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Documents backend RentaFacil',
  });

  const preloadServices = app.get(PreloadServices);
  try {
    await preloadServices.onApplicationBootstrap();
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicación ejecutándose en el puerto ${process.env.PORT ?? 3000}`);
}
bootstrap();
