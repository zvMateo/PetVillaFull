import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        ...createAppointmentDto,
        dateTime: new Date(createAppointmentDto.dateTime),
      },
      include: {
        consumer: { select: { id: true, email: true } },
        service: true,
        pet: true,
      },
    });
  }

  async findAll(filters?: { consumerId?: string; status?: AppointmentStatus }) {
    return this.prisma.appointment.findMany({
      where: {
        ...(filters?.consumerId && { consumerId: filters.consumerId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        consumer: { select: { id: true, email: true } },
        service: {
          include: {
            clinic: { select: { id: true, name: true } },
            freelancer: { select: { id: true, bio: true } },
          },
        },
        pet: true,
      },
      orderBy: { dateTime: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        consumer: { select: { id: true, email: true } },
        service: {
          include: {
            clinic: true,
            freelancer: true,
          },
        },
        pet: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.findOne(id);

    // Si se está marcando como COMPLETED, otorgar puntos
    if (
      updateAppointmentDto.status === AppointmentStatus.COMPLETED &&
      appointment.status !== AppointmentStatus.COMPLETED
    ) {
      return this.completeAppointmentWithPoints(id, appointment);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
        dateTime: updateAppointmentDto.dateTime
          ? new Date(updateAppointmentDto.dateTime)
          : undefined,
      },
      include: {
        service: true,
        pet: true,
      },
    });
  }

  /**
   * Completa una cita y otorga puntos al consumidor en una transacción
   */
  private async completeAppointmentWithPoints(
    appointmentId: string,
    appointment: Awaited<ReturnType<typeof this.findOne>>,
  ) {
    const pointsToAward = appointment.service.pointsReward;

    return this.prisma.$transaction(async (tx) => {
      // Actualizar estado de la cita
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: AppointmentStatus.COMPLETED },
        include: { service: true, pet: true },
      });

      // Otorgar puntos si el servicio los tiene
      if (pointsToAward > 0) {
        await tx.pointTransaction.create({
          data: {
            consumerId: appointment.consumerId,
            amount: pointsToAward,
            type: 'EARNED_SERVICE',
            referenceId: appointmentId,
            description: `Puntos por servicio: ${appointment.service.title}`,
          },
        });
      }

      return updatedAppointment;
    });
  }

  async cancel(id: string) {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appointment.delete({ where: { id } });
  }
}
