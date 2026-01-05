import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma';

/**
 * JwtStrategy - Valida tokens JWT manuales
 *
 * Esta estrategia:
 * 1. Extrae el token del header Authorization: Bearer <token>
 * 2. Lo valida con la clave secreta
 * 3. Busca al usuario en la base de datos por ID
 * 4. Retorna un objeto con sub, email, role para uso en @CurrentUser()
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret',
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return consistent shape matching JwtUser interface used by @CurrentUser()
    return {
      sub: user.id,
      id: user.id, // Alias for convenience
      email: user.email,
      role: user.role,
      profile: user.profile,
    };
  }
}
