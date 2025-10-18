import { InMemoryUserRepository } from '@/repositories/inMemory/inMemoryUserRepository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ResourceNotFoundError } from '../errors/resourceNotFoundError';
import { GetUserProfileUseCase } from './getUserProfile';

let inMemoryUserRepository: InMemoryUserRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe('Get User Profile UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(inMemoryUserRepository);
  });

  it('Should be able to get user profile', async () => {
    const { id } = await inMemoryUserRepository.create({
      name: 'Fake Name',
      email: 'fakeEmail@gmail.com',
      password_hash: await hash('FakePassword', 8),
    });

    const { user } = await getUserProfileUseCase.execute({
      userId: id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('Fake Name');
  });

  it('Should not be able to get user profile with wrong id', async () => {
    await expect(
      getUserProfileUseCase.execute({
        userId: 'Fake ID',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
