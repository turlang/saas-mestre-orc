import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';
import { env } from '../config/env.js';

function actorFromCharacter(character: any) {
  return {
    name: character.name,
    type: 'character',
    system: {
      details: { biography: { value: character.background || '' }, notes: character.notes || '' },
      attributes: { level: character.level || 1 },
      traits: { ancestry: character.ancestry || '' },
      class: character.className || ''
    },
    prototypeToken: { name: character.name, actorLink: true }
  };
}

function worldFromCampaign(campaign: any) {
  return {
    title: campaign.title,
    system: campaign.system || 'dnd5e',
    description: campaign.description,
    foundry: {
      minimumCoreVersion: '12',
      compatibleCoreVersion: '13',
      recommendedUrl: campaign.foundryUrl || env.FOUNDRY_BASE_URL || null
    },
    settings: {
      levelRange: campaign.levelRange,
      schedule: campaign.schedule,
      seatsTotal: campaign.seatsTotal,
      seatsTaken: campaign.seatsTaken
    },
    actors: campaign.characters?.map(actorFromCharacter) || [],
    journal: [
      { name: 'Resumo da Campanha', text: campaign.description },
      { name: 'Agenda', text: campaign.schedule || 'Agenda a definir.' }
    ]
  };
}

export async function foundryRoutes(app: FastifyInstance) {
  app.get('/foundry/campaigns/:id/export', { preHandler: authGuard }, async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: { characters: true, reservations: true }
    });

    if (!campaign) return reply.status(404).send({ message: 'Campanha não encontrada.' });
    if (campaign.ownerId !== request.user.sub && request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Você não pode exportar esta campanha.' });
    }

    const payload = worldFromCampaign(campaign);
    await prisma.foundryExportLog.create({ data: { type: 'WORLD', sourceId: campaign.id, payloadJson: payload, userId: request.user.sub } });
    return payload;
  });

  app.get('/foundry/characters/:id/export', { preHandler: authGuard }, async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const character = await prisma.character.findUnique({ where: { id: params.id } });
    if (!character) return reply.status(404).send({ message: 'Personagem não encontrado.' });
    if (character.userId !== request.user.sub && request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Você não pode exportar este personagem.' });
    }

    const payload = actorFromCharacter(character);
    await prisma.foundryExportLog.create({ data: { type: 'ACTOR', sourceId: character.id, payloadJson: payload, userId: request.user.sub } });
    return payload;
  });

  app.get('/foundry/generated/:id/bundle', { preHandler: authGuard }, async (request, reply) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    const content = await prisma.generatedContent.findUnique({ where: { id: params.id } });
    if (!content) return reply.status(404).send({ message: 'Conteúdo não encontrado.' });
    if (content.userId !== request.user.sub && request.user.role !== 'ADMIN') {
      return reply.status(403).send({ message: 'Você não pode exportar este bundle.' });
    }

    const payload = {
      name: content.title,
      type: 'mestre-orc-foundry-bundle',
      content: content.contentJson,
      importInstructions: 'Use a macro importadora em foundry-blueprint/importer-macro-example.js ou adapte para um módulo Foundry.'
    };
    await prisma.foundryExportLog.create({ data: { type: 'BUNDLE', sourceId: content.id, payloadJson: payload, userId: request.user.sub } });
    return payload;
  });

  app.get('/foundry/exports', { preHandler: authGuard }, async (request) => {
    return prisma.foundryExportLog.findMany({
      where: { userId: request.user.sub },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  });
}
