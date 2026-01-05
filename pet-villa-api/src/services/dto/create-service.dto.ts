import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @IsUUID()
  @IsOptional()
  freelancerId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  priceFrom?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  duration?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  pointsReward?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
