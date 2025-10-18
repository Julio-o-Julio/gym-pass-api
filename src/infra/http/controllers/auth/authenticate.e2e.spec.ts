import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/prisma';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to authenticate', async () => {
    await prisma.user.create({
      data: {
        name: 'Teste2e',
        email: 'teste2e@exemple.com',
        password_hash: await hash('Teste2e', 8),
      },
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'teste2e@exemple.com',
      password: 'Teste2e',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
