import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateReviewDto, UpdateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: dto,
      include: {
        author: { include: { profile: true } },
      },
    });
  }

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        author: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        author: { include: { profile: true } },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByClinic(clinicId: string) {
    return this.prisma.review.findMany({
      where: { targetId: clinicId },
      include: {
        author: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByFreelancer(freelancerId: string) {
    return this.prisma.review.findMany({
      where: { targetId: freelancerId },
      include: {
        author: { include: { profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAuthor(authorId: string) {
    return this.prisma.review.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClinicAverageRating(clinicId: string) {
    const result = await this.prisma.review.aggregate({
      where: { targetId: clinicId },
      _avg: { rating: true },
      _count: true,
    });

    return {
      averageRating: result._avg?.rating || 0,
      totalReviews: result._count,
    };
  }

  async getFreelancerAverageRating(freelancerId: string) {
    const result = await this.prisma.review.aggregate({
      where: { targetId: freelancerId },
      _avg: { rating: true },
      _count: true,
    });

    return {
      averageRating: result._avg?.rating || 0,
      totalReviews: result._count,
    };
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.findOne(id);

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        author: { include: { profile: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.review.delete({ where: { id } });
  }
}
