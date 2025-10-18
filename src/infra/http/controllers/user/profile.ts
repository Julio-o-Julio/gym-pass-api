import { makeGetUserProfileUseCase } from '@/useCases/user/factory/makeGetUserProfileUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  const getUserProfileUseCase = makeGetUserProfileUseCase();

  const { user } = await getUserProfileUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
