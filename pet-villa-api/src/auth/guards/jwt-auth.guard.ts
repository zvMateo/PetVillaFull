import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JwtAuthGuard - Protege endpoints que requieren autenticación
 *
 * Uso en un controller:
 *   @UseGuards(JwtAuthGuard)
 *   @Get('profile')
 *   getProfile() { ... }
 *
 * Si el token es inválido o no existe, responde 401 Unauthorized
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Verifica si el endpoint es público antes de validar el token
   */
  canActivate(context: ExecutionContext) {
    // Busca si el endpoint tiene el decorador @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si es público, permite el acceso sin token
    if (isPublic) {
      return true;
    }

    // Si no es público, valida el token JWT
    return super.canActivate(context);
  }
}
