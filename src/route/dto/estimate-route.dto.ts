import {
  IsArray,
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
} from 'class-validator';

export class EstimateRouteDto {
  @IsLatitude()
  startLatitude!: number;

  @IsLongitude()
  startLongitude!: number;

  @IsLatitude()
  endLatitude!: number;

  @IsLongitude()
  endLongitude!: number;

  @IsOptional()
  @IsBoolean()
  avoidCheckpoints?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  avoidAreas?: string[];
}