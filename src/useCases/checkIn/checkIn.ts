import { CheckInRepository } from '@/repositories/checkInRepository';
import { GymRepository } from '@/repositories/gymRepository';
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetwweenCoordinates';
import { CheckIn } from '@prisma/client';
import { MaxDistanceError } from '../errors/maxDistanceError';
import { MaxNumberOfCheckInsError } from '../errors/maxNumberOfCheckInsError';
import { ResourceNotFoundError } from '../errors/resourceNotFoundError';

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) throw new ResourceNotFoundError();

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    );

    const MAX_DISTANCE_IN_KM = 0.1;

    // Se a distância for maior que 100m dispara um erro
    if (distance > MAX_DISTANCE_IN_KM) throw new MaxDistanceError();

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDate) throw new MaxNumberOfCheckInsError();

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
