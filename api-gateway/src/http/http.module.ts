import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({imports: [
    HttpModule.register({
      baseURL: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
      timeout: 5000,
    }),
  ],
  exports: [HttpModule],})
export class GlobalHttpModule  {}
