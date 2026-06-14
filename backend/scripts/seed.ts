import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('mestreorc123', 10);

  const master = await prisma.user.upsert({
    where: { email: 'mestre@mestreorc.com.br' },
    update: {},
    create: {
      name: 'Mestre Orc',
      email: 'mestre@mestreorc.com.br',
      passwordHash,
      role: 'MASTER'
    }
  });

  const existingCampaign = await prisma.campaign.findFirst({ where: { title: 'Sombras Sobre Amn' } });

  if (!existingCampaign) {
    await prisma.campaign.create({
      data: {
        title: 'Sombras Sobre Amn',
        description: 'Campanha sombria de intriga, investigação e combates táticos em Forgotten Realms.',
        levelRange: '1–5',
        schedule: 'Segundas, 20h às 23h',
        price: 50,
        seatsTotal: 5,
        foundryUrl: 'https://vtt.mestreorc.com.br',
        ownerId: master.id
      }
    });
  }

  const existingLibrary = await prisma.libraryItem.findFirst({ where: { title: 'A Cripta dos Sete Juramentos' } });

  if (!existingLibrary) {
    await prisma.libraryItem.createMany({
      data: [
        {
          title: 'A Cripta dos Sete Juramentos',
          type: 'ADVENTURE',
          system: 'D&D 5e',
          levelRange: '3-5',
          theme: 'Dungeon sombria',
          description: 'One-shot premium com gancho, NPCs, armadilhas, encontros, tesouros e estrutura pronta para Foundry.',
          tags: ['one-shot', 'dungeon', 'foundry', 'terror'],
          isPremium: true,
          price: 29.9,
          authorId: master.id,
          contentJson: { scenes: ['Entrada da cripta', 'Salão dos juramentos', 'Câmara final'] }
        },
        {
          title: 'Mercador de Relíquias de Amn',
          type: 'NPC',
          system: 'D&D 5e',
          levelRange: '1-10',
          theme: 'Intriga urbana',
          description: 'NPC com personalidade, segredo, falas prontas e ganchos para campanhas urbanas.',
          tags: ['npc', 'amn', 'intriga'],
          isPremium: false,
          price: 0,
          authorId: master.id,
          contentJson: { role: 'Mercador', secret: 'Vende relíquias roubadas de templos antigos.' }
        }
      ]
    });
  }

  console.log('Seed concluído. Login demo: mestre@mestreorc.com.br / mestreorc123');
}

main().finally(async () => prisma.$disconnect());
