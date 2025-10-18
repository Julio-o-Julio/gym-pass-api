import { app } from '@/app';
import { prisma } from '@/infra/database/prisma/prisma';
import { createAndAuthenticateUser } from '@/utils/test/createAndAuthenticateUser';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Validate Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should be able to validate a check in', async () => {
    const { access_token } = await createAndAuthenticateUser(app, true);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Test Gym 02',
        latitude: -20.4679858,
        longitude: -54.6125893,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gym_id: gym.id,
      },
    });

    const response = await request(app.server)
      .patch(`/checkIns/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${access_token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
