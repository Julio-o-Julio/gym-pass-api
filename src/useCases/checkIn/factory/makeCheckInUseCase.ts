import { PrismaCheckInRepository } from '@/repositories/prisma/prismaCheckInRepository';
import { PrismaGymRepository } from '@/repositories/prisma/prismaGymRepository';
import { CheckInUseCase } from '../checkIn';

export function makeCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository();
  const prismaGymRepository = new PrismaGymRepository();

  const checkInUseCase = new CheckInUseCase(
    prismaCheckInRepository,
    prismaGymRepository,
  );

  return checkInUseCase;
}
