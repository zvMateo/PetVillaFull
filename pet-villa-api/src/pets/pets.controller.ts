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
import { PetsService } from './pets.service';
import { CreatePetDto, UpdatePetDto, CreateMyPetDto } from './dto';
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
  ApiParam,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Pets')
@ApiBearerAuth('JWT-auth')
@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  // ============================================
  // PET MANAGEMENT (Endpoints para el usuario actual)
  // ============================================

  /**
   * GET /api/pets/me - Obtiene todas las mascotas del usuario autenticado
   */
  @Get('me')
  @ApiOperation({
    summary: 'Obtener mis mascotas',
    description: `
    Devuelve todas las mascotas registradas por el usuario autenticado.

    **Información incluida:**
    - Datos básicos de cada mascota (nombre, especie, raza)
    - Información médica (peso, fecha de nacimiento, notas)
    - Fotos de las mascotas
    - Ordenadas por fecha de creación (más recientes primero)
    `,
  })
  @ApiOkResponse({
    description: 'Lista de mascotas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          ownerId: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440001',
          },
          name: { type: 'string', example: 'Max' },
          species: {
            type: 'string',
            enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'OTHER'],
            example: 'DOG',
          },
          breed: {
            type: 'string',
            nullable: true,
            example: 'Golden Retriever',
          },
          birthDate: {
            type: 'string',
            format: 'date',
            nullable: true,
            example: '2022-03-15',
          },
          weight: { type: 'number', nullable: true, example: 25.5 },
          imageUrl: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/max.jpg',
          },
          notes: {
            type: 'string',
            nullable: true,
            example: 'Alergias: pollo, vacunas al día',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
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
  async getMyPets(@CurrentUser('id') userId: string) {
    return this.petsService.findByOwner(userId);
  }

  /**
   * POST /api/pets/me - Crea una mascota para el usuario autenticado
   */
  @Post('me')
  @ApiOperation({
    summary: 'Registrar nueva mascota',
    description: `
    Permite a un usuario autenticado registrar una nueva mascota en su cuenta.

    **Características:**
    - La mascota se asocia automáticamente al usuario autenticado
    - Solo se requieren nombre y especie (otros campos son opcionales)
    - Soporta todas las especies comunes de mascotas
    - Permite agregar información médica importante
    `,
  })
  @ApiBody({
    type: CreateMyPetDto,
    description: 'Datos de la nueva mascota',
    examples: {
      'Perro básico': {
        summary: 'Registrar perro con datos mínimos',
        value: {
          name: 'Max',
          species: 'DOG',
        },
      },
      'Gato completo': {
        summary: 'Registrar gato con información completa',
        value: {
          name: 'Luna',
          species: 'CAT',
          breed: 'Siamés',
          birthDate: '2021-06-15',
          weight: 4.2,
          imageUrl: 'https://example.com/luna.jpg',
          notes: 'Muy juguetona, le gusta el atún. Vacunas al día.',
        },
      },
      'Ave exótica': {
        summary: 'Registrar ave con datos veterinarios',
        value: {
          name: 'Piolín',
          species: 'BIRD',
          breed: 'Canario',
          birthDate: '2023-01-10',
          weight: 0.025,
          notes: 'Jaula grande necesaria. Alimentación especial para canarios.',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Mascota registrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        ownerId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        name: { type: 'string', example: 'Max' },
        species: {
          type: 'string',
          enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'OTHER'],
        },
        breed: { type: 'string', nullable: true, example: 'Golden Retriever' },
        birthDate: {
          type: 'string',
          format: 'date',
          nullable: true,
          example: '2022-03-15',
        },
        weight: { type: 'number', nullable: true, example: 25.5 },
        imageUrl: {
          type: 'string',
          nullable: true,
          example: 'https://example.com/max.jpg',
        },
        notes: {
          type: 'string',
          nullable: true,
          example: 'Alergias: pollo, vacunas al día',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos en la solicitud',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'name should not be empty',
            'species must be one of the following values: DOG, CAT, BIRD, RABBIT, HAMSTER, OTHER',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async createMyPet(
    @CurrentUser('id') userId: string,
    @Body() createPetDto: CreateMyPetDto,
  ) {
    return this.petsService.create({
      ...createPetDto,
      ownerId: userId,
    });
  }

  /**
   * PATCH /api/pets/me/:id - Actualiza una mascota del usuario autenticado
   */
  @Patch('me/:id')
  @ApiOperation({
    summary: 'Actualizar mascota',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la mascota a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdatePetDto,
    description: 'Campos a actualizar',
    examples: {
      'Actualizar peso y notas': {
        summary: 'Actualizar información médica',
        value: {
          weight: 26.5,
          notes: 'Vacunas al día, alergia a pollo. Muy activo y juguetón.',
        },
      },
      'Cambiar nombre': {
        summary: 'Cambiar nombre de mascota',
        value: {
          name: 'Maximus',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Mascota actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        ownerId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        name: { type: 'string', example: 'Maximus' },
        species: {
          type: 'string',
          enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'OTHER'],
        },
        breed: { type: 'string', nullable: true, example: 'Golden Retriever' },
        birthDate: { type: 'string', format: 'date', nullable: true },
        weight: { type: 'number', example: 26.5 },
        imageUrl: { type: 'string', nullable: true },
        notes: {
          type: 'string',
          example: 'Vacunas al día, alergia a pollo. Muy activo y juguetón.',
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Intento de actualizar mascota de otro usuario',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'No tienes permiso para modificar esta mascota',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos en la solicitud',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['weight must be a positive number'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async updateMyPet(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    // Verify ownership before updating
    const pet = await this.petsService.findOne(id);
    if (pet.ownerId !== userId) {
      throw new Error('No tienes permiso para modificar esta mascota');
    }
    return this.petsService.update(id, updatePetDto);
  }

  /**
   * DELETE /api/pets/me/:id - Elimina una mascota del usuario autenticado
   */
  @Delete('me/:id')
  @ApiOperation({
    summary: 'Eliminar mascota',
    description: `
    Permite eliminar permanentemente una mascota del sistema.

    **Consideraciones importantes:**
    - Esta acción no se puede deshacer
    - Solo el propietario puede eliminar su mascota
    - Si la mascota tiene citas pendientes, se recomienda cancelarlas primero

    **Nota:** Para preservar la integridad de datos históricos, las mascotas eliminadas
    podrían mantenerse en la base de datos con un flag de "eliminada" en lugar de
    eliminación física.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la mascota a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiOkResponse({
    description: 'Mascota eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Mascota eliminada exitosamente' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Intento de eliminar mascota de otro usuario',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'No tienes permiso para eliminar esta mascota',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Mascota no encontrada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Pet with ID 550e8400-e29b-41d4-a716-446655440000 not found',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async removeMyPet(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    // Verify ownership before deleting
    const pet = await this.petsService.findOne(id);
    if (pet.ownerId !== userId) {
      throw new Error('No tienes permiso para eliminar esta mascota');
    }
    return this.petsService.remove(id);
  }

  // ============================================
  // PET MANAGEMENT (Endpoints para admins/sistema)
  // ============================================

  @Public()
  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  findAll(@Query('ownerId') ownerId?: string) {
    if (ownerId) {
      return this.petsService.findByOwner(ownerId);
    }
    return this.petsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petsService.update(id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.remove(id);
  }
}
