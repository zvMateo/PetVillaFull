import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreatePetDto, UpdatePetDto } from './dto';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        ...createPetDto,
        birthDate: createPetDto.birthDate
          ? new Date(createPetDto.birthDate)
          : null,
      },
      include: {
        owner: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.pet.findMany({
      include: {
        owner: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, email: true },
        },
        appointments: {
          take: 5,
          orderBy: { dateTime: 'desc' },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.pet.findMany({
      where: { ownerId },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, updatePetDto: UpdatePetDto) {
    await this.findOne(id);

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...updatePetDto,
        birthDate: updatePetDto.birthDate
          ? new Date(updatePetDto.birthDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pet.delete({ where: { id } });
  }
}
