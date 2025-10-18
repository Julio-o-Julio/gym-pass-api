import { prisma } from '@/infra/database/prisma/prisma';
import { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { CheckInRepository } from '../checkInRepository';

export class PrismaCheckInRepository implements CheckInRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
    });

    if (!checkIn) return null;

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInSameDate = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkInSameDate;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: { user_id: userId },
    });

    return count;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: checkIn,
    });

    return updatedCheckIn;
  }
}
