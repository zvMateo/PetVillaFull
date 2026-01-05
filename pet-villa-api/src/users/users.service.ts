import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateUserDto, UpdateUserDto, CreateClinicEmployeeDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
        freelancerProfile: true,
        clinicMemberships: {
          include: { clinic: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        freelancerProfile: true,
        clinicMemberships: {
          include: { clinic: true },
        },
        pets: true,
        appointments: {
          take: 5,
          orderBy: { dateTime: 'desc' },
        },
        reviewsAuthored: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Obtiene el saldo total de puntos de un usuario
   * Suma todas las transacciones de puntos (positivas y negativas)
   */
  async getPointsBalance(userId: string) {
    const result = await this.prisma.pointTransaction.aggregate({
      where: { consumerId: userId },
      _sum: { amount: true },
    });

    const transactions = await this.prisma.pointTransaction.findMany({
      where: { consumerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      userId,
      totalPoints: result._sum?.amount || 0,
      recentTransactions: transactions,
    };
  }

  /**
   * Crea un empleado de clínica (solo puede ser llamado por CLINIC_ADMIN)
   * El empleado se asocia automáticamente a la clínica del admin
   */
  async createClinicEmployee(
    adminUserId: string,
    dto: CreateClinicEmployeeDto,
  ): Promise<any> {
    // Verificar que el admin tenga una clínica
    const adminClinic = await this.prisma.clinicMember.findFirst({
      where: {
        userId: adminUserId,
        role: 'ADMIN',
      },
      include: { clinic: true },
    });

    if (!adminClinic) {
      throw new ForbiddenException(
        'Solo los administradores de clínica pueden crear empleados',
      );
    }

    // Verificar que el email no esté registrado
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ForbiddenException('Este email ya está registrado');
    }

    // Crear el usuario empleado con hash de contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const employee = await this.prisma.$transaction(async (tx) => {
      // Crear usuario
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          role: 'CLINIC_EMPLOYEE',
        },
      });

      // Crear perfil básico
      await tx.profile.create({
        data: {
          userId: user.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      // Asociar como empleado de la clínica
      await tx.clinicMember.create({
        data: {
          userId: user.id,
          clinicId: adminClinic.clinicId,
          role: 'EMPLOYEE',
        },
      });

      return user;
    });

    return employee;
  }

  /**
   * Obtiene todos los empleados de la clínica de un admin
   */
  async getClinicEmployees(adminUserId: string) {
    // Verificar que el admin tenga una clínica
    const adminClinic = await this.prisma.clinicMember.findFirst({
      where: {
        userId: adminUserId,
        role: 'ADMIN',
      },
      include: { clinic: true },
    });

    if (!adminClinic) {
      throw new ForbiddenException(
        'Solo los administradores de clínica pueden ver empleados',
      );
    }

    // Obtener empleados de la clínica
    return this.prisma.clinicMember.findMany({
      where: {
        clinicId: adminClinic.clinicId,
        role: 'EMPLOYEE',
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }
}
