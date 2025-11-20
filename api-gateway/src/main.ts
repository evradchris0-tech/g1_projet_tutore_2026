import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule, { cors: true }); 
  // 
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',    // Angular
      'http://localhost:5173',    // React
      'http://127.0.0.1:5500',    // Static frontend
      'https://immo360.yourdomain.com', // Production frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    // exposedHeaders: 'Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('IMMO360 API Docs')
    .setDescription('API Gateway documentation for microservices architecture')
    .setVersion('1.0')
    .addBearerAuth() // JWT support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log('Gateway running on http://localhost:3000');
}
bootstrap();
