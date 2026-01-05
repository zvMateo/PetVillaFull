import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public, CurrentUser } from '../auth/decorators';
import { AppointmentStatus } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // ============================================
  // APPOINTMENT MANAGEMENT (Endpoints para el usuario actual)
  // ============================================

  /**
   * GET /api/appointments/me - Obtiene todas las citas del usuario actual
   */
  @Get('me')
  @ApiOperation({
    summary: 'Obtener mis citas',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: AppointmentStatus,
    description: 'Filtrar por estado de la cita',
    example: 'CONFIRMED',
  })
  @ApiOkResponse({
    description: 'Lista de citas obtenida exitosamente',
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
          serviceId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440002',
          },
          petId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440003',
          },
          dateTime: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T10:00:00Z',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
            example: 'CONFIRMED',
          },
          notes: {
            type: 'string',
            nullable: true,
            example: 'Mascota necesita medicación especial',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          consumer: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string', example: 'maria.garcia@email.com' },
            },
          },
          service: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: {
                type: 'string',
                example: 'Consulta General Veterinaria',
              },
              category: { type: 'string', example: 'Consulta' },
              priceFrom: { type: 'number', example: 50.0 },
              duration: { type: 'number', nullable: true, example: 60 },
              clinic: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string' },
                  name: {
                    type: 'string',
                    example: 'Clínica Veterinaria Central',
                  },
                },
              },
              freelancer: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      profile: {
                        type: 'object',
                        properties: {
                          firstName: { type: 'string', example: 'Dr. Juan' },
                          lastName: { type: 'string', example: 'Pérez' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          pet: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'Max' },
              species: {
                type: 'string',
                enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'OTHER'],
              },
              breed: {
                type: 'string',
                nullable: true,
                example: 'Golden Retriever',
              },
            },
          },
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
  async getMyAppointments(
    @CurrentUser('id') userId: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentsService.findAll({
      consumerId: userId,
      status,
    });
  }

  /**
   * POST /api/appointments/me - Crea una cita para el usuario autenticado
   */
  @Post('me')
  @ApiOperation({
    summary: 'Reservar nueva cita',
    description: `
    Permite a un usuario autenticado reservar una cita para su mascota.

    **Proceso de reserva:**
    1. Seleccionar servicio (clínica o veterinario independiente)
    2. Elegir mascota para la cita
    3. Especificar fecha y hora deseadas
    4. Agregar notas adicionales si es necesario

    **Estados iniciales:**
    - La cita se crea con estado \`PENDING\`
    - El proveedor debe confirmar la cita
    - Una vez confirmada, pasa a \`CONFIRMED\`

    **Nota:** Asegúrate de que la mascota pertenezca al usuario autenticado.
    `,
  })
  @ApiBody({
    type: CreateAppointmentDto,
    description: 'Datos de la nueva cita',
    examples: {
      'Cita en clínica veterinaria': {
        summary: 'Reservar consulta en clínica',
        value: {
          serviceId: '550e8400-e29b-41d4-a716-446655440001',
          petId: '550e8400-e29b-41d4-a716-446655440002',
          dateTime: '2024-01-20T14:30:00Z',
          notes: 'Max necesita revisión anual y vacunación',
        },
      },
      'Cita con veterinario independiente': {
        summary: 'Reservar visita a domicilio',
        value: {
          serviceId: '550e8400-e29b-41d4-a716-446655440003',
          petId: '550e8400-e29b-41d4-a716-446655440004',
          dateTime: '2024-01-18T10:00:00Z',
          notes: 'Luna está vomitando, necesita visita urgente',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Cita reservada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        consumerId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        serviceId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        petId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440003',
        },
        dateTime: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T14:30:00Z',
        },
        status: { type: 'string', example: 'PENDING' },
        notes: {
          type: 'string',
          nullable: true,
          example: 'Max necesita revisión anual y vacunación',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        consumer: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', example: 'maria.garcia@email.com' },
          },
        },
        service: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string', example: 'Consulta General Veterinaria' },
            category: { type: 'string', example: 'Consulta' },
            priceFrom: { type: 'number', example: 50.0 },
            clinic: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string' },
                name: {
                  type: 'string',
                  example: 'Clínica Veterinaria Central',
                },
              },
            },
          },
        },
        pet: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Max' },
            species: {
              type: 'string',
              enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'OTHER'],
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o mascota no pertenece al usuario',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['serviceId must be a UUID', 'Pet does not belong to user'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Servicio o mascota no encontrados',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Service with ID 550e8400-e29b-41d4-a716-446655440001 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async createMyAppointment(
    @CurrentUser('id') userId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create({
      ...createAppointmentDto,
      consumerId: userId,
    });
  }

  /**
   * PATCH /api/appointments/me/:id/cancel - Cancela una cita del usuario actual
   */
  @Patch('me/:id/cancel')
  @ApiOperation({
    summary: 'Cancelar cita',
    description: `
    Permite a un usuario cancelar una cita que ha reservado.

    **Condiciones para cancelar:**
    - Solo el propietario de la cita puede cancelarla
    - No se pueden cancelar citas ya completadas
    - Las citas pasan automáticamente al estado \`CANCELLED\`

    **Recomendaciones:**
    - Cancela con anticipación para permitir reagendar a otros usuarios
    - Si cancelas frecuentemente, podrías afectar tu reputación

    **Nota:** La cancelación es irreversible desde el lado del usuario.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la cita a cancelar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Cita cancelada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        consumerId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        serviceId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        petId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440003',
        },
        dateTime: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T14:30:00Z',
        },
        status: { type: 'string', example: 'CANCELLED' },
        notes: {
          type: 'string',
          nullable: true,
          example: 'Max necesita revisión anual y vacunación',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Intento de cancelar cita de otro usuario o cita ya completada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'No tienes permiso para cancelar esta cita',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Cita no encontrada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Appointment with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async cancelMyAppointment(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    // Verify ownership before canceling
    const appointment = await this.appointmentsService.findOne(id);
    if (appointment.consumerId !== userId) {
      throw new Error('No tienes permiso para cancelar esta cita');
    }
    return this.appointmentsService.cancel(id);
  }

  // ============================================
  // APPOINTMENT MANAGEMENT (Endpoints para admins/sistema)
  // ============================================

  @Public()
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(
    @Query('consumerId') consumerId?: string,
    @Query('status') status?: AppointmentStatus,
  ) {
    return this.appointmentsService.findAll({ consumerId, status });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.cancel(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}
