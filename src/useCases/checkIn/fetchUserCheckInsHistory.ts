import { CheckInRepository } from '@/repositories/checkInRepository';
import { CheckIn } from '@prisma/client';

interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string;
  page: number;
}
interface FetchUserCheckInHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInHistoryUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page,
    );

    return { checkIns };
  }
}
