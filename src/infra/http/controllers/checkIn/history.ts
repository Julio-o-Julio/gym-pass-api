import { makeFetchUserCheckInsHistoryUseCase } from '@/useCases/checkIn/factory/makeFetchUserCheckInsHistoryUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserCheckInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchUserCheckInsHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({ checkIns });
}
