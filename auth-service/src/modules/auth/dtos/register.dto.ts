import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../user.entity';


export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of ADMIN, AGENT, OCCUPANT, SUPERVISEUR' })
  role?: UserRole;
}
