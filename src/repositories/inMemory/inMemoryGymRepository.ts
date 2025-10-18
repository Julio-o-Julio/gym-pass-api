import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetwweenCoordinates';
import { Gym, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/binary';
import { v7 as uuidv7 } from 'uuid';
import { GymRepository } from '../gymRepository';

export class InMemoryGymRepository implements GymRepository {
  public gyms: Gym[] = [];

  async create(data: Prisma.GymUncheckedCreateInput) {
    const gym = {
      id: data.id ?? uuidv7(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((item) => item.id === id);

    if (!gym) return null;

    return gym;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby(
    userLatitude: number,
    userLongitude: number,
    page: number,
  ): Promise<Gym[]> {
    return this.gyms
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: userLatitude,
            longitude: userLongitude,
          },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        );

        return distance < 10;
      })
      .slice((page - 1) * 20, page * 20);
  }
}
