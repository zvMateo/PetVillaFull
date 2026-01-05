import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

interface ClinicWithLocation {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  is24Hours: boolean;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface FreelancerWithLocation {
  id: string;
  userId: string;
  bio: string | null;
  licenseNumber: string | null;
  specialties: string[];
  serviceRadiusKm: number;
  imageUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatarUrl: string | null;
}

@Injectable()
export class GeoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtiene todas las clínicas con coordenadas extraídas de PostGIS
   */
  async findAllClinics() {
    // Query raw para extraer lat/lng de geography
    const clinicsWithCoords = await this.prisma.$queryRaw<ClinicWithLocation[]>`
      SELECT 
        id,
        name,
        description,
        address,
        phone,
        email,
        website,
        "is24Hours" as "is24Hours",
        "imageUrl" as "imageUrl",
        ST_Y(location::geometry) as latitude,
        ST_X(location::geometry) as longitude
      FROM "ClinicProfile"
    `;

    // Get services for each clinic
    const clinicIds = clinicsWithCoords.map((c) => c.id);
    const services = await this.prisma.service.findMany({
      where: {
        clinicId: { in: clinicIds },
        isActive: true,
      },
    });

    // Combine data
    return clinicsWithCoords.map((clinic) => ({
      ...clinic,
      services: services.filter((s) => s.clinicId === clinic.id),
    }));
  }

  /**
   * Obtiene todos los veterinarios freelancers con coordenadas
   */
  async findAllFreelancers() {
    // Query raw para extraer lat/lng de geography
    const freelancersWithCoords = await this.prisma.$queryRaw<
      FreelancerWithLocation[]
    >`
      SELECT 
        fp.id,
        fp."userId" as "userId",
        fp.bio,
        fp."licenseNumber" as "licenseNumber",
        fp.specialties,
        fp."serviceRadiusKm" as "serviceRadiusKm",
        fp."imageUrl" as "imageUrl",
        ST_Y(fp."baseLocation"::geometry) as latitude,
        ST_X(fp."baseLocation"::geometry) as longitude,
        p."firstName" as "firstName",
        p."lastName" as "lastName",
        p.phone,
        p."avatarUrl" as "avatarUrl"
      FROM "FreelancerProfile" fp
      LEFT JOIN "Profile" p ON fp."userId" = p."userId"
    `;

    // Get services for each freelancer
    const freelancerIds = freelancersWithCoords.map((f) => f.id);
    const services = await this.prisma.service.findMany({
      where: {
        freelancerId: { in: freelancerIds },
        isActive: true,
      },
    });

    // Combine data with user profile structure
    return freelancersWithCoords.map((freelancer) => ({
      id: freelancer.id,
      userId: freelancer.userId,
      bio: freelancer.bio,
      licenseNumber: freelancer.licenseNumber,
      specialties: freelancer.specialties,
      serviceRadiusKm: freelancer.serviceRadiusKm,
      imageUrl: freelancer.imageUrl,
      latitude: freelancer.latitude,
      longitude: freelancer.longitude,
      user: {
        profile: {
          firstName: freelancer.firstName,
          lastName: freelancer.lastName,
          phone: freelancer.phone,
          avatarUrl: freelancer.avatarUrl,
        },
      },
      services: services.filter((s) => s.freelancerId === freelancer.id),
    }));
  }

  /**
   * Busca servicios por categoría
   */
  async findServicesByCategory(category: string) {
    // Servicios de clínicas
    const clinicServices = await this.prisma.service.findMany({
      where: {
        isActive: true,
        category,
        clinicId: { not: null },
      },
      include: {
        clinic: true,
      },
    });

    // Servicios de freelancers
    const freelancerServices = await this.prisma.service.findMany({
      where: {
        isActive: true,
        category,
        freelancerId: { not: null },
      },
      include: {
        freelancer: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return {
      clinicServices,
      freelancerServices,
    };
  }

  /**
   * Obtiene clínicas por nombre o descripción (búsqueda texto)
   */
  async searchClinics(query: string) {
    return this.prisma.clinicProfile.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            address: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        services: {
          where: { isActive: true },
        },
      },
    });
  }

  /**
   * Obtiene freelancers por especialidad o bio
   */
  async searchFreelancers(query: string) {
    return this.prisma.freelancerProfile.findMany({
      where: {
        OR: [
          {
            bio: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            specialties: {
              has: query,
            },
          },
          {
            user: {
              profile: {
                OR: [
                  {
                    firstName: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  {
                    lastName: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        services: {
          where: { isActive: true },
        },
      },
    });
  }

  /**
   * Actualiza la ubicación de una clínica
   */
  async updateClinicLocation(
    clinicId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _latitude: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _longitude: number,
  ) {
    // Por ahora guardamos como texto, luego migraremos a PostGIS
    return this.prisma.clinicProfile.update({
      where: { id: clinicId },
      data: {
        // Temporal: guardar como string hasta configurar PostGIS
        // location: `POINT(${longitude} ${latitude})`,
      },
    });
  }

  /**
   * Actualiza la ubicación base de un freelancer
   */
  async updateFreelancerLocation(
    freelancerId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _latitude: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _longitude: number,
  ) {
    return this.prisma.freelancerProfile.update({
      where: { id: freelancerId },
      data: {
        // Temporal: guardar como string hasta configurar PostGIS
        // baseLocation: `POINT(${longitude} ${latitude})`,
      },
    });
  }

  /**
   * Obtiene todas las categorías de servicios disponibles
   */
  async getServiceCategories() {
    const categories = await this.prisma.service.findMany({
      select: {
        category: true,
      },
      where: {
        isActive: true,
      },
      distinct: ['category'],
    });

    return categories.map((c) => c.category).filter(Boolean);
  }
}
