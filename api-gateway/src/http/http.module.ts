import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: config.get('AUTH_SERVICE_URL'),
        timeout: 5000,
      }),
    }),
  ],
  exports: [HttpModule],})
export class GlobalHttpModule  {}
