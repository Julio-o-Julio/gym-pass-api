import { Prisma, User } from '@prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { UserRepository } from '../userRepository';

export class InMemoryUserRepository implements UserRepository {
  public users: User[] = [];

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id ?? uuidv7(),
      name: data.name,
      email: data.email.toLowerCase(),
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const user = this.users.find((item) => item.email === email.toLowerCase());

    if (!user) return null;

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);

    if (!user) return null;

    return user;
  }
}
