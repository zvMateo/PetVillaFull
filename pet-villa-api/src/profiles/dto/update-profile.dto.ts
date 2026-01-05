import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';
import { CreateClinicProfileDto } from './create-clinic-profile.dto';
import { CreateFreelancerProfileDto } from './create-freelancer-profile.dto';

export class UpdateProfileDto extends PartialType(
  OmitType(CreateProfileDto, ['userId'] as const),
) {}

export class UpdateClinicProfileDto extends PartialType(
  CreateClinicProfileDto,
) {}

export class UpdateFreelancerProfileDto extends PartialType(
  OmitType(CreateFreelancerProfileDto, ['userId'] as const),
) {}
