import { GymRepository } from '@/repositories/gymRepository';
import { Gym } from '@prisma/client';

interface GymUseCaseRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface GymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    title,
    description,
    latitude,
    longitude,
  }: GymUseCaseRequest): Promise<GymUseCaseResponse> {
    const gym = await this.gymRepository.create({
      title,
      description,
      latitude,
      longitude,
    });

    return { gym };
  }
}
