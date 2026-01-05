import { IsEnum, IsOptional } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto extends PartialType(
  OmitType(CreateAppointmentDto, ['consumerId', 'serviceId', 'petId'] as const),
) {
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;
}
