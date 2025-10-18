import { InMemoryGymRepository } from '@/repositories/inMemory/inMemoryGymRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsUseCase } from './fetchNearbyGyms';

let inMemoryGymsRepository: InMemoryGymRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe('Search Gyms UseCase', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(inMemoryGymsRepository);
  });

  it('Should be able to fetch nearby gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Fake Far Gym JS 01',
      latitude: -20.4679858,
      longitude: -52.6125893,
    });

    await inMemoryGymsRepository.create({
      title: 'Fake Near Gym TS 02',
      latitude: -20.4679858,
      longitude: -54.6125893,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -20.4634958,
      userLongitude: -54.6125893,
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fake Near Gym TS 02' }),
    ]);
  });

  it('Should be able to fetch pagination nearby gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `Fake Gym ${i}`,
        latitude: -20.4679858,
        longitude: -54.6125893,
      });
    }

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -20.4634958,
      userLongitude: -54.6125893,
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fake Gym 21' }),
      expect.objectContaining({ title: 'Fake Gym 22' }),
    ]);
  });
});
