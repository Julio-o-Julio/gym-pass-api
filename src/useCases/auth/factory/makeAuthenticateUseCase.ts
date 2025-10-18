import { PrismaUserRepository } from '@/repositories/prisma/prismaUserRepository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const prismaUserRepository = new PrismaUserRepository();
  const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository);

  return authenticateUseCase;
}
