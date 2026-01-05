import { SetMetadata } from '@nestjs/common';

/**
 * Clave para identificar endpoints públicos
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() - Marca un endpoint como público (no requiere autenticación)
 *
 * Uso:
 *   @Public()
 *   @Get('health')
 *   healthCheck() { return 'OK'; }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
