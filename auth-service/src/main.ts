import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: [
      'https://g1-projet-tutore-2026-aedc9c.gitlab.io',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore unknown props
      forbidNonWhitelisted: true, // reject unexpected props
      transform: true, // auto-transform JSON into DTO classes
    }),
  );
  await app.listen(process.env.PORT || 3001);
  ///SIIIuuuu
}
bootstrap();
