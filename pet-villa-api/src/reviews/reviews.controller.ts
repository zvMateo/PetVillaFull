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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto';
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

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ============================================
  // AUTHENTICATED ENDPOINTS (Write operations)
  // ============================================

  /**
   * POST /api/reviews - Crea una nueva reseña
   */
  @Post()
  @ApiOperation({
    summary: 'Crear reseña',
  })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Datos de la reseña a crear',
    examples: {
      'Reseña de clínica': {
        summary: 'Crear reseña para clínica veterinaria',
        value: {
          targetId: '550e8400-e29b-41d4-a716-446655440000',
          rating: 5,
          comment:
            'Excelente servicio, muy profesionales y atentos con mi mascota.',
        },
      },
      'Reseña de freelancer': {
        summary: 'Crear reseña para veterinario independiente',
        value: {
          targetId: '550e8400-e29b-41d4-a716-446655440001',
          rating: 4,
          comment:
            'Muy buen veterinario, llegó puntual y atendió muy bien a mi perro.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Reseña creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        authorId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        targetId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        rating: { type: 'number', example: 5 },
        comment: {
          type: 'string',
          nullable: true,
          example: 'Excelente servicio, muy profesionales',
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o usuario no autorizado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'rating must be between 1 and 5',
            'Only consumers can create reviews',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Usuario no autorizado para crear reseñas',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Only consumers can create reviews',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  // ============================================
  // PUBLIC ENDPOINTS (Read operations)
  // ============================================

  /**
   * GET /api/reviews - Lista todas las reseñas
   */
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Listar todas las reseñas',
    description: `
    Devuelve una lista completa de todas las reseñas en la plataforma.

    **Información incluida:**
    - Detalles de la reseña (calificación, comentario, fecha)
    - Información del autor (usuario que escribió la reseña)
    - Información del objetivo (clínica o freelancer reseñado)

    **Uso típico:** Para mostrar el feed general de reseñas.
    `,
  })
  @ApiOkResponse({
    description: 'Lista de reseñas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          authorId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440001',
          },
          targetId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440002',
          },
          rating: { type: 'number', example: 5 },
          comment: {
            type: 'string',
            nullable: true,
            example: 'Excelente servicio',
          },
          createdAt: { type: 'string', format: 'date-time' },
          // Información expandida
          author: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'María' },
              lastName: { type: 'string', example: 'García' },
            },
          },
          target: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Clínica Veterinaria Central' },
              type: {
                type: 'string',
                enum: ['clinic', 'freelancer'],
                example: 'clinic',
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.reviewsService.findAll();
  }

  /**
   * GET /api/reviews/:id - Obtiene detalles de una reseña específica
   */
  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalles de reseña',
    description: `
    Devuelve información completa de una reseña específica.

    **Información incluida:**
    - Todos los detalles de la reseña
    - Información completa del autor
    - Información del objetivo reseñado
    - Fecha de creación y actualización

    **Uso típico:** Para mostrar la página de detalle de una reseña.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la reseña',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Detalles de reseña obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        authorId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        targetId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        rating: { type: 'number', example: 5 },
        comment: {
          type: 'string',
          nullable: true,
          example: 'Excelente servicio, muy profesionales',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        // Información expandida
        author: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string', example: 'María' },
            lastName: { type: 'string', example: 'García' },
            avatarUrl: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/avatar.jpg',
            },
          },
        },
        target: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Clínica Veterinaria Central' },
            type: {
              type: 'string',
              enum: ['clinic', 'freelancer'],
              example: 'clinic',
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Reseña no encontrada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Review with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOne(id);
  }

  /**
   * GET /api/reviews/clinic/:clinicId - Reseñas de una clínica específica
   */
  @Public()
  @Get('clinic/:clinicId')
  @ApiOperation({
    summary: 'Reseñas de una clínica',
    description: `
    Devuelve todas las reseñas de una clínica veterinaria específica.

    **Uso típico:** Para mostrar las reseñas en la página de detalle de una clínica.
    `,
  })
  @ApiParam({
    name: 'clinicId',
    description: 'ID de la clínica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reseñas de la clínica obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          rating: { type: 'number', example: 5 },
          comment: {
            type: 'string',
            nullable: true,
            example: 'Excelente servicio',
          },
          createdAt: { type: 'string', format: 'date-time' },
          author: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'María' },
              lastName: { type: 'string', example: 'García' },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Clínica no encontrada o sin reseñas',
  })
  findByClinic(@Param('clinicId', ParseUUIDPipe) clinicId: string) {
    return this.reviewsService.findByClinic(clinicId);
  }

  /**
   * GET /api/reviews/freelancer/:freelancerId - Reseñas de un freelancer específico
   */
  @Public()
  @Get('freelancer/:freelancerId')
  @ApiOperation({
    summary: 'Reseñas de un veterinario independiente',
    description: `
    Devuelve todas las reseñas de un veterinario independiente específico.

    **Uso típico:** Para mostrar las reseñas en el perfil de un freelancer.
    `,
  })
  @ApiParam({
    name: 'freelancerId',
    description: 'ID del perfil de veterinario independiente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reseñas del freelancer obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          rating: { type: 'number', example: 4 },
          comment: {
            type: 'string',
            nullable: true,
            example: 'Muy buen veterinario',
          },
          createdAt: { type: 'string', format: 'date-time' },
          author: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'Juan' },
              lastName: { type: 'string', example: 'Pérez' },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Freelancer no encontrado o sin reseñas',
  })
  findByFreelancer(@Param('freelancerId', ParseUUIDPipe) freelancerId: string) {
    return this.reviewsService.findByFreelancer(freelancerId);
  }

  /**
   * GET /api/reviews/author/:authorId - Reseñas escritas por un usuario
   */
  @Get('author/:authorId')
  @ApiOperation({
    summary: 'Reseñas de un autor',
    description: `
    Devuelve todas las reseñas escritas por un usuario específico.

    **Permisos:**
    - Solo el propio usuario puede ver sus reseñas
    - Los administradores pueden ver reseñas de cualquier usuario

    **Uso típico:** Para que usuarios vean su historial de reseñas.
    `,
  })
  @ApiParam({
    name: 'authorId',
    description: 'ID del usuario autor de las reseñas',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reseñas del autor obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          rating: { type: 'number', example: 5 },
          comment: {
            type: 'string',
            nullable: true,
            example: 'Excelente servicio',
          },
          createdAt: { type: 'string', format: 'date-time' },
          target: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Clínica Veterinaria Central' },
              type: {
                type: 'string',
                enum: ['clinic', 'freelancer'],
                example: 'clinic',
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para ver estas reseñas',
  })
  findByAuthor(@Param('authorId', ParseUUIDPipe) authorId: string) {
    return this.reviewsService.findByAuthor(authorId);
  }

  /**
   * GET /api/reviews/clinic/:clinicId/rating - Calificación promedio de una clínica
   */
  @Public()
  @Get('clinic/:clinicId/rating')
  @ApiOperation({
    summary: 'Calificación promedio de clínica',
    description: `
    Devuelve la calificación promedio de una clínica veterinaria basada en todas sus reseñas.

    **Información incluida:**
    - Calificación promedio (1-5)
    - Número total de reseñas
    - Distribución por estrellas (opcional)

    **Uso típico:** Para mostrar la calificación en la página de la clínica.
    `,
  })
  @ApiParam({
    name: 'clinicId',
    description: 'ID de la clínica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Calificación promedio obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        clinicId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        averageRating: { type: 'number', example: 4.5 },
        totalReviews: { type: 'number', example: 23 },
        ratingDistribution: {
          type: 'object',
          properties: {
            1: { type: 'number', example: 0 },
            2: { type: 'number', example: 1 },
            3: { type: 'number', example: 2 },
            4: { type: 'number', example: 7 },
            5: { type: 'number', example: 13 },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Clínica no encontrada',
  })
  getClinicRating(@Param('clinicId', ParseUUIDPipe) clinicId: string) {
    return this.reviewsService.getClinicAverageRating(clinicId);
  }

  /**
   * GET /api/reviews/freelancer/:freelancerId/rating - Calificación promedio de un freelancer
   */
  @Public()
  @Get('freelancer/:freelancerId/rating')
  @ApiOperation({
    summary: 'Calificación promedio de veterinario independiente',
    description: `
    Devuelve la calificación promedio de un veterinario independiente basada en todas sus reseñas.

    **Información incluida:**
    - Calificación promedio (1-5)
    - Número total de reseñas
    - Distribución por estrellas (opcional)

    **Uso típico:** Para mostrar la calificación en el perfil del freelancer.
    `,
  })
  @ApiParam({
    name: 'freelancerId',
    description: 'ID del perfil de veterinario independiente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Calificación promedio obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        freelancerId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        averageRating: { type: 'number', example: 4.7 },
        totalReviews: { type: 'number', example: 15 },
        ratingDistribution: {
          type: 'object',
          properties: {
            1: { type: 'number', example: 0 },
            2: { type: 'number', example: 0 },
            3: { type: 'number', example: 1 },
            4: { type: 'number', example: 4 },
            5: { type: 'number', example: 10 },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Freelancer no encontrado',
  })
  getFreelancerRating(
    @Param('freelancerId', ParseUUIDPipe) freelancerId: string,
  ) {
    return this.reviewsService.getFreelancerAverageRating(freelancerId);
  }

  /**
   * PATCH /api/reviews/:id - Actualiza una reseña
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar reseña',
    description: `
    Permite actualizar una reseña existente.

    **Permisos:**
    - Solo el autor de la reseña puede actualizarla

    **Campos actualizables:**
    - Calificación (1-5 estrellas)
    - Comentario de texto
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reseña a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateReviewDto,
    description: 'Campos a actualizar',
    examples: {
      'Actualizar calificación': {
        summary: 'Cambiar calificación de la reseña',
        value: {
          rating: 4,
        },
      },
      'Actualizar comentario': {
        summary: 'Cambiar comentario de la reseña',
        value: {
          comment: 'Servicio muy bueno, definitivamente recomiendo.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Reseña actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        rating: { type: 'number', example: 4 },
        comment: {
          type: 'string',
          example: 'Servicio muy bueno, definitivamente recomiendo',
        },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para actualizar esta reseña',
  })
  @ApiNotFoundResponse({
    description: 'Reseña no encontrada',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  /**
   * DELETE /api/reviews/:id - Elimina una reseña
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar reseña',
    description: `
    Permite eliminar una reseña.

    **Permisos:**
    - Solo el autor de la reseña puede eliminarla
    - Los administradores pueden eliminar cualquier reseña

    **Nota:** Las reseñas eliminadas no pueden recuperarse.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reseña a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Reseña eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Review deleted successfully' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario no autenticado',
  })
  @ApiForbiddenResponse({
    description: 'No autorizado para eliminar esta reseña',
  })
  @ApiNotFoundResponse({
    description: 'Reseña no encontrada',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
