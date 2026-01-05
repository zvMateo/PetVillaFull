import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
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
  ApiQuery,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('Services')
@ApiBearerAuth('JWT-auth')
@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // ============================================
  // PUBLIC ENDPOINTS (Guest mode - Read operations)
  // ============================================

  /**
   * POST /api/services - Crea un nuevo servicio
   */
  @Post()
  @ApiOperation({
    summary: 'Crear servicio veterinario',
  })
  @ApiBody({
    type: CreateServiceDto,
    description: 'Datos del servicio a crear',
    examples: {
      'Servicio de clínica': {
        summary: 'Crear servicio en clínica veterinaria',
        value: {
          clinicId: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Consulta General',
          description:
            'Consulta veterinaria completa con examen físico y recomendaciones',
          category: 'Consulta General',
          priceFrom: 50.0,
          duration: 60,
          pointsReward: 50,
        },
      },
      'Servicio de freelancer': {
        summary: 'Crear servicio como veterinario independiente',
        value: {
          freelancerId: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Visita a Domicilio',
          description: 'Consulta veterinaria a domicilio con visita completa',
          category: 'Consulta General',
          priceFrom: 75.0,
          duration: 90,
          pointsReward: 75,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Servicio creado exitosamente',
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
        title: { type: 'string', example: 'Consulta General' },
        description: {
          type: 'string',
          example: 'Consulta veterinaria completa con examen físico',
        },
        category: { type: 'string', example: 'Consulta General' },
        priceFrom: { type: 'number', example: 50.0 },
        duration: { type: 'number', nullable: true, example: 60 },
        pointsReward: { type: 'number', example: 50 },
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
            'title should not be empty',
            'priceFrom must be a positive number',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para crear servicios',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Only clinic admins or freelancers can create services',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  /**
   * GET /api/services - Lista todos los servicios
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar servicios veterinarios',
    description: `
    Devuelve una lista completa de todos los servicios veterinarios disponibles.

    **Filtros disponibles:**
    - **category**: Filtrar por categoría específica

    **Información incluida:**
    - Detalles del servicio
    - Información del proveedor (clínica o freelancer)
    - Precios y duración
    - Estado de disponibilidad

    **Uso típico:** Para mostrar el catálogo completo de servicios.
    `,
  })
  @ApiQuery({
    name: 'category',
    description: 'Filtrar por categoría específica',
    required: false,
    example: 'Consulta General',
  })
  @ApiOkResponse({
    description: 'Lista de servicios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
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
          title: { type: 'string', example: 'Consulta General' },
          description: {
            type: 'string',
            example: 'Consulta veterinaria completa con examen físico',
          },
          category: { type: 'string', example: 'Consulta General' },
          priceFrom: { type: 'number', example: 50.0 },
          duration: { type: 'number', nullable: true, example: 60 },
          pointsReward: { type: 'number', example: 50 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          // Información expandida del proveedor
          clinic: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'Clínica Veterinaria Central' },
            },
          },
          freelancer: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string' },
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
  })
  findAll(@Query('category') category?: string) {
    return this.servicesService.findAll(category);
  }

  /**
   * GET /api/services/categories - Lista todas las categorías de servicios
   */
  @Public()
  @Get('categories')
  @ApiOperation({
    summary: 'Listar categorías de servicios',
    description: `
    Devuelve una lista de todas las categorías disponibles para servicios veterinarios.

    **Categorías disponibles:**
    - Consulta General
    - Vacunación
    - Cirugía
    - Urgencias
    - Especialidades (Dermatología, Oftalmología, etc.)

    **Uso típico:** Para filtros de búsqueda y navegación por categorías.
    `,
  })
  @ApiOkResponse({
    description: 'Categorías obtenidas exitosamente',
    schema: {
      type: 'array',
      items: { type: 'string' },
      example: [
        'Consulta General',
        'Vacunación',
        'Cirugía',
        'Urgencias',
        'Dermatología',
      ],
    },
  })
  getCategories() {
    return this.servicesService.getCategories();
  }

  /**
   * GET /api/services/:id - Obtiene detalles de un servicio específico
   */
  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalles de servicio',
    description: `
    Devuelve información completa de un servicio veterinario específico.

    **Información incluida:**
    - Todos los detalles del servicio
    - Información completa del proveedor
    - Disponibilidad y horarios
    - Reseñas y calificaciones
    - Información de contacto

    **Uso típico:** Para mostrar la página de detalle de un servicio.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del servicio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Detalles del servicio obtenidos exitosamente',
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
        title: { type: 'string', example: 'Consulta General' },
        description: {
          type: 'string',
          example:
            'Consulta veterinaria completa con examen físico y recomendaciones',
        },
        category: { type: 'string', example: 'Consulta General' },
        priceFrom: { type: 'number', example: 50.0 },
        duration: { type: 'number', nullable: true, example: 60 },
        pointsReward: { type: 'number', example: 50 },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        // Información expandida
        clinic: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Clínica Veterinaria Central' },
            address: {
              type: 'string',
              example: 'Av. Providencia 1234, Santiago',
            },
            phone: { type: 'string', nullable: true, example: '+56225551234' },
          },
        },
        freelancer: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            bio: {
              type: 'string',
              example: 'Veterinario con 10 años de experiencia',
            },
            licenseNumber: { type: 'string', example: 'MVZ-12345' },
            profile: {
              type: 'object',
              properties: {
                firstName: { type: 'string', example: 'Dr. Juan' },
                lastName: { type: 'string', example: 'Pérez' },
                phone: {
                  type: 'string',
                  nullable: true,
                  example: '+56912345678',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Servicio no encontrado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Service with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  /**
   * GET /api/services/clinic/:clinicId - Servicios de una clínica específica
   */
  @Public()
  @Get('clinic/:clinicId')
  @ApiOperation({
    summary: 'Servicios de una clínica',
    description: `
    Devuelve todos los servicios ofrecidos por una clínica veterinaria específica.

    **Uso típico:** Para mostrar el catálogo de servicios de una clínica.
    `,
  })
  @ApiParam({
    name: 'clinicId',
    description: 'ID de la clínica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Servicios de la clínica obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          title: { type: 'string', example: 'Consulta General' },
          description: {
            type: 'string',
            example: 'Consulta veterinaria completa',
          },
          category: { type: 'string', example: 'Consulta General' },
          priceFrom: { type: 'number', example: 50.0 },
          duration: { type: 'number', nullable: true, example: 60 },
          pointsReward: { type: 'number', example: 50 },
          isActive: { type: 'boolean', example: true },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Clínica no encontrada o sin servicios',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'No services found for clinic with ID 550e8400-e29b-41d4-a716-446655440000',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findByClinic(@Param('clinicId', ParseUUIDPipe) clinicId: string) {
    return this.servicesService.findByClinic(clinicId);
  }

  /**
   * GET /api/services/freelancer/:freelancerId - Servicios de un freelancer específico
   */
  @Public()
  @Get('freelancer/:freelancerId')
  @ApiOperation({
    summary: 'Servicios de un veterinario independiente',
    description: `
    Devuelve todos los servicios ofrecidos por un veterinario independiente específico.

    **Uso típico:** Para mostrar el catálogo de servicios de un freelancer.
    `,
  })
  @ApiParam({
    name: 'freelancerId',
    description: 'ID del perfil de veterinario independiente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Servicios del freelancer obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          title: { type: 'string', example: 'Visita a Domicilio' },
          description: {
            type: 'string',
            example: 'Consulta veterinaria a domicilio',
          },
          category: { type: 'string', example: 'Consulta General' },
          priceFrom: { type: 'number', example: 75.0 },
          duration: { type: 'number', nullable: true, example: 90 },
          pointsReward: { type: 'number', example: 75 },
          isActive: { type: 'boolean', example: true },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Freelancer no encontrado o sin servicios',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'No services found for freelancer with ID 550e8400-e29b-41d4-a716-446655440000',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findByFreelancer(@Param('freelancerId', ParseUUIDPipe) freelancerId: string) {
    return this.servicesService.findByFreelancer(freelancerId);
  }

  // ============================================
  // AUTHENTICATED ENDPOINTS (Write operations)
  // ============================================

  /**
   * PATCH /api/services/:id - Actualiza un servicio
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar servicio',
    description: `
    Permite actualizar la información de un servicio veterinario.

    **Permisos:**
    - Solo el propietario del servicio puede actualizarlo
    - CLINIC_ADMIN puede actualizar servicios de su clínica
    - VET_INDIVIDUAL puede actualizar sus propios servicios

    **Campos actualizables:**
    - Título y descripción
    - Precio y duración
    - Estado activo/inactivo
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del servicio a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateServiceDto,
    description: 'Campos a actualizar',
    examples: {
      'Actualizar precio': {
        summary: 'Cambiar precio del servicio',
        value: {
          priceFrom: 55.0,
          pointsReward: 55,
        },
      },
      'Actualizar descripción': {
        summary: 'Cambiar descripción y duración',
        value: {
          description:
            'Consulta veterinaria completa con examen físico detallado',
          duration: 75,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Servicio actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        title: { type: 'string', example: 'Consulta General' },
        description: {
          type: 'string',
          example: 'Consulta veterinaria completa actualizada',
        },
        priceFrom: { type: 'number', example: 55.0 },
        duration: { type: 'number', example: 75 },
        pointsReward: { type: 'number', example: 55 },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para actualizar este servicio',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'You can only update your own services',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Servicio no encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }

  /**
   * DELETE /api/services/:id - Elimina un servicio
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar servicio',
    description: `
    Permite eliminar un servicio veterinario.

    **Permisos:**
    - Solo el propietario del servicio puede eliminarlo
    - CLINIC_ADMIN puede eliminar servicios de su clínica
    - VET_INDIVIDUAL puede eliminar sus propios servicios

    **Nota:** Los servicios eliminados no pueden recuperarse.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del servicio a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Servicio eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Service deleted successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para eliminar este servicio',
  })
  @ApiNotFoundResponse({
    description: 'Servicio no encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }
}
