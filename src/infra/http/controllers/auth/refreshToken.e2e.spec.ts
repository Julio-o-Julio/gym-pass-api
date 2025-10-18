import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/prisma';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to refresh a token', async () => {
    await prisma.user.create({
      data: {
        name: 'Teste2e',
        email: 'teste2e@exemple.com',
        password_hash: await hash('Teste2e', 8),
      },
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'teste2e@exemple.com',
      password: 'Teste2e',
    });

    const cookies = authResponse.get('Set-Cookie');

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies ?? [])
      .send();

    expect(authResponse.statusCode).toEqual(200);
    expect(authResponse.body).toEqual({
      access_token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
