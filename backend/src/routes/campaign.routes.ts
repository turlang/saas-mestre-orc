import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

const campaignSchema = z.object({
  title: z.string().min(3),
  system: z.string().default('D&D 5e'),
  description: z.string().min(10),
  levelRange: z.string().optional(),
  schedule: z.string().optional(),
  price: z.number().nonnegative().default(0),
  seatsTotal: z.number().int().positive().default(5),
  foundryUrl: z.string().url().optional(),
  coverUrl: z.string().optional()
});

export async function campaignRoutes(app: FastifyInstance) {
  app.get('/campaigns', async () => {
    return prisma.campaign.findMany({ orderBy: { createdAt: 'desc' }, include: { owner: { select: { name: true } } } });
  });

  app.post('/campaigns', { preHandler: authGuard }, async (request, reply) => {
    const data = campaignSchema.parse(request.body);
    const campaign = await prisma.campaign.create({ data: { ...data, ownerId: request.user.sub } });
    return reply.status(201).send(campaign);
  });

  app.get('/campaigns/:id', async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: { reservations: true, characters: true }
    });
    if (!campaign) return reply.status(404).send({ message: 'Campanha não encontrada.' });
    return campaign;
  });
}
