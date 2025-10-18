import { prisma } from '@/infra/database/prisma/prisma';
import { Gym, Prisma } from '@prisma/client';
import { GymRepository } from '../gymRepository';

export class PrismaGymRepository implements GymRepository {
  async create(data: Prisma.GymUncheckedCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: { id },
    });

    if (!gym) return null;

    return gym;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }

  async findManyNearby(
    userLatitude: number,
    userLongitude: number,
    page: number,
  ): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        LIMIT 20
        OFFSET ${(page - 1) * 20}
    `;

    return gyms;
  }
}
