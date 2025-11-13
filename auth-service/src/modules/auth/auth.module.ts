import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Admin } from '../admin/admin.entity';
import { Agent } from '../agent/agent.entity';
import { Occupant } from '../occupant/occupant.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([User, Admin, Agent, Occupant]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
