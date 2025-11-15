import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AccessLevel {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class CreateAgentDto {
  @ApiProperty()
  nom: string;

  @ApiProperty()
  prenom: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  speciality: string;

  @ApiProperty()
  IsSupervisor: boolean;
}
