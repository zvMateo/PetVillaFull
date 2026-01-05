import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma';

interface RequestWithUser {
  user?: {
    sub: string;
    email: string;
  };
}

/**
 * RolesGuard - Verifica que el usuario tenga el rol requerido
 *
 * Uso en un controller:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles('CLINIC', 'FREELANCER')
 *   @Post('services')
 *   createService() { ... }
 *
 * Primero JwtAuthGuard valida el token, luego RolesGuard verifica el rol
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtiene los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles requeridos, permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtiene el usuario del request (puesto por JwtAuthGuard)
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.sub;

    if (!userId) {
      return false;
    }

    // Busca el usuario en la BD para obtener su rol
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return false;
    }

    // Verifica si el rol del usuario está en los roles permitidos
    return requiredRoles.includes(user.role);
  }
}
