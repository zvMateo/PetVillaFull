import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  UpdateClinicProfileDto,
  UpdateFreelancerProfileDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public, CurrentUser } from '../auth/decorators';
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
} from '@nestjs/swagger';

@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // ============================================
  // USER PROFILES (Endpoints para el usuario actual)
  // ============================================

  /**
   * GET /api/profiles/me - Obtiene el perfil del usuario autenticado
   */
  @Get('me')
  @ApiOperation({
    summary: 'Obtener mi perfil',
  })
  @ApiOkResponse({
    description: 'Perfil obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        userId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        firstName: { type: 'string', example: 'María' },
        lastName: { type: 'string', example: 'García' },
        phone: { type: 'string', nullable: true, example: '+56912345678' },
        avatarUrl: {
          type: 'string',
          nullable: true,
          example: 'https://example.com/avatar.jpg',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
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
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profile not found for user' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.profilesService.findProfileByUserId(userId);
  }

  /**
   * POST /api/profiles/me - Crea el perfil del usuario autenticado
   */
  @Post('me')
  @ApiOperation({
    summary: 'Crear mi perfil',
    description: `
    Permite a un usuario autenticado crear su perfil personal por primera vez.

    **Información requerida:**
    - Nombre y apellido (obligatorios)
    - Teléfono (opcional)
    - URL del avatar (opcional)

    **Nota:** Cada usuario solo puede tener un perfil. Si ya existe, use el endpoint de actualización.
    `,
  })
  @ApiBody({
    type: CreateProfileDto,
    description: 'Datos del perfil a crear',
    examples: {
      'Perfil completo': {
        summary: 'Crear perfil con toda la información',
        value: {
          firstName: 'María',
          lastName: 'García',
          phone: '+56912345678',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
      },
      'Perfil básico': {
        summary: 'Crear perfil con información mínima',
        value: {
          firstName: 'Juan',
          lastName: 'Pérez',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Perfil creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        userId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        firstName: { type: 'string', example: 'María' },
        lastName: { type: 'string', example: 'García' },
        phone: { type: 'string', nullable: true, example: '+56912345678' },
        avatarUrl: {
          type: 'string',
          nullable: true,
          example: 'https://example.com/avatar.jpg',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o perfil ya existe',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'firstName should not be empty',
            'Profile already exists for this user',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async createMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProfileDto,
  ) {
    return this.profilesService.createProfile({
      ...dto,
      userId,
    });
  }

  /**
   * PATCH /api/profiles/me - Actualiza el perfil del usuario autenticado
   */
  @Patch('me')
  @ApiOperation({
    summary: 'Actualizar mi perfil',
    description: `
    Permite a un usuario autenticado actualizar la información de su perfil.

    **Campos actualizables:**
    - Nombre y apellido
    - Número de teléfono
    - URL del avatar/foto de perfil

    **Nota:** Solo se actualizan los campos proporcionados. Los campos no incluidos permanecen sin cambios.
    `,
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Campos a actualizar',
    examples: {
      'Actualizar contacto': {
        summary: 'Cambiar teléfono y avatar',
        value: {
          phone: '+56987654321',
          avatarUrl: 'https://example.com/new-avatar.jpg',
        },
      },
      'Actualizar nombre': {
        summary: 'Cambiar nombre completo',
        value: {
          firstName: 'María José',
          lastName: 'García López',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Perfil actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        userId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        firstName: { type: 'string', example: 'María José' },
        lastName: { type: 'string', example: 'García López' },
        phone: { type: 'string', nullable: true, example: '+56987654321' },
        avatarUrl: {
          type: 'string',
          nullable: true,
          example: 'https://example.com/new-avatar.jpg',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profile not found for user' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(userId, dto);
  }

  // ============================================
  // USER PROFILES (Endpoints para admins/sistema)
  // ============================================

  @Public()
  @Post()
  createProfile(@Body() dto: CreateProfileDto) {
    return this.profilesService.createProfile(dto);
  }

  @Get('user/:userId')
  findProfileByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.profilesService.findProfileByUserId(userId);
  }

  @Patch('user/:userId')
  updateProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(userId, dto);
  }

  // ============================================
  // CLINIC PROFILES
  // ============================================

  /**
   * GET /api/profiles/clinics - Lista todas las clínicas veterinarias
   */
  @Public()
  @Get('clinics')
  @ApiOperation({
    summary: 'Listar clínicas veterinarias',
    description: `
    Devuelve una lista completa de todas las clínicas veterinarias registradas en la plataforma.

    **Información incluida:**
    - Datos básicos de la clínica (nombre, descripción, dirección)
    - Información de contacto (teléfono, email, sitio web)
    - Ubicación geográfica
    - Horarios de atención (24/7)
    - Foto de la clínica

    **Uso típico:** Para mostrar el directorio de clínicas a los usuarios.
    `,
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
          description: {
            type: 'string',
            nullable: true,
            example:
              'Clínica veterinaria con servicio 24/7 especializada en medicina preventiva',
          },
          address: {
            type: 'string',
            example: 'Av. Providencia 1234, Providencia, Santiago',
          },
          phone: { type: 'string', nullable: true, example: '+56225551234' },
          email: {
            type: 'string',
            nullable: true,
            example: 'contacto@clinicacentral.cl',
          },
          website: {
            type: 'string',
            nullable: true,
            example: 'https://clinicacentral.cl',
          },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'Point' },
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
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAllClinics() {
    return this.profilesService.findAllClinics();
  }

  /**
   * GET /api/profiles/clinic/:id - Obtiene detalles de una clínica específica
   */
  @Public()
  @Get('clinic/:id')
  @ApiOperation({
    summary: 'Obtener detalles de clínica',
    description: `
    Devuelve información detallada de una clínica veterinaria específica.

    **Información incluida:**
    - Todos los datos básicos de la clínica
    - Servicios ofrecidos por la clínica
    - Veterinarios que trabajan en la clínica
    - Reseñas y calificaciones
    - Horarios de disponibilidad

    **Uso típico:** Para mostrar la página de detalle de una clínica.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la clínica',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Detalles de clínica obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        name: { type: 'string', example: 'Clínica Veterinaria Central' },
        description: {
          type: 'string',
          nullable: true,
          example:
            'Clínica veterinaria con servicio 24/7 especializada en medicina preventiva',
        },
        address: {
          type: 'string',
          example: 'Av. Providencia 1234, Providencia, Santiago',
        },
        phone: { type: 'string', nullable: true, example: '+56225551234' },
        email: {
          type: 'string',
          nullable: true,
          example: 'contacto@clinicacentral.cl',
        },
        website: {
          type: 'string',
          nullable: true,
          example: 'https://clinicacentral.cl',
        },
        location: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'Point' },
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
        createdAt: { type: 'string', format: 'date-time' },
        // Servicios y empleados podrían incluirse en respuestas expandidas
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string', example: 'Consulta General' },
              priceFrom: { type: 'number', example: 50.0 },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Clínica no encontrada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Clinic with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findClinicById(@Param('id', ParseUUIDPipe) id: string) {
    return this.profilesService.findClinicById(id);
  }

  @Patch('clinic/:id')
  updateClinicProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClinicProfileDto,
  ) {
    return this.profilesService.updateClinicProfile(id, dto);
  }

  // ============================================
  // FREELANCER PROFILES
  // ============================================

  /**
   * GET /api/profiles/freelancers - Lista todos los veterinarios independientes
   */
  @Public()
  @Get('freelancers')
  @ApiOperation({
    summary: 'Listar veterinarios independientes',
    description: `
    Devuelve una lista completa de todos los veterinarios independientes registrados en la plataforma.

    **Información incluida:**
    - Datos personales del veterinario (nombre, especialidades)
    - Información profesional (matrícula, bio)
    - Zona de cobertura geográfica
    - Radio de servicio en kilómetros
    - Foto de perfil

    **Uso típico:** Para mostrar el directorio de veterinarios independientes a los usuarios.
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
          userId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440001',
          },
          bio: {
            type: 'string',
            nullable: true,
            example:
              'Veterinario con 10 años de experiencia en medicina felina y canina',
          },
          licenseNumber: { type: 'string', example: 'MVZ-12345' },
          specialties: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'Medicina Felina',
              'Cirugía Menor',
              'Medicina Preventiva',
            ],
          },
          serviceRadiusKm: { type: 'number', example: 25 },
          baseLocation: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'Point' },
              coordinates: {
                type: 'array',
                items: { type: 'number' },
                example: [-70.6483, -33.4489],
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
          // Información del perfil de usuario
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
              avatarUrl: {
                type: 'string',
                nullable: true,
                example: 'https://example.com/doctor.jpg',
              },
            },
          },
        },
      },
    },
  })
  findAllFreelancers() {
    return this.profilesService.findAllFreelancers();
  }

  /**
   * GET /api/profiles/freelancer/:id - Obtiene detalles de un veterinario independiente
   */
  @Public()
  @Get('freelancer/:id')
  @ApiOperation({
    summary: 'Obtener detalles de veterinario independiente',
    description: `
    Devuelve información detallada de un veterinario independiente específico.

    **Información incluida:**
    - Todos los datos profesionales del veterinario
    - Servicios ofrecidos
    - Zona de cobertura con radio
    - Reseñas y calificaciones
    - Información de contacto

    **Uso típico:** Para mostrar la página de perfil de un veterinario independiente.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del perfil de veterinario independiente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Detalles del veterinario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        userId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        bio: {
          type: 'string',
          nullable: true,
          example:
            'Veterinario con 10 años de experiencia en medicina felina y canina',
        },
        licenseNumber: { type: 'string', example: 'MVZ-12345' },
        specialties: {
          type: 'array',
          items: { type: 'string' },
          example: ['Medicina Felina', 'Cirugía Menor', 'Medicina Preventiva'],
        },
        serviceRadiusKm: { type: 'number', example: 25 },
        baseLocation: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'Point' },
            coordinates: {
              type: 'array',
              items: { type: 'number' },
              example: [-70.6483, -33.4489],
            },
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        // Información expandida
        profile: {
          type: 'object',
          properties: {
            firstName: { type: 'string', example: 'Dr. Juan' },
            lastName: { type: 'string', example: 'Pérez' },
            phone: { type: 'string', nullable: true, example: '+56912345678' },
            avatarUrl: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/doctor.jpg',
            },
          },
        },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string', example: 'Visita a Domicilio' },
              priceFrom: { type: 'number', example: 75.0 },
              duration: { type: 'number', nullable: true, example: 90 },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Veterinario independiente no encontrado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Freelancer profile with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  findFreelancerById(@Param('id', ParseUUIDPipe) id: string) {
    return this.profilesService.findFreelancerById(id);
  }

  @Get('freelancer/user/:userId')
  findFreelancerByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.profilesService.findFreelancerByUserId(userId);
  }

  @Patch('freelancer/user/:userId')
  updateFreelancerProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateFreelancerProfileDto,
  ) {
    return this.profilesService.updateFreelancerProfile(userId, dto);
  }
}
