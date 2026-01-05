import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Species } from '@prisma/client';

export class CreateMyPetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Species)
  @IsNotEmpty()
  species: Species;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
