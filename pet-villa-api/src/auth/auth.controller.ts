import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma';
import { RegisterDto } from './dto';
import { Public } from './decorators';
import * as bcrypt from 'bcrypt';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

type JwtPayload = { sub: string; email: string };

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly accessExpiresIn = '1h';
  private readonly refreshExpiresIn = '7d';

  private signTokens(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload, {
      expiresIn: this.accessExpiresIn,
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiresIn,
      secret:
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret',
    });
    return { access_token, refresh_token };
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: `
    Registra un nuevo usuario en PetVilla con uno de los roles permitidos.

    **Roles disponibles:**
    - \`CONSUMER\` - Dueño de mascota
    - \`VET_INDIVIDUAL\` - Veterinario independiente
    - \`CLINIC_ADMIN\` - Administrador de clínica veterinaria

    **Nota:** Los empleados de clínica (\`CLINIC_EMPLOYEE\`) deben ser creados por administradores de clínica.
    `,
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Datos del nuevo usuario',
    examples: {
      'Dueño de mascota': {
        summary: 'Registro como dueño de mascota',
        value: {
          email: 'maria.garcia@email.com',
          password: 'SecurePass123!',
          role: 'CONSUMER',
        },
      },
      'Veterinario independiente': {
        summary: 'Registro como veterinario independiente',
        value: {
          email: 'dr.perez.vet@email.com',
          password: 'VetSecure456!',
          role: 'VET_INDIVIDUAL',
        },
      },
      'Administrador de clínica': {
        summary: 'Registro como administrador de clínica',
        value: {
          email: 'admin@clinicaveterinaria.com',
          password: 'ClinicAdmin789!',
          role: 'CLINIC_ADMIN',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: { type: 'string', example: 'maria.garcia@email.com' },
            role: {
              type: 'string',
              enum: ['CONSUMER', 'VET_INDIVIDUAL', 'CLINIC_ADMIN'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token de acceso JWT (válido 1 hora)',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token de refresco JWT (válido 7 días)',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o email ya registrado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'El email ya está registrado. Por favor, usa otro email o inicia sesión.',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async register(@Body() dto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
        },
      });

      const tokens = this.signTokens(user);
      return { user, ...tokens };
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        // Unique constraint failed (email already exists)
        throw new Error(
          'El email ya está registrado. Por favor, usa otro email o inicia sesión.',
        );
      } else {
        console.error(error);
        throw new Error('Error al registrar usuario');
      }
    }
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
  })
  @ApiBody({
    description: 'Credenciales de login',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'maria.garcia@email.com',
          description: 'Email del usuario registrado',
        },
        password: {
          type: 'string',
          minLength: 6,
          example: 'SecurePass123!',
          description: 'Contraseña del usuario',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Login exitoso - tokens generados',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token de acceso JWT (válido 1 hora)',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token de refresco JWT (válido 7 días)',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  login(@Request() req: { user: { id: string; email: string } }) {
    const user = req.user;
    const tokens = this.signTokens(user);
    return { ...tokens };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refrescar tokens JWT',
    description: `
    Genera nuevos tokens JWT usando un refresh token válido.

    Cuando el access token expira (después de 1 hora), utiliza el refresh token
    para obtener nuevos tokens sin requerir que el usuario se loguee nuevamente.

    El refresh token es válido por 7 días.
    `,
  })
  @ApiBody({
    description: 'Refresh token para generar nuevos tokens',
    schema: {
      type: 'object',
      required: ['refresh_token'],
      properties: {
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token de refresco obtenido en login/registro',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Tokens refrescados exitosamente',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Nuevo token de acceso JWT (válido 1 hora)',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Nuevo token de refresco JWT (válido 7 días)',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido o expirado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Refresh token inválido o expirado',
        },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'secret',
      });
      const user = { id: payload.sub, email: payload.email };
      const tokens = this.signTokens(user);
      return { ...tokens };
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Request() req: { user: { id: string; role: string } }) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
          },
        },
        pets: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            birthDate: true,
            weight: true,
            imageUrl: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // If user is a freelancer, get their specialized profile
    let freelancerProfile: {
      id: string;
      bio: string | null;
      licenseNumber: string | null;
      specialties: string[];
      serviceRadiusKm: number;
    } | null = null;
    if (user.role === 'VET_INDIVIDUAL') {
      freelancerProfile = await this.prisma.freelancerProfile.findUnique({
        where: { userId: user.id },
        select: {
          id: true,
          bio: true,
          licenseNumber: true,
          specialties: true,
          serviceRadiusKm: true,
        },
      });
    }

    return {
      user: {
        ...user,
        freelancerProfile,
      },
    };
  }
}
