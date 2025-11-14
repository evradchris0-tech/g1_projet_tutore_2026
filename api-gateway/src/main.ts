import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('IMMO360 API Docs')
    .setDescription('API Gateway documentation for microservices architecture')
    .setVersion('1.0')
    .addBearerAuth()         // JWT support
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
    
  await app.listen(3000);
  console.log('Gateway running on http://localhost:3000');
}
bootstrap();
