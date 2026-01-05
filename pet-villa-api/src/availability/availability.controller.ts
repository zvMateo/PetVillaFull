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
  ParseIntPipe,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilitySlotDto, UpdateAvailabilitySlotDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Availability')
@ApiBearerAuth('JWT-auth')
@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  // ============================================
  // PUBLIC ENDPOINTS (Read operations)
  // ============================================

  /**
   * POST /api/availability - Crea un nuevo slot de disponibilidad
   */
  @Post()
  @ApiOperation({
    summary: 'Crear slot de disponibilidad',
  })
  @ApiBody({
    type: CreateAvailabilitySlotDto,
    description: 'Datos del slot de disponibilidad',
    examples: {
      'Disponibilidad de clínica': {
        summary: 'Crear disponibilidad para clínica veterinaria',
        value: {
          clinicId: '550e8400-e29b-41d4-a716-446655440000',
          dayOfWeek: 1, // Lunes
          startTime: '09:00',
          endTime: '18:00',
          isActive: true,
        },
      },
      'Disponibilidad de freelancer': {
        summary: 'Crear disponibilidad para veterinario independiente',
        value: {
          freelancerId: '550e8400-e29b-41d4-a716-446655440001',
          dayOfWeek: 3, // Miércoles
          startTime: '10:00',
          endTime: '16:00',
          isActive: true,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Slot de disponibilidad creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        clinicId: {
          type: 'string',
          nullable: true,
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        freelancerId: {
          type: 'string',
          nullable: true,
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        dayOfWeek: {
          type: 'number',
          example: 1,
          description: '0=Domingo, 6=Sábado',
        },
        startTime: { type: 'string', example: '09:00' },
        endTime: { type: 'string', example: '18:00' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o faltantes',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'dayOfWeek must be between 0 and 6',
            'endTime must be after startTime',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para crear disponibilidad',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Only clinic admins or freelancers can create availability',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  create(@Body() dto: CreateAvailabilitySlotDto) {
    return this.availabilityService.create(dto);
  }

  /**
   * GET /api/availability/clinic/:clinicId - Disponibilidad completa de una clínica
   */
  @Public()
  @Get('clinic/:clinicId')
  @ApiOperation({
    summary: 'Disponibilidad completa de clínica',
    description: `
    Devuelve todos los slots de disponibilidad de una clínica veterinaria específica.

    **Información incluida:**
    - Todos los slots de disponibilidad por día de la semana
    - Horarios de atención
    - Estado activo/inactivo

    **Uso típico:** Para mostrar el horario completo de una clínica.
    `,
  })
  @ApiParam({
    name: 'clinicId',
    description: 'ID de la clínica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Disponibilidad de la clínica obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          dayOfWeek: {
            type: 'number',
            example: 1,
            description: '0=Domingo, 6=Sábado',
          },
          startTime: { type: 'string', example: '09:00' },
          endTime: { type: 'string', example: '18:00' },
          isActive: { type: 'boolean', example: true },
          dayName: { type: 'string', example: 'Lunes' },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Clínica no encontrada',
  })
  findByClinic(@Param('clinicId', ParseUUIDPipe) clinicId: string) {
    return this.availabilityService.findByClinic(clinicId);
  }

  /**
   * GET /api/availability/freelancer/:freelancerId - Disponibilidad completa de un freelancer
   */
  @Public()
  @Get('freelancer/:freelancerId')
  @ApiOperation({
    summary: 'Disponibilidad completa de freelancer',
    description: `
    Devuelve todos los slots de disponibilidad de un veterinario independiente específico.

    **Información incluida:**
    - Todos los slots de disponibilidad por día de la semana
    - Horarios de atención
    - Estado activo/inactivo

    **Uso típico:** Para mostrar el horario completo de un freelancer.
    `,
  })
  @ApiParam({
    name: 'freelancerId',
    description: 'ID del perfil de veterinario independiente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Disponibilidad del freelancer obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          dayOfWeek: {
            type: 'number',
            example: 3,
            description: '0=Domingo, 6=Sábado',
          },
          startTime: { type: 'string', example: '10:00' },
          endTime: { type: 'string', example: '16:00' },
          isActive: { type: 'boolean', example: true },
          dayName: { type: 'string', example: 'Miércoles' },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Freelancer no encontrado',
  })
  findByFreelancer(@Param('freelancerId', ParseUUIDPipe) freelancerId: string) {
    return this.availabilityService.findByFreelancer(freelancerId);
  }

  /**
   * GET /api/availability/clinic/:clinicId/day/:dayOfWeek - Slots disponibles de clínica por día
   */
  @Public()
  @Get('clinic/:clinicId/day/:dayOfWeek')
  @ApiOperation({
    summary: 'Slots disponibles de clínica por día',
    description: `
    Devuelve los slots de disponibilidad disponibles para una clínica en un día específico de la semana.

    **Parámetros:**
    - **clinicId**: ID de la clínica
    - **dayOfWeek**: Día de la semana (0=Domingo, 6=Sábado)

    **Uso típico:** Para mostrar horarios disponibles al agendar citas.
    `,
  })
  @ApiParam({
    name: 'clinicId',
    description: 'ID de la clínica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'dayOfWeek',
    description: 'Día de la semana (0=Domingo, 6=Sábado)',
    example: 1,
    schema: { type: 'integer', minimum: 0, maximum: 6 },
  })
  @ApiOkResponse({
    description: 'Slots disponibles obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          startTime: { type: 'string', example: '09:00' },
          endTime: { type: 'string', example: '10:00' },
          available: { type: 'boolean', example: true },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Día de la semana inválido',
  })
  @ApiNotFoundResponse({
    description: 'Clínica no encontrada',
  })
  getClinicAvailableSlots(
    @Param('clinicId', ParseUUIDPipe) clinicId: string,
    @Param('dayOfWeek', ParseIntPipe) dayOfWeek: number,
  ) {
    return this.availabilityService.getAvailableSlots(
      clinicId,
      'clinic',
      dayOfWeek,
    );
  }

  /**
   * GET /api/availability/freelancer/:freelancerId/day/:dayOfWeek - Slots disponibles de freelancer por día
   */
  @Public()
  @Get('freelancer/:freelancerId/day/:dayOfWeek')
  @ApiOperation({
    summary: 'Slots disponibles de freelancer por día',
    description: `
    Devuelve los slots de disponibilidad disponibles para un freelancer en un día específico de la semana.

    **Parámetros:**
    - **freelancerId**: ID del freelancer
    - **dayOfWeek**: Día de la semana (0=Domingo, 6=Sábado)

    **Uso típico:** Para mostrar horarios disponibles al agendar citas.
    `,
  })
  @ApiParam({
    name: 'freelancerId',
    description: 'ID del perfil de veterinario independiente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'dayOfWeek',
    description: 'Día de la semana (0=Domingo, 6=Sábado)',
    example: 3,
    schema: { type: 'integer', minimum: 0, maximum: 6 },
  })
  @ApiOkResponse({
    description: 'Slots disponibles obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          startTime: { type: 'string', example: '10:00' },
          endTime: { type: 'string', example: '11:00' },
          available: { type: 'boolean', example: true },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Día de la semana inválido',
  })
  @ApiNotFoundResponse({
    description: 'Freelancer no encontrado',
  })
  getFreelancerAvailableSlots(
    @Param('freelancerId', ParseUUIDPipe) freelancerId: string,
    @Param('dayOfWeek', ParseIntPipe) dayOfWeek: number,
  ) {
    return this.availabilityService.getAvailableSlots(
      freelancerId,
      'freelancer',
      dayOfWeek,
    );
  }

  // ============================================
  // AUTHENTICATED ENDPOINTS (Write operations)
  // ============================================

  /**
   * GET /api/availability/:id - Obtiene detalles de un slot de disponibilidad específico
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener slot de disponibilidad específico',
    description: `
    Devuelve información completa de un slot de disponibilidad específico.

    **Permisos:**
    - Solo el propietario del slot puede verlo
    - Los administradores pueden ver cualquier slot

    **Uso típico:** Para gestión interna de disponibilidad.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del slot de disponibilidad',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Slot de disponibilidad obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        clinicId: {
          type: 'string',
          nullable: true,
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        freelancerId: {
          type: 'string',
          nullable: true,
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        dayOfWeek: { type: 'number', example: 1 },
        startTime: { type: 'string', example: '09:00' },
        endTime: { type: 'string', example: '18:00' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para ver este slot',
  })
  @ApiNotFoundResponse({
    description: 'Slot de disponibilidad no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.availabilityService.findOne(id);
  }

  /**
   * PATCH /api/availability/:id - Actualiza un slot de disponibilidad
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar slot de disponibilidad',
    description: `
    Permite actualizar la información de un slot de disponibilidad.

    **Permisos:**
    - Solo el propietario del slot puede actualizarlo
    - CLINIC_ADMIN puede actualizar slots de su clínica
    - VET_INDIVIDUAL puede actualizar sus propios slots

    **Campos actualizables:**
    - Horarios de inicio y fin
    - Estado activo/inactivo
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del slot de disponibilidad a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateAvailabilitySlotDto,
    description: 'Campos a actualizar',
    examples: {
      'Cambiar horario': {
        summary: 'Actualizar horario de atención',
        value: {
          startTime: '08:00',
          endTime: '17:00',
        },
      },
      'Desactivar slot': {
        summary: 'Desactivar slot temporalmente',
        value: {
          isActive: false,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Slot de disponibilidad actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        startTime: { type: 'string', example: '08:00' },
        endTime: { type: 'string', example: '17:00' },
        isActive: { type: 'boolean', example: false },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para actualizar este slot',
  })
  @ApiNotFoundResponse({
    description: 'Slot de disponibilidad no encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAvailabilitySlotDto,
  ) {
    return this.availabilityService.update(id, dto);
  }

  /**
   * DELETE /api/availability/:id - Elimina un slot de disponibilidad
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar slot de disponibilidad',
    description: `
    Permite eliminar un slot de disponibilidad.

    **Permisos:**
    - Solo el propietario del slot puede eliminarlo
    - CLINIC_ADMIN puede eliminar slots de su clínica
    - VET_INDIVIDUAL puede eliminar sus propios slots

    **Nota:** Los slots eliminados no pueden recuperarse.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del slot de disponibilidad a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Slot de disponibilidad eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Availability slot deleted successfully',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para eliminar este slot',
  })
  @ApiNotFoundResponse({
    description: 'Slot de disponibilidad no encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.availabilityService.remove(id);
  }
}
