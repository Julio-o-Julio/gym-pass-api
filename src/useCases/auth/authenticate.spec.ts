import { InMemoryUserRepository } from '@/repositories/inMemory/inMemoryUserRepository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidCredentialsError } from '../errors/invalidCredentialsError';
import { AuthenticateUseCase } from './authenticate';

let inMemoryUserRepository: InMemoryUserRepository;
let authenticateUseCase: AuthenticateUseCase;

describe('Authenticate User UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    authenticateUseCase = new AuthenticateUseCase(inMemoryUserRepository);
  });

  it('Should be able to authenticate', async () => {
    await inMemoryUserRepository.create({
      name: 'Fake Name',
      email: 'fakeEmail@gmail.com',
      password_hash: await hash('FakePassword', 8),
    });

    const { user } = await authenticateUseCase.execute({
      email: 'fakeEmail@gmail.com',
      password: 'FakePassword',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should not be able to authenticate with wrong email', async () => {
    await expect(
      authenticateUseCase.execute({
        email: 'fakeEmail@gmail.com',
        password: 'FakePassword',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await inMemoryUserRepository.create({
      name: 'Fake Name',
      email: 'fakeEmail@gmail.com',
      password_hash: await hash('FakePassword', 8),
    });

    await expect(
      authenticateUseCase.execute({
        email: 'fakeEmail@gmail.com',
        password: 'FakePasswordFalse',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
