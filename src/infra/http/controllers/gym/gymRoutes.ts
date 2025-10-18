import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verifyJwt';
import { verifyUserRole } from '../../middlewares/verifyUserRole';
import { create } from './create';
import { nearby } from './nearby';
import { search } from './search';

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);

  app.get('/gyms/search', search);
  app.get('/gyms/nearby', nearby);
}
