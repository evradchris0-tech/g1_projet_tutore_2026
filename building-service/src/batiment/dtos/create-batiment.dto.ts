import { IsString, IsEnum, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { TypeBatiment } from '../batiment.entity';

export class CreateBatimentDto {
  @IsString() nom: string;
  @IsString() code: string;
  @IsEnum(TypeBatiment) typeBatiment: TypeBatiment;
  @IsOptional() @IsString() adresse?: string;
  @IsOptional() @IsNumber() @Min(0) nombreEtage?: number;
  @IsOptional() @IsNumber() @Min(0) superficie?: number;
  @IsOptional() @IsDateString() dateConstruction?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() planBatiment?: string; // url or base64 - prefer url
  @IsOptional() @IsNumber() coordLatitude?: number;
  @IsOptional() @IsNumber() coordLongitude?: number;
  @IsOptional() @IsNumber() coordAltitude?: number;
}
