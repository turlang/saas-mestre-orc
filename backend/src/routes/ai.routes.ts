import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { authGuard } from '../middlewares/auth.js';

const aiRequestSchema = z.object({
  title: z.string().min(3),
  system: z.string().default('D&D 5e'),
  levelRange: z.string().default('1-5'),
  theme: z.string().min(3),
  tone: z.enum(['heroico', 'sombrio', 'investigativo', 'politico', 'terror', 'comico']).default('sombrio'),
  partySize: z.coerce.number().int().min(1).max(8).default(4),
  duration: z.enum(['one-shot', 'mini-campanha', 'campanha']).default('one-shot'),
  location: z.string().default('Forgotten Realms'),
  extraNotes: z.string().optional()
});

function buildAdventure(data: z.infer<typeof aiRequestSchema>) {
  const hook = `Os aventureiros chegam a ${data.location} quando rumores sobre ${data.theme} começam a alterar a rotina local.`;

  return {
    title: data.title,
    system: data.system,
    levelRange: data.levelRange,
    tone: data.tone,
    partySize: data.partySize,
    duration: data.duration,
    location: data.location,
    synopsis: `${data.title} é uma aventura ${data.tone} para ${data.system}, indicada para ${data.partySize} jogadores de níveis ${data.levelRange}.`,
    hook,
    acts: [
      {
        name: 'Ato 1 — O Chamado',
        goal: 'Apresentar o conflito, o contratante e uma pista inicial.',
        scenes: ['Taverna ou salão do conselho', 'Primeira pista', 'Pequeno confronto social ou físico']
      },
      {
        name: 'Ato 2 — A Verdade Oculta',
        goal: 'Investigar a origem do problema e revelar uma ameaça maior.',
        scenes: ['Local abandonado', 'NPC ambíguo', 'Armadilha ou enigma']
      },
      {
        name: 'Ato 3 — Confronto Final',
        goal: 'Resolver o conflito com uma escolha dramática e consequência clara.',
        scenes: ['Covil do antagonista', 'Combate decisivo', 'Recompensa e gancho futuro']
      }
    ],
    npcs: [
      {
        name: 'Maerla dos Sete Sinos',
        role: 'Contratante',
        personality: 'Firme, cansada e muito observadora.',
        secret: 'Sabe mais sobre o perigo do que admite.'
      },
      {
        name: 'Irgor Veld',
        role: 'Suspeito/Vilão possível',
        personality: 'Educado, frio e calculista.',
        secret: `Está ligado ao tema central: ${data.theme}.`
      }
    ],
    encounters: [
      {
        name: 'Emboscada de teste',
        difficulty: 'Média',
        creatures: ['Bandidos locais', 'Batedor treinado'],
        objective: 'Testar os personagens e entregar uma pista.'
      },
      {
        name: 'Guardião da verdade',
        difficulty: 'Difícil',
        creatures: ['Criatura temática', 'Aliado corrompido'],
        objective: 'Proteger a revelação principal.'
      }
    ],
    loot: [
      '50 PO por personagem',
      '1 item incomum apropriado ao grupo',
      'Mapa parcial para uma próxima aventura'
    ],
    foundryBundle: {
      recommendedScenes: ['Cena inicial', 'Local de investigação', 'Covil final'],
      actors: ['Maerla dos Sete Sinos', 'Irgor Veld', 'Batedor treinado'],
      journalEntries: ['Resumo da aventura', 'Pistas', 'Recompensas']
    },
    extraNotes: data.extraNotes || null
  };
}

export async function aiRoutes(app: FastifyInstance) {
  app.post('/ai/adventures', { preHandler: authGuard }, async (request, reply) => {
    const data = aiRequestSchema.parse(request.body);
    const content = buildAdventure(data);

    const saved = await prisma.generatedContent.create({
      data: {
        title: data.title,
        type: 'ADVENTURE',
        prompt: JSON.stringify(data),
        contentJson: content,
        userId: request.user.sub
      }
    });

    return reply.status(201).send(saved);
  });

  app.get('/ai/history', { preHandler: authGuard }, async (request) => {
    return prisma.generatedContent.findMany({
      where: { userId: request.user.sub },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
  });
}
