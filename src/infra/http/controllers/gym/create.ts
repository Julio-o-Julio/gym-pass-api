import { makeCreateGymUseCase } from '@/useCases/gym/factory/makeCreateGymUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    phone: z
      .string()
      .regex(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, 'Invalid phone') // Valida número de telefone sem o DDI. Ex válidos: ['67912345678', '(67) 91234-5678', '67 91234-5678', 6791234567]
      .nullable()
      .optional(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);

  const createGymUseCase = makeCreateGymUseCase();

  await createGymUseCase.execute({
    title,
    description: description ?? null,
    phone: phone ?? null,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
