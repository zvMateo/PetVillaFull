import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { GeoService } from './geo.service';
import { Public } from '../auth/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Geo')
@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  // ============================================
  // PUBLIC ENDPOINTS (Guest mode)
  // ============================================

  /**
   * GET /api/geo/clinics - Obtiene todas las clínicas
   */
  @Public()
  @Get('clinics')
  @ApiOperation({
    summary: 'Listar todas las clínicas veterinarias',
  })
  @ApiOkResponse({
    description: 'Lista de clínicas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          name: { type: 'string', example: 'Clínica Veterinaria Central' },
          address: {
            type: 'string',
            example: 'Av. Providencia 1234, Santiago',
          },
          phone: { type: 'string', nullable: true, example: '+56225551234' },
          location: {
            type: 'object',
            properties: {
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                example: [-70.6483, -33.4489],
              },
            },
          },
          is24Hours: { type: 'boolean', example: true },
          imageUrl: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/clinica.jpg',
          },
        },
      },
    },
  })
  async getClinics() {
    return this.geoService.findAllClinics();
  }

  /**
   * GET /api/geo/freelancers - Obtiene todos los veterinarios independientes
   */
  @Public()
  @Get('freelancers')
  @ApiOperation({
    summary: 'Listar todos los veterinarios independientes',
    description: `
    Devuelve una lista completa de todos los veterinarios independientes disponibles en la plataforma.

    **Información incluida:**
    - Datos profesionales de cada veterinario
    - Zona de cobertura geográfica con radio
    - Especialidades y matrícula profesional
    - Información de contacto

    **Uso típico:** Para mostrar marcadores con áreas de cobertura en el mapa.
    `,
  })
  @ApiOkResponse({
    description: 'Lista de veterinarios independientes obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          licenseNumber: { type: 'string', example: 'MVZ-12345' },
          specialties: {
            type: 'array',
            items: { type: 'string' },
            example: ['Medicina Felina', 'Cirugía Menor'],
          },
          serviceRadiusKm: { type: 'number', example: 25 },
          baseLocation: {
            type: 'object',
            properties: {
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                example: [-70.6483, -33.4489],
              },
            },
          },
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
  })
  async getFreelancers() {
    return this.geoService.findAllFreelancers();
  }

  /**
   * GET /api/geo/services/categories - Obtiene todas las categorías de servicios
   */
  @Public()
  @Get('services/categories')
  @ApiOperation({
    summary: 'Listar categorías de servicios',
    description: `
    Devuelve una lista de todas las categorías de servicios veterinarios disponibles en la plataforma.

    **Categorías disponibles:**
    - Consulta General
    - Vacunación
    - Cirugía
    - Urgencias
    - Otros servicios especializados

    **Uso típico:** Para filtros de búsqueda y navegación por categorías.
    `,
  })
  @ApiOkResponse({
    description: 'Categorías obtenidas exitosamente',
    schema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { type: 'string' },
          example: ['Consulta General', 'Vacunación', 'Cirugía', 'Urgencias'],
        },
      },
    },
  })
  async getServiceCategories() {
    const categories = await this.geoService.getServiceCategories();
    return { categories };
  }

  /**
   * GET /api/geo/search/clinics - Busca clínicas por texto
   */
  @Public()
  @Get('search/clinics')
  @ApiOperation({
    summary: 'Buscar clínicas por texto',
    description: `
    Realiza una búsqueda de texto completo en clínicas veterinarias.

    **Campos de búsqueda:**
    - Nombre de la clínica
    - Dirección
    - Descripción
    - Servicios ofrecidos

    **Resultado:** Lista de clínicas que coinciden con el término de búsqueda.
    `,
  })
  @ApiQuery({
    name: 'q',
    description: 'Término de búsqueda',
    example: 'centro veterinario',
    required: true,
  })
  @ApiOkResponse({
    description: 'Búsqueda completada exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          name: { type: 'string', example: 'Centro Veterinario Plaza' },
          address: { type: 'string', example: 'Plaza de Armas 123, Santiago' },
          phone: { type: 'string', nullable: true, example: '+56225551234' },
          relevanceScore: { type: 'number', example: 0.85 },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Parámetro de búsqueda requerido',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Query parameter "q" is required' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async searchClinics(@Query('q') query: string) {
    if (!query) {
      throw new Error('Query parameter "q" is required');
    }
    return this.geoService.searchClinics(query);
  }

  /**
   * GET /api/geo/search/freelancers - Busca freelancers por texto
   */
  @Public()
  @Get('search/freelancers')
  @ApiOperation({
    summary: 'Buscar veterinarios independientes por texto',
    description: `
    Realiza una búsqueda de texto completo en veterinarios independientes.

    **Campos de búsqueda:**
    - Nombre del veterinario
    - Especialidades
    - Bio profesional
    - Servicios ofrecidos

    **Resultado:** Lista de veterinarios que coinciden con el término de búsqueda.
    `,
  })
  @ApiQuery({
    name: 'q',
    description: 'Término de búsqueda',
    example: 'medicina felina',
    required: true,
  })
  @ApiOkResponse({
    description: 'Búsqueda completada exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          licenseNumber: { type: 'string', example: 'MVZ-12345' },
          specialties: {
            type: 'array',
            items: { type: 'string' },
            example: ['Medicina Felina', 'Cirugía Menor'],
          },
          profile: {
            type: 'object',
            properties: {
              firstName: { type: 'string', example: 'Dr. Juan' },
              lastName: { type: 'string', example: 'Pérez' },
            },
          },
          relevanceScore: { type: 'number', example: 0.92 },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Parámetro de búsqueda requerido',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Query parameter "q" is required' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async searchFreelancers(@Query('q') query: string) {
    if (!query) {
      throw new Error('Query parameter "q" is required');
    }
    return this.geoService.searchFreelancers(query);
  }

  // ============================================
  // AUTHENTICATED ENDPOINTS
  // ============================================

  /**
   * POST /api/geo/clinics/:id/location - Actualiza ubicación de clínica (admin)
   */
  @Post('clinics/:id/location')
  async updateClinicLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() locationData: { latitude: number; longitude: number },
  ) {
    return this.geoService.updateClinicLocation(
      id,
      locationData.latitude,
      locationData.longitude,
    );
  }

  /**
   * POST /api/geo/freelancers/:id/location - Actualiza ubicación de freelancer
   */
  @Post('freelancers/:id/location')
  async updateFreelancerLocation(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() locationData: { latitude: number; longitude: number },
  ) {
    return this.geoService.updateFreelancerLocation(
      id,
      locationData.latitude,
      locationData.longitude,
    );
  }
}
