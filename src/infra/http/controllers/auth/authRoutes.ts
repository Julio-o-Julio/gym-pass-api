import { FastifyInstance } from 'fastify';
import { authenticate } from './authenticate';
import { refreshToken } from './refreshToken';

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);

  app.patch('/token/refresh', refreshToken);
}
