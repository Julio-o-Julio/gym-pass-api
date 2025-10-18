import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from './env';
import { authRoutes } from './infra/http/controllers/auth/authRoutes';
import { checkInRoutes } from './infra/http/controllers/checkIn/checkInRoutes';
import { gymRoutes } from './infra/http/controllers/gym/gymRoutes';
import { userRoutes } from './infra/http/controllers/user/userRoutes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(userRoutes);
app.register(authRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Mandar o erro para uma ferramenta de observabilidade que possa enviar um email para o time
  }

  return reply.status(500).send('Internal server Error');
});
