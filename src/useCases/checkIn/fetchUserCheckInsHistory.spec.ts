import { InMemoryCheckInRepository } from '@/repositories/inMemory/inMemoryCheckInRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUserCheckInHistoryUseCase } from './fetchUserCheckInsHistory';

let inMemoryCheckInRepository: InMemoryCheckInRepository;
let fatchUserCheckInHistoryUseCase: FetchUserCheckInHistoryUseCase;

describe('CheckIn UseCase', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository();
    fatchUserCheckInHistoryUseCase = new FetchUserCheckInHistoryUseCase(
      inMemoryCheckInRepository,
    );
  });

  it('Should be able to fatch check-in history', async () => {
    await inMemoryCheckInRepository.create({
      user_id: 'FakeUserId-001',
      gym_id: 'FakeGymId-001',
    });

    await inMemoryCheckInRepository.create({
      user_id: 'FakeUserId-001',
      gym_id: 'FakeGymId-002',
    });

    const { checkIns } = await fatchUserCheckInHistoryUseCase.execute({
      userId: 'FakeUserId-001',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'FakeGymId-001' }),
      expect.objectContaining({ gym_id: 'FakeGymId-002' }),
    ]);
  });

  it('Should be able to fatch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInRepository.create({
        user_id: 'FakeUserId-001',
        gym_id: `FakeGymId-0${i}`,
      });
    }

    const { checkIns } = await fatchUserCheckInHistoryUseCase.execute({
      userId: 'FakeUserId-001',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'FakeGymId-021' }),
      expect.objectContaining({ gym_id: 'FakeGymId-022' }),
    ]);
  });
});
