import { InMemoryCheckInRepository } from '@/repositories/inMemory/inMemoryCheckInRepository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResourceNotFoundError } from '../errors/resourceNotFoundError';
import { ValidateCheckInUseCase } from './validateCheckIn';
import { LateCheckInValidationError } from '../errors/lateCheckInValidationError';

let inMemoryCheckInRepository: InMemoryCheckInRepository;
let validateCheckInUseCase: ValidateCheckInUseCase;

describe('CheckIn UseCase', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(
      inMemoryCheckInRepository,
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to validate check-in', async () => {
    const createdCheckIn = await inMemoryCheckInRepository.create({
      user_id: 'FakeUserId-001',
      gym_id: 'FakeGymId-001',
    });

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(inMemoryCheckInRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    );
  });

  it('Should not be able to validate an inexistent check-in', async () => {
    await expect(
      validateCheckInUseCase.execute({
        checkInId: 'FakeCheckInId',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('Should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2025, 0, 7, 10, 40));

    const createdCheckIn = await inMemoryCheckInRepository.create({
      user_id: 'FakeUserId-001',
      gym_id: 'FakeGymId-001',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
