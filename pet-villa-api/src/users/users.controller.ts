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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, CreateClinicEmployeeDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Public, Roles, CurrentUser } from '../auth/decorators';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

/**
 * UsersController con autenticación
 *
 * Por defecto, todos los endpoints requieren autenticación (JwtAuthGuard)
 * Usamos @Public() para endpoints que no requieren login
 * Usamos @Roles() para restringir por rol
 */
@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/users/me - Obtiene el usuario actual (autenticado)
   * Usa el decorador @CurrentUser() para extraer el userId del token
   */
  @Get('me')
  @ApiOperation({
    summary: 'Obtener datos del usuario actual',
  })
  @ApiOkResponse({
    description: 'Datos del usuario obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
        email: { type: 'string', example: 'maria.garcia@email.com' },
        role: {
          type: 'string',
          enum: [
            'CONSUMER',
            'VET_INDIVIDUAL',
            'CLINIC_ADMIN',
            'CLINIC_EMPLOYEE',
          ],
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        profile: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string', example: 'María' },
            lastName: { type: 'string', example: 'García' },
            phone: { type: 'string', nullable: true, example: '+54911234567' },
            avatarUrl: { type: 'string', nullable: true },
          },
        },
        pets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'Max' },
              species: {
                type: 'string',
                enum: ['DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'OTHER'],
              },
              breed: { type: 'string', nullable: true },
              birthDate: { type: 'string', format: 'date', nullable: true },
              weight: { type: 'number', nullable: true },
              imageUrl: { type: 'string', nullable: true },
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
  async getMe(@CurrentUser('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  /**
   * POST /api/users/clinic/employee - Crea un empleado de clínica (solo CLINIC_ADMIN)
   * El empleado se asocia automáticamente a la clínica del admin
   */
  @Post('clinic/employee')
  @Roles(Role.CLINIC_ADMIN)
  @ApiOperation({
    summary: 'Crear empleado de clínica',
    description: `
    Permite a un administrador de clínica crear cuentas para empleados.

    **Funcionalidades:**
    - Solo administradores de clínica pueden crear empleados
    - El empleado se asocia automáticamente a la clínica del admin
    - Se crea un perfil básico con nombre y apellido
    - El empleado obtiene el rol CLINIC_EMPLOYEE
    `,
  })
  @ApiBody({
    type: CreateClinicEmployeeDto,
    description: 'Datos del nuevo empleado',
    examples: {
      'Nuevo empleado': {
        summary: 'Crear cuenta para recepcionista',
        value: {
          email: 'recepcion@clinicaveterinaria.com',
          password: 'VetRecep2024!',
          firstName: 'Ana',
          lastName: 'Rodríguez',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Empleado creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
        email: { type: 'string', example: 'recepcion@clinicaveterinaria.com' },
        role: { type: 'string', example: 'CLINIC_EMPLOYEE' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Usuario no es administrador de clínica o email ya registrado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Solo los administradores de clínica pueden crear empleados',
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
          example: ['firstName should not be empty', 'email must be an email'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async createClinicEmployee(
    @CurrentUser('id') adminUserId: string,
    @Body() createEmployeeDto: CreateClinicEmployeeDto,
  ): Promise<any> {
    return await this.usersService.createClinicEmployee(
      adminUserId,
      createEmployeeDto,
    );
  }

  /**
   * GET /api/users/clinic/employees - Lista empleados de la clínica (solo CLINIC_ADMIN)
   */
  @Get('clinic/employees')
  @Roles(Role.CLINIC_ADMIN)
  @ApiOperation({
    summary: 'Listar empleados de la clínica',
    description: `
    Permite a un administrador de clínica ver todos los empleados asociados a su clínica.

    **Información incluida:**
    - Datos básicos del empleado (email, nombre, apellido)
    - Fecha de incorporación a la clínica
    - Perfil completo del empleado
    `,
  })
  @ApiOkResponse({
    description: 'Lista de empleados obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          clinicId: { type: 'string' },
          role: { type: 'string', example: 'EMPLOYEE' },
          joinedAt: { type: 'string', format: 'date-time' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: {
                type: 'string',
                example: 'recepcion@clinicaveterinaria.com',
              },
              role: { type: 'string', example: 'CLINIC_EMPLOYEE' },
              profile: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string' },
                  firstName: { type: 'string', example: 'Ana' },
                  lastName: { type: 'string', example: 'Rodríguez' },
                  phone: { type: 'string', nullable: true },
                  avatarUrl: { type: 'string', nullable: true },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Usuario no es administrador de clínica',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Solo los administradores de clínica pueden ver empleados',
        },
        error: { type: 'string', example: 'Forbidden' },
        statusCode: { type: 'number', example: 403 },
      },
    },
  })
  async getClinicEmployees(
    @CurrentUser('id') adminUserId: string,
  ): Promise<any> {
    return await this.usersService.getClinicEmployees(adminUserId);
  }

  /**
   * POST /api/users - Crea un usuario
   * Este endpoint es público porque se llama después del registro en Auth0
   */
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /api/users - Lista todos los usuarios
   * Requiere autenticación (por el guard a nivel de clase)
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /api/users/:id - Obtiene un usuario por ID
   */
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /api/users/:id - Actualiza un usuario
   */
  @Patch(':id')
  @Roles(Role.CLINIC_ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * GET /api/users/:id/points - Obtiene el saldo de puntos del usuario
   */
  @Public()
  @Get(':id/points')
  getPointsBalance(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getPointsBalance(id);
  }

  /**
   * DELETE /api/users/:id - Elimina un usuario
   * Solo ADMIN podría hacer esto (ejemplo de uso de @Roles)
   */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
