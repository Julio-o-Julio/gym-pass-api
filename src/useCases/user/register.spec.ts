import { InMemoryUserRepository } from '@/repositories/inMemory/inMemoryUserRepository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from '../errors/userAlreadyExistsError';
import { RegisterUseCase } from './register';

let inMemoryUserRepository: InMemoryUserRepository;
let registerUseCase: RegisterUseCase;

describe('User Register UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    registerUseCase = new RegisterUseCase(inMemoryUserRepository);
  });

  it('Should be able to user register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Fake Name',
      email: 'fakeEmail@gmail.com',
      password: 'FakePassword',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('Should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'Fake Name',
      email: 'fakeEmail@gmail.com',
      password: 'FakePassword',
    });

    const isPasswordCorrectlyHashed = await compare(
      'FakePassword',
      user.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('Should not be able to register with same email twice', async () => {
    await registerUseCase.execute({
      name: 'Fake Name',
      email: 'fakeEmail@gmail.com',
      password: 'FakePassword',
    });

    await expect(
      registerUseCase.execute({
        name: 'Fake Name',
        email: 'fakeEmail@gmail.com',
        password: 'FakePassword',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
