import { InMemoryCheckInRepository } from '@/repositories/inMemory/inMemoryCheckInRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricsUseCase } from './getUserMetrics';

let inMemoryCheckInRepository: InMemoryCheckInRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe('CheckIn UseCase', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(
      inMemoryCheckInRepository,
    );
  });

  it('Should be able to get check-ins count from metrics', async () => {
    for (let i = 1; i <= 4; i++) {
      await inMemoryCheckInRepository.create({
        user_id: 'FakeUserId-001',
        gym_id: `FakeGymId-0${i}`,
      });
    }

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'FakeUserId-001',
    });

    expect(checkInsCount).toEqual(4);
  });
});
