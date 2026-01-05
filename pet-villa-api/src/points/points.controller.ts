import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { CreateRedeemPointsDto } from './dto/create-redeem-points.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Points')
@ApiBearerAuth('JWT-auth')
@Controller('points')
@UseGuards(JwtAuthGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /**
   * GET /api/points/me/balance - Obtiene el saldo de puntos del usuario actual
   */
  @Get('me/balance')
  @ApiOperation({
    summary: 'Consultar saldo de puntos',
  })
  @ApiOkResponse({
    description: 'Saldo de puntos obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        balance: {
          type: 'number',
          example: 250,
          description: 'Saldo actual de puntos disponibles',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async getMyBalance(@CurrentUser('id') userId: string) {
    const balance = await this.pointsService.getUserPointsBalance(userId);
    return { balance };
  }

  /**
   * GET /api/points/me/transactions - Obtiene el historial de transacciones del usuario actual
   */
  @Get('me/transactions')
  @ApiOperation({
    summary: 'Historial de transacciones de puntos',
    description: `
    Devuelve el historial completo de transacciones de puntos del usuario autenticado.

    **Tipos de transacciones:**
    - \`EARNED_SERVICE\` - Puntos ganados al completar citas (montos positivos)
    - \`REDEEMED_REWARD\` - Puntos canjeados por recompensas (montos negativos)

    **Información incluida:**
    - Fecha y hora de cada transacción
    - Tipo de transacción y descripción
    - Monto de puntos (positivo = ganancia, negativo = gasto)
    - Referencia a la cita o recompensa relacionada

    **Nota:** Las transacciones se ordenan por fecha, más recientes primero.
    `,
  })
  @ApiOkResponse({
    description: 'Historial de transacciones obtenido exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          consumerId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440001',
          },
          amount: {
            type: 'number',
            example: 50,
            description: 'Monto de puntos (+ ganancia, - gasto)',
          },
          type: {
            type: 'string',
            enum: ['EARNED_SERVICE', 'REDEEMED_REWARD'],
            example: 'EARNED_SERVICE',
          },
          referenceId: {
            type: 'string',
            nullable: true,
            example: '550e8400-e29b-41d4-a716-446655440002',
            description: 'ID de la cita o recompensa relacionada',
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'Puntos por servicio: Consulta General Veterinaria',
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async getMyTransactions(@CurrentUser('id') userId: string) {
    return this.pointsService.getPointTransactions(userId);
  }

  /**
   * POST /api/points/me/redeem - Canjea puntos del usuario actual
   */
  @Post('me/redeem')
  @ApiOperation({
    summary: 'Canjear puntos por recompensas',
    description: `
    Permite canjear puntos acumulados por recompensas disponibles en la plataforma.

    **Proceso de canje:**
    1. Verificar saldo suficiente de puntos
    2. Procesar el canje de manera atómica
    3. Registrar la transacción en el historial
    4. Actualizar saldo de puntos

    **Recompensas disponibles:**
    - Descuentos en servicios veterinarios
    - Productos veterinarios gratis
    - Servicios premium sin costo adicional
    - Promociones especiales

    **Nota:** Una vez canjeados, los puntos se deducen permanentemente del saldo.
    `,
  })
  @ApiBody({
    type: CreateRedeemPointsDto,
    description: 'Datos para el canje de puntos',
    examples: {
      'Canjear por descuento': {
        summary: 'Canjear 100 puntos por descuento en consulta',
        value: {
          points: 100,
          rewardId: '550e8400-e29b-41d4-a716-446655440001',
        },
      },
      'Canjear por producto': {
        summary: 'Canjear 50 puntos por producto veterinario',
        value: {
          points: 50,
          rewardId: '550e8400-e29b-41d4-a716-446655440002',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Puntos canjeados exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        consumerId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        amount: {
          type: 'number',
          example: -100,
          description: 'Puntos canjeados (negativo)',
        },
        type: { type: 'string', example: 'REDEEMED_REWARD' },
        referenceId: {
          type: 'string',
          nullable: true,
          example: '550e8400-e29b-41d4-a716-446655440002',
          description: 'ID de la recompensa canjeada',
        },
        description: {
          type: 'string',
          nullable: true,
          example: 'Canje por descuento en consulta veterinaria',
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Saldo insuficiente de puntos',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Insufficient points' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async redeemMyPoints(
    @CurrentUser('id') userId: string,
    @Body() redeemData: CreateRedeemPointsDto,
  ) {
    return this.pointsService.redeemPoints(
      userId,
      redeemData.points,
      redeemData.rewardId,
    );
  }

  // ============================================
  // ADMIN ENDPOINTS (Para gestión de puntos)
  // ============================================

  /**
   * POST /api/points/:userId/award - Otorga puntos a un usuario (admin)
   */
  @Post(':userId/award')
  async awardPoints(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() awardData: { points: number },
  ) {
    return this.pointsService.adjustPoints(userId, awardData.points);
  }

  /**
   * GET /api/points/:userId/balance - Obtiene saldo de puntos de un usuario (admin)
   */
  @Get(':userId/balance')
  async getUserBalance(@Param('userId', ParseUUIDPipe) userId: string) {
    const balance = await this.pointsService.getUserPointsBalance(userId);
    return { balance };
  }

  /**
   * GET /api/points/:userId/transactions - Obtiene historial de un usuario (admin)
   */
  @Get(':userId/transactions')
  async getUserTransactions(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.pointsService.getPointTransactions(userId);
  }
}
