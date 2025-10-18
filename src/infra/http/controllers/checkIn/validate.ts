import { makeValidateCheckInUseCase } from '@/useCases/checkIn/factory/makeValidateCheckInUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.uuidv7(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  await validateCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(204).send();
}
