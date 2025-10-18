import { PrismaGymRepository } from '@/repositories/prisma/prismaGymRepository';
import { CreateGymUseCase } from '../createGym';

export function makeCreateGymUseCase() {
  const prismaGymRepository = new PrismaGymRepository();
  const createGymUseCase = new CreateGymUseCase(prismaGymRepository);

  return createGymUseCase;
}
