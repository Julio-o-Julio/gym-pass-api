import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/prisma';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Create Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to create a check in', async () => {
    const { access_token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: 'Test Gym 02',
        latitude: -20.4679858,
        longitude: -54.6125893,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/checkIns`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        userLatitude: -20.4679858,
        userLongitude: -54.6125893,
      });

    expect(response.statusCode).toEqual(201);
  });
});
