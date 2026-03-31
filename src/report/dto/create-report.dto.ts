import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  category: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  status: string;
}