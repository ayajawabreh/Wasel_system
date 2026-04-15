import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsNotEmpty,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncidentDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  checkpoint_id?: number;

  @IsString()
  @IsIn(['accident', 'roadwork', 'blockage', 'hazard'])
  type!: string;

  @IsString()
  @IsIn(['low', 'medium', 'high'])
  severity!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}