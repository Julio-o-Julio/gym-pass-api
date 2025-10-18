import { PrismaGymRepository } from '@/repositories/prisma/prismaGymRepository';
import { FetchNearbyGymsUseCase } from '../fetchNearbyGyms';

export function makeFetchNearbyGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository();
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(
    prismaGymRepository,
  );

  return fetchNearbyGymsUseCase;
}
