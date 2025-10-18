import { FastifyReply, FastifyRequest } from 'fastify';

export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true });

  const { role } = request.user;

  const jwtToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  );

  const refreshJwtToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
