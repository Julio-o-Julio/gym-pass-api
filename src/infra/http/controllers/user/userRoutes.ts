import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verifyJwt';
import { metrics } from './metrics';
import { profile } from './profile';
import { register } from './register';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register);

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile);
  app.get('/metrics', { onRequest: [verifyJwt] }, metrics);
}
