import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

const librarySchema = z.object({
  title: z.string().min(3),
  type: z.enum(['ADVENTURE', 'NPC', 'MAP', 'TOKEN', 'LOOT', 'FOUNDRY_BUNDLE', 'COURSE']),
  system: z.string().default('D&D 5e'),
  levelRange: z.string().optional(),
  theme: z.string().optional(),
  description: z.string().min(10),
  tags: z.array(z.string()).default([]),
  coverUrl: z.string().optional(),
  contentJson: z.any().optional(),
  isPremium: z.boolean().default(false),
  price: z.number().nonnegative().default(0)
});

export async function libraryRoutes(app: FastifyInstance) {
  app.get('/library', async (request) => {
    const querySchema = z.object({
      type: z.string().optional(),
      system: z.string().optional(),
      theme: z.string().optional(),
      premium: z.string().optional(),
      search: z.string().optional()
    });

    const query = querySchema.parse(request.query);

    return prisma.libraryItem.findMany({
      where: {
        ...(query.type ? { type: query.type as any } : {}),
        ...(query.system ? { system: { contains: query.system } } : {}),
        ...(query.theme ? { theme: { contains: query.theme } } : {}),
        ...(query.premium ? { isPremium: query.premium === 'true' } : {}),
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search } },
                { description: { contains: query.search } }
              ]
            }
          : {})
      },
      orderBy: { createdAt: 'desc' }
    });
  });

  app.get('/library/:id', async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const item = await prisma.libraryItem.findUnique({ where: { id: params.id } });
    if (!item) return reply.status(404).send({ message: 'Item não encontrado.' });
    return item;
  });

  app.post('/library', { preHandler: authGuard }, async (request, reply) => {
    const data = librarySchema.parse(request.body);
    const item = await prisma.libraryItem.create({ data: { ...data, authorId: request.user.sub } });
    return reply.status(201).send(item);
  });
}
