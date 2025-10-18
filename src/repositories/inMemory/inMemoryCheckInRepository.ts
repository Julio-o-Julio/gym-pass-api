import { CheckIn, Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { v7 as uuidv7 } from 'uuid';
import { CheckInRepository } from '../checkInRepository';

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: data.id ?? uuidv7(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find((item) => item.id === id);

    if (!checkIn) return null;

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInSameDate) return null;

    return checkInSameDate;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter((item) => item.user_id === userId).length;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    );

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
