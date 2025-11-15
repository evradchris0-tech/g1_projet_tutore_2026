import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  OCCUPANT = 'OCCUPANT',
  SUPERVISEUR = 'SUPERVISEUR',
}

export enum AccessLevel {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class RegisterDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;

  @IsEnum(UserRole, { message: 'Role must be one of ADMIN, AGENT, OCCUPANT' })
  role: UserRole;

  @ApiPropertyOptional()
  nom?: string;

  @ApiPropertyOptional()
  prenom?: string;

  @ApiPropertyOptional()
  @IsEnum(AccessLevel, { message: 'Access Level must be ADMIN or SUPERADMIN' })
  access?: AccessLevel;

  @ApiPropertyOptional()
  IsSupervisor?: boolean;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  numeroChambre?: string;

  @ApiPropertyOptional()
  tempPassword?: string;

  @ApiPropertyOptional()
  speciality?: string;
}
