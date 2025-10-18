import { PrismaCheckInRepository } from '@/repositories/prisma/prismaCheckInRepository';
import { GetUserMetricsUseCase } from '../getUserMetrics';

export function makeGetUserMetricsUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository();
  const getUserMetricsUseCase = new GetUserMetricsUseCase(
    prismaCheckInRepository,
  );

  return getUserMetricsUseCase;
}
