import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAvailabilitySlotDto } from './create-availability-slot.dto';

export class UpdateAvailabilitySlotDto extends PartialType(
  OmitType(CreateAvailabilitySlotDto, ['clinicId', 'freelancerId'] as const),
) {}
