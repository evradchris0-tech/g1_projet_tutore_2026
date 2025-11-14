import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AccessLevel {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class CreateOccupantDto {
  @ApiProperty()
  numeroChambre: string;

  @ApiProperty()
  tempPassword: string;

}
