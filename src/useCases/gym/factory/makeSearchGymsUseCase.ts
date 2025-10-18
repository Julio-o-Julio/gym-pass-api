import { PrismaGymRepository } from '@/repositories/prisma/prismaGymRepository';
import { SearchGymsUseCase } from '../searchGyms';

export function makeSearchGymsUseCase() {
  const prismaGymRepository = new PrismaGymRepository();
  const searchGymsUseCase = new SearchGymsUseCase(prismaGymRepository);

  return searchGymsUseCase;
}
