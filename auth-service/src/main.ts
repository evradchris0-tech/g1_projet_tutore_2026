import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore unknown props
      forbidNonWhitelisted: true, // reject unexpected props
      transform: true, // auto-transform JSON into DTO classes
    }),
  );
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
