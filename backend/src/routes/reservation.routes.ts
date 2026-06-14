import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

const reservationSchema = z.object({
  campaignId: z.string(),
  notes: z.string().optional()
});

export async function reservationRoutes(app: FastifyInstance) {
  app.get('/reservations', { preHandler: authGuard }, async (request) => {
    return prisma.reservation.findMany({
      where: { userId: request.user.sub },
      include: { campaign: true },
      orderBy: { createdAt: 'desc' }
    });
  });

  app.post('/reservations', { preHandler: authGuard }, async (request, reply) => {
    const data = reservationSchema.parse(request.body);
    const campaign = await prisma.campaign.findUnique({ where: { id: data.campaignId } });
    if (!campaign) return reply.status(404).send({ message: 'Campanha não encontrada.' });

    const reservation = await prisma.reservation.create({
      data: { campaignId: data.campaignId, userId: request.user.sub, amount: campaign.price, notes: data.notes }
    });

    await prisma.campaign.update({ where: { id: campaign.id }, data: { seatsTaken: { increment: 1 } } });
    return reply.status(201).send(reservation);
  });
}
