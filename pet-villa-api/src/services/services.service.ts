import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    if (!dto.clinicId && !dto.freelancerId) {
      throw new BadRequestException(
        'Either clinicId or freelancerId must be provided',
      );
    }

    return this.prisma.service.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priceFrom: dto.priceFrom ? new Prisma.Decimal(dto.priceFrom) : null,
        duration: dto.duration,
        pointsReward: dto.pointsReward ?? 0,
        isActive: dto.isActive ?? true,
        ...(dto.clinicId && { clinic: { connect: { id: dto.clinicId } } }),
        ...(dto.freelancerId && {
          freelancer: { connect: { id: dto.freelancerId } },
        }),
      },
      include: {
        clinic: true,
        freelancer: true,
      },
    });
  }

  async findAll(category?: string) {
    const where = category ? { category, isActive: true } : { isActive: true };

    return this.prisma.service.findMany({
      where,
      include: {
        clinic: true,
        freelancer: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        clinic: true,
        freelancer: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async findByClinic(clinicId: string) {
    return this.prisma.service.findMany({
      where: { clinicId, isActive: true },
    });
  }

  async findByFreelancer(freelancerId: string) {
    return this.prisma.service.findMany({
      where: { freelancerId, isActive: true },
    });
  }

  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);

    return this.prisma.service.update({
      where: { id },
      data: {
        ...dto,
        priceFrom: dto.priceFrom
          ? new Prisma.Decimal(dto.priceFrom)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.delete({ where: { id } });
  }

  async getCategories() {
    const services = await this.prisma.service.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return services.map((s) => s.category);
  }
}
