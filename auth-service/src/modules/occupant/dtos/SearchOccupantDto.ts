import { IsOptional, IsString, IsBooleanString, IsNumberString } from 'class-validator';

export class SearchOccupantDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBooleanString()
  active?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
