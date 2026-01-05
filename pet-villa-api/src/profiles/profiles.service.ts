import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  CreateProfileDto,
  CreateClinicProfileDto,
  CreateFreelancerProfileDto,
  UpdateProfileDto,
  UpdateClinicProfileDto,
  UpdateFreelancerProfileDto,
} from './dto';

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
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // USER PROFILE (Common for all users)
  // ============================================

  async createProfile(dto: CreateProfileDto) {
    return this.prisma.profile.create({
      data: dto,
    });
  }

  async findProfileByUserId(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findProfileByUserId(userId);

    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }

  // ============================================
  // CLINIC PROFILES
  // ============================================

  async createClinicProfile(dto: CreateClinicProfileDto, adminUserId?: string) {
    const clinic = await this.prisma.clinicProfile.create({
      data: dto,
    });

    // If adminUserId provided, add as admin member
    if (adminUserId) {
      await this.prisma.clinicMember.create({
        data: {
          userId: adminUserId,
          clinicId: clinic.id,
          role: 'ADMIN',
        },
      });
    }

    return clinic;
  }

  async findClinicById(id: string) {
    // First get the basic clinic data with coordinates
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
      WHERE id = ${id}::uuid
    `;

    if (!clinicsWithCoords || clinicsWithCoords.length === 0) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    const clinicData = clinicsWithCoords[0];

    // Get members and services using Prisma
    const [members, services] = await Promise.all([
      this.prisma.clinicMember.findMany({
        where: { clinicId: id },
        include: {
          user: { include: { profile: true } },
        },
      }),
      this.prisma.service.findMany({
        where: { clinicId: id, isActive: true },
      }),
    ]);

    return {
      ...clinicData,
      members,
      services,
    };
  }

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

  async updateClinicProfile(id: string, dto: UpdateClinicProfileDto) {
    await this.findClinicById(id);

    return this.prisma.clinicProfile.update({
      where: { id },
      data: dto,
    });
  }

  // ============================================
  // FREELANCER PROFILES
  // ============================================

  async createFreelancerProfile(dto: CreateFreelancerProfileDto) {
    return this.prisma.freelancerProfile.create({
      data: dto,
    });
  }

  async findFreelancerById(id: string) {
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
      WHERE fp.id = ${id}::uuid
    `;

    if (!freelancersWithCoords || freelancersWithCoords.length === 0) {
      throw new NotFoundException(`Freelancer profile with ID ${id} not found`);
    }

    const freelancerData = freelancersWithCoords[0];

    // Get services using Prisma
    const services = await this.prisma.service.findMany({
      where: { freelancerId: id, isActive: true },
    });

    // Get user data
    const user = await this.prisma.user.findUnique({
      where: { id: freelancerData.userId },
      include: { profile: true },
    });

    return {
      ...freelancerData,
      services,
      user,
    };
  }

  async findFreelancerByUserId(userId: string) {
    const profile = await this.prisma.freelancerProfile.findUnique({
      where: { userId },
      include: {
        user: { include: { profile: true } },
        services: true,
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Freelancer profile for user ${userId} not found`,
      );
    }

    return profile;
  }

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

  async updateFreelancerProfile(
    userId: string,
    dto: UpdateFreelancerProfileDto,
  ) {
    await this.findFreelancerByUserId(userId);

    return this.prisma.freelancerProfile.update({
      where: { userId },
      data: dto,
    });
  }
}
