import type { FastifyInstance } from 'fastify';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

export async function dashboardRoutes(app: FastifyInstance) {
  app.get('/dashboard/summary', { preHandler: authGuard }, async (request) => {
    const [campaigns, characters, reservations, products] = await Promise.all([
      prisma.campaign.count({ where: { ownerId: request.user.sub } }),
      prisma.character.count({ where: { userId: request.user.sub } }),
      prisma.reservation.findMany({ where: { userId: request.user.sub } }),
      prisma.marketplaceProduct.count({ where: { sellerId: request.user.sub } })
    ]);

    const revenue = reservations.reduce((total, item) => total + item.amount, 0);

    return {
      campaigns,
      characters,
      reservations: reservations.length,
      products,
      revenue
    };
  });
}
