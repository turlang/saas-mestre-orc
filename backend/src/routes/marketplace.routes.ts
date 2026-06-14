import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

const productSchema = z.object({
  title: z.string().min(3),
  type: z.enum(['ADVENTURE', 'MAP', 'TOKEN', 'FOUNDRY_BUNDLE', 'COURSE']),
  description: z.string().min(10),
  price: z.number().nonnegative().default(0),
  coverUrl: z.string().optional(),
  fileUrl: z.string().optional()
});

export async function marketplaceRoutes(app: FastifyInstance) {
  app.get('/marketplace/products', async () => {
    return prisma.marketplaceProduct.findMany({ orderBy: { createdAt: 'desc' } });
  });

  app.post('/marketplace/products', { preHandler: authGuard }, async (request, reply) => {
    const data = productSchema.parse(request.body);
    const product = await prisma.marketplaceProduct.create({ data: { ...data, sellerId: request.user.sub } });
    return reply.status(201).send(product);
  });
}
