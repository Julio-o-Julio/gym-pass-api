import { InMemoryCheckInRepository } from '@/repositories/inMemory/inMemoryCheckInRepository';
import { InMemoryGymRepository } from '@/repositories/inMemory/inMemoryGymRepository';
import { Gym } from '@prisma/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MaxDistanceError } from '../errors/maxDistanceError';
import { MaxNumberOfCheckInsError } from '../errors/maxNumberOfCheckInsError';
import { CheckInUseCase } from './checkIn';

let inMemoryCheckInRepository: InMemoryCheckInRepository;
let inMemoryGymRepository: InMemoryGymRepository;
let checkInUseCase: CheckInUseCase;

let gym: Gym;

describe('CheckIn UseCase', () => {
  beforeEach(async () => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository();
    inMemoryGymRepository = new InMemoryGymRepository();
    checkInUseCase = new CheckInUseCase(
      inMemoryCheckInRepository,
      inMemoryGymRepository,
    );

    gym = await inMemoryGymRepository.create({
      title: 'Fake Title Gym',
      latitude: -20.4679858,
      longitude: -54.6125893,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'FakeUserId-001',
      gymId: gym.id,
      userLatitude: -20.4679858,
      userLongitude: -54.6125893,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 10, 0, 0));

    await checkInUseCase.execute({
      userId: 'FakeUserId-001',
      gymId: gym.id,
      userLatitude: -20.4679858,
      userLongitude: -54.6125893,
    });

    await expect(
      checkInUseCase.execute({
        userId: 'FakeUserId-001',
        gymId: gym.id,
        userLatitude: -20.4679858,
        userLongitude: -54.6125893,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('Should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 10, 0, 0));

    await checkInUseCase.execute({
      userId: 'FakeUserId-001',
      gymId: gym.id,
      userLatitude: -20.4679858,
      userLongitude: -54.6125893,
    });

    vi.setSystemTime(new Date(2025, 0, 21, 11, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      userId: 'FakeUserId-001',
      gymId: gym.id,
      userLatitude: -20.4679858,
      userLongitude: -54.6125893,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('Should be able to check in on distant gym', async () => {
    await expect(
      checkInUseCase.execute({
        userId: 'FakeUserId-001',
        gymId: gym.id,
        userLatitude: -20.4634958,
        userLongitude: -54.6125893,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
