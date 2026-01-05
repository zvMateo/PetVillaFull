import { SetMetadata } from '@nestjs/common';

/**
 * Clave para identificar los roles requeridos
 */
export const ROLES_KEY = 'roles';

/**
 * @Roles() - Define qué roles pueden acceder a un endpoint
 *
 * Uso:
 *   @Roles('CLINIC', 'FREELANCER')
 *   @Post('services')
 *   createService() { ... }
 *
 * Solo usuarios con rol CLINIC o FREELANCER pueden acceder
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
