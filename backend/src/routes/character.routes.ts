import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

const characterSchema = z.object({
  name: z.string().min(2),
  ancestry: z.string().optional(),
  className: z.string().optional(),
  level: z.number().int().positive().default(1),
  background: z.string().optional(),
  notes: z.string().optional(),
  campaignId: z.string().optional(),
  sheetJson: z.any().optional()
});

export async function characterRoutes(app: FastifyInstance) {
  app.get('/characters', { preHandler: authGuard }, async (request) => {
    return prisma.character.findMany({ where: { userId: request.user.sub }, orderBy: { createdAt: 'desc' } });
  });

  app.post('/characters', { preHandler: authGuard }, async (request, reply) => {
    const data = characterSchema.parse(request.body);
    const character = await prisma.character.create({ data: { ...data, userId: request.user.sub } });
    return reply.status(201).send(character);
  });
}
