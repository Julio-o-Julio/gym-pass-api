import { PrismaCheckInRepository } from '@/repositories/prisma/prismaCheckInRepository';
import { ValidateCheckInUseCase } from '../validateCheckIn';

export function makeValidateCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository();
  const validateCheckInUseCase = new ValidateCheckInUseCase(
    prismaCheckInRepository,
  );

  return validateCheckInUseCase;
}
