import { InMemoryGymRepository } from '@/repositories/inMemory/inMemoryGymRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsUseCase } from './searchGyms';

let inMemoryGymsRepository: InMemoryGymRepository;
let searchGymsUseCase: SearchGymsUseCase;

describe('Search Gyms UseCase', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymRepository();
    searchGymsUseCase = new SearchGymsUseCase(inMemoryGymsRepository);
  });

  it('Should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Fake Gym JS 01',
      latitude: 123,
      longitude: -123,
    });

    await inMemoryGymsRepository.create({
      title: 'Fake Gym TS 02',
      latitude: 321,
      longitude: -321,
    });

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Js',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fake Gym JS 01' }),
    ]);
  });

  it('Should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `Fake Gym ${i}`,
        latitude: i * 30,
        longitude: i * -30,
      });
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Fake',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Fake Gym 21' }),
      expect.objectContaining({ title: 'Fake Gym 22' }),
    ]);
  });
});
