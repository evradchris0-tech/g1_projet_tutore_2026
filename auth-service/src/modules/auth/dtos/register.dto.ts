import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../users/user.entity';
import { AccessLevel } from '../../admin/admin.entity';


export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be one of ADMIN, AGENT, OCCUPANT' })
  role: UserRole;

  @IsOptional()
  nom?: string;

  @IsOptional()
  prenom?: string;

  @IsOptional()
  @IsEnum(AccessLevel, { message: 'Access Level must be ADMIN or SUPERADMIN' })
  access?: AccessLevel;

  @IsOptional()
  IsSupervisor?: boolean;

  @IsOptional()
  phone?: string;

  @IsOptional()
  numeroChambre?: string;

  @IsOptional()
  tempPassword?: string;

  @IsOptional()
  speciality?: string;
}
