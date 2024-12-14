import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("RentaFacil")
    .setDescription("This is RentaFacil Backend")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Documents backend RentaFacil',
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
