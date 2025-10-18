import { PrismaCheckInRepository } from '@/repositories/prisma/prismaCheckInRepository';
import { FetchUserCheckInHistoryUseCase } from '../fetchUserCheckInsHistory';

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInHistoryUseCase(
    prismaCheckInRepository,
  );

  return fetchUserCheckInsHistoryUseCase;
}
