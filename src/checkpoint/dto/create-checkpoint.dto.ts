import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCheckpointDto {
  @IsString()
  name!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  current_status?: string;
}