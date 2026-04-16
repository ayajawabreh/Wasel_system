import { IsString, IsNumber, IsOptional, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateIncidentDto {
  @IsOptional()
  @IsString()
  @IsIn(['accident', 'roadwork', 'blockage', 'hazard'])
  type?: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  severity?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'resolved'])
  status?: string;

  @IsOptional()
  @IsString()
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  verified_by?: number;
}