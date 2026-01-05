import { IsEmail, IsString, IsEnum } from 'class-validator';

// Enum específico para roles que pueden registrarse directamente
export enum RegisterRole {
  CONSUMER = 'CONSUMER',
  VET_INDIVIDUAL = 'VET_INDIVIDUAL',
  CLINIC_ADMIN = 'CLINIC_ADMIN',
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(RegisterRole, {
    message:
      'Rol inválido. Solo se permiten: CONSUMER, VET_INDIVIDUAL, CLINIC_ADMIN',
  })
  role: RegisterRole;
}
