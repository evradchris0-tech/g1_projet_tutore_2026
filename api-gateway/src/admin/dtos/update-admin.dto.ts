import { ApiPropertyOptional } from '@nestjs/swagger';

export enum AccessLevel {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class UpdateAdminDto {
  @ApiPropertyOptional()
  nom?: string;

  @ApiPropertyOptional()
  prenom?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  access?: AccessLevel;
}
