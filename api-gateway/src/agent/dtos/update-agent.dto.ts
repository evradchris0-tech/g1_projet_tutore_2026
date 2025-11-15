import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAgentDto {
  @ApiPropertyOptional()
  nom: string;

  @ApiPropertyOptional()
  prenom?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  speciality?: string;

  @ApiPropertyOptional()
  IsSupervisor?: boolean;
}
