import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateAvailabilitySlotDto, UpdateAvailabilitySlotDto } from './dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAvailabilitySlotDto) {
    if (!dto.clinicId && !dto.freelancerId) {
      throw new BadRequestException(
        'Either clinicId or freelancerId must be provided',
      );
    }

    return this.prisma.availabilitySlot.create({
      data: dto,
    });
  }

  async findByClinic(clinicId: string) {
    return this.prisma.availabilitySlot.findMany({
      where: { clinicId, isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findByFreelancer(freelancerId: string) {
    return this.prisma.availabilitySlot.findMany({
      where: { freelancerId, isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOne(id: string) {
    const slot = await this.prisma.availabilitySlot.findUnique({
      where: { id },
    });

    if (!slot) {
      throw new NotFoundException(`Availability slot with ID ${id} not found`);
    }

    return slot;
  }

  async update(id: string, dto: UpdateAvailabilitySlotDto) {
    await this.findOne(id);

    return this.prisma.availabilitySlot.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.availabilitySlot.delete({ where: { id } });
  }

  /**
   * Obtiene los horarios disponibles para un día específico
   */
  async getAvailableSlots(
    providerId: string,
    providerType: 'clinic' | 'freelancer',
    dayOfWeek: number,
  ) {
    const where =
      providerType === 'clinic'
        ? { clinicId: providerId, dayOfWeek, isActive: true }
        : { freelancerId: providerId, dayOfWeek, isActive: true };

    return this.prisma.availabilitySlot.findMany({
      where,
      orderBy: { startTime: 'asc' },
    });
  }
}
