import { GymRepository } from '@/repositories/gymRepository';
import { Gym } from '@prisma/client';

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
  page: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymRepository.findManyNearby(
      userLatitude,
      userLongitude,
      page,
    );

    return { gyms };
  }
}
