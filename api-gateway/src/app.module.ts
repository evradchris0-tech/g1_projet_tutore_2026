import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth/auth.controller';
import { HttpModule } from '@nestjs/axios';
import { GlobalHttpModule } from './http/http.module';
import { OccupantsController } from './occupant/occupant.controller';
import { AdminsController } from './admin/admin.controller';
import { AgentsController } from './agent/agent.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),HttpModule,GlobalHttpModule,
  ],
  controllers: [AppController, AuthController, OccupantsController, AdminsController, AgentsController, UserController],
  providers: [AppService],
})
export class AppModule {
 
}
