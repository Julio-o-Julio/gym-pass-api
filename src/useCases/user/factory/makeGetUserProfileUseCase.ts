import { PrismaUserRepository } from '@/repositories/prisma/prismaUserRepository';
import { GetUserProfileUseCase } from '../getUserProfile';

export function makeGetUserProfileUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(prismaUserRepository);

  return getUserProfileUseCase;
}
