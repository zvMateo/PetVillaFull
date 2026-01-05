import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtUser {
  sub: string; // User ID
  id: string; // Alias for sub
  email: string;
  role: string;
  profile?: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  };
  iat?: number;
  exp?: number;
}

interface RequestWithUser {
  user?: JwtUser;
}

/**
 * @CurrentUser() - Obtiene los datos del usuario autenticado
 *
 * Uso:
 *   @Get('me')
 *   getMe(@CurrentUser() user: JwtUser) {
 *     console.log(user.sub);      // ID del usuario (JWT sub claim)
 *     console.log(user.id);       // Alias de sub
 *     console.log(user.email);    // Email
 *   }
 *
 * También podés extraer un campo específico:
 *   @Get('me')
 *   getMe(@CurrentUser('sub') userId: string) {
 *     console.log(userId);
 *   }
 *   // o usando 'id' como alias
 *   getMe(@CurrentUser('id') userId: string) {
 *     console.log(userId);
 *   }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Si se especifica un campo, retorna solo ese campo
    if (data && user) {
      return user[data as keyof JwtUser];
    }

    // Si no, retorna todo el objeto user
    return user;
  },
);
