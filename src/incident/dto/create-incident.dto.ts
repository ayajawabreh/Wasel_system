import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateIncidentDto {
  @IsOptional()
  @IsNumber()
  checkpoint_id?: number;

  @IsString()
  type!: string;

  @IsString()
  severity!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}