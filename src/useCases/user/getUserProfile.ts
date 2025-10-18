import { UserRepository } from '@/repositories/userRepository';
import { User } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resourceNotFoundError';

interface GetUserProfileUseCaseRequest {
  userId: string;
}
interface GetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    return { user };
  }
}
