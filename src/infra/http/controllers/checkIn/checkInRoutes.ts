import { FastifyInstance } from 'fastify';
import { verifyJwt } from '../../middlewares/verifyJwt';
import { verifyUserRole } from '../../middlewares/verifyUserRole';
import { create } from './create';
import { history } from './history';
import { validate } from './validate';

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms/:gymId/checkIns', create);

  app.get('/checkIns/history', history);

  app.patch(
    '/checkIns/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  );
}
