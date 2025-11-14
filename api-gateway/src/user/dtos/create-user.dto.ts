import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  OCCUPANT = 'OCCUPANT',
  SUPERVISEUR = 'SUPERVISEUR',
}

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe' })
  username: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.AGENT })
  role: UserRole;
}
