import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOccupantDto {
  @ApiPropertyOptional()
  numeroChambre?: string;

  @ApiPropertyOptional()
  tempPassword?: string;

}
