import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { AgentModule } from './modules/agent/agent.module';
import { OccupantModule } from './modules/occupant/occupant.module';
import { OccupantController } from './modules/occupant/occupant.controller';
import { AgentController } from './modules/agent/agent.controller';
import { AdminController } from './modules/admin/admin.controller';
import { AdminService } from './modules/admin/admin.service';
import { AgentService } from './modules/agent/agent.service';
import { OccupantService } from './modules/occupant/occupant.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }), AuthModule, UsersModule, AgentModule, OccupantModule, AdminModule],
  controllers: [AppController,  ],
  providers: [AppService],

})
export class AppModule {}
