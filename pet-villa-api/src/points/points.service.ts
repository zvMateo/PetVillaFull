import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Otorga puntos a un usuario por completar un servicio
   * Esta función se llama cuando una cita cambia a estado COMPLETED
   */
  async awardPointsForCompletedService(
    consumerId: string,
    serviceId: string,
    appointmentId: string,
  ) {
    // Obtener el servicio para calcular los puntos (10% del valor)
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { priceFrom: true, pointsReward: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Si el servicio tiene puntosReward definidos, usar esos
    // Si no, calcular 10% del precio
    const pointsToAward =
      service.pointsReward || Math.floor(Number(service.priceFrom || 0) * 0.1);

    // Crear la transacción de puntos
    const transaction = await this.prisma.pointTransaction.create({
      data: {
        consumerId,
        amount: pointsToAward,
        type: 'EARNED_SERVICE',
        referenceId: appointmentId,
      },
    });

    return transaction;
  }

  /**
   * Canjea puntos por una recompensa
   */
  async redeemPoints(
    consumerId: string,
    pointsToRedeem: number,
    rewardId?: string,
  ) {
    // Obtener el saldo actual de puntos del usuario
    const currentBalance = await this.getUserPointsBalance(consumerId);

    if (currentBalance < pointsToRedeem) {
      throw new NotFoundException('Insufficient points');
    }

    // Crear transacción de redención
    const transaction = await this.prisma.pointTransaction.create({
      data: {
        consumerId,
        amount: -pointsToRedeem, // Negativo porque es un gasto
        type: 'REDEEMED_REWARD',
        referenceId: rewardId,
      },
    });

    return transaction;
  }

  /**
   * Obtiene el saldo de puntos de un usuario
   */
  async getUserPointsBalance(consumerId: string) {
    const result = await this.prisma.pointTransaction.aggregate({
      where: { consumerId },
      _sum: { amount: true },
    });

    return result._sum.amount || 0;
  }

  /**
   * Obtiene el historial de transacciones de puntos de un usuario
   */
  async getPointTransactions(consumerId: string) {
    return this.prisma.pointTransaction.findMany({
      where: { consumerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Ajuste manual de puntos (para admin)
   */
  async adjustPoints(consumerId: string, amount: number) {
    return this.prisma.pointTransaction.create({
      data: {
        consumerId,
        amount,
        type: 'EARNED_SERVICE', // Temporal, hasta que agreguemos ADJUST al schema
        referenceId: null,
      },
    });
  }
}
