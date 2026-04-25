import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAlertSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  region!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;
}