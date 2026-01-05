import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateAvailabilitySlotDto {
  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @IsUUID()
  @IsOptional()
  freelancerId?: string;

  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  dayOfWeek: number; // 0 = Domingo, 6 = Sábado

  @IsString()
  @IsNotEmpty()
  startTime: string; // Formato "HH:mm"

  @IsString()
  @IsNotEmpty()
  endTime: string; // Formato "HH:mm"

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
