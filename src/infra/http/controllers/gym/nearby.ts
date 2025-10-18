import { makeFetchNearbyGymsUseCase } from '@/useCases/gym/factory/makeFetchNearbyGymsUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const fetchNearbyGymsQuerySchema = z.object({
    userLatitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    userLongitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
    page: z.coerce.number().min(1).default(1),
  });

  const { userLatitude, userLongitude, page } =
    fetchNearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude,
    userLongitude,
    page,
  });

  return reply.status(200).send({ gyms });
}
