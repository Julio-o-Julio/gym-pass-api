import { InMemoryGymRepository } from '@/repositories/inMemory/inMemoryGymRepository';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateGymUseCase } from './createGym';

let inMemoryGymRepository: InMemoryGymRepository;
let createGymUseCase: CreateGymUseCase;

describe('Create Gym UseCase', () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymRepository();
    createGymUseCase = new CreateGymUseCase(inMemoryGymRepository);
  });

  it('Should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Fake Gym',
      description: null,
      phone: null,
      latitude: -20.4679858,
      longitude: -54.6125893,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
