import { makeAuthenticateUseCase } from '@/useCases/auth/factory/makeAuthenticateUseCase';
import { InvalidCredentialsError } from '@/useCases/errors/invalidCredentialsError';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const jwtToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    );

    const refreshJwtToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshJwtToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ access_token: jwtToken });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
