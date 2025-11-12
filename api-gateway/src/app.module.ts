import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { GlobalHttpModule } from './http/http.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),HttpModule,GlobalHttpModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
