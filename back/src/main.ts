import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { PreloadServices } from './modules/preload/preload.service';
import { MessageService } from './modules/messages/messages.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const messageService = app.get(MessageService);

  // Configurar la adaptador WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // Obtener el servidor HTTP de NestJS
  const httpServer = app.getHttpServer();

  // Configurar el servidor Socket.IO usando MessageService
  messageService.setServer(httpServer);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RentaFacil')
    .setDescription('This is RentaFacil Backend')
    .setVersion('3.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
     },
    'AuthGuard'
     )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Documents backend RentaFacil',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const preloadServices = app.get(PreloadServices);
  try {
    await preloadServices.onApplicationBootstrap();
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }

  app.enableCors({
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicación ejecutándose en el puerto ${process.env.PORT ?? 3000}`);
}

bootstrap();
