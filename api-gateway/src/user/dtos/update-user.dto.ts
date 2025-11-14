import { ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  OCCUPANT = 'OCCUPANT',
  SUPERVISEUR = 'SUPERVISEUR',
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'new.username' })
  username?: string;

  @ApiPropertyOptional({ example: 'NewPassword123!' })
  password?: string;

  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}
