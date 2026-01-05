import { IsNumber, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateRedeemPointsDto {
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsUUID()
  @IsOptional()
  rewardId?: string;
}
