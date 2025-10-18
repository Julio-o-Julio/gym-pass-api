import { prisma } from '@/infra/database/prisma/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'Test Name',
      email: 'teste2e@exemple.com',
      password_hash: await hash('TestPassword', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'teste2e@exemple.com',
    password: 'TestPassword',
  });

  const { access_token } = authResponse.body;

  return {
    access_token,
  };
}
