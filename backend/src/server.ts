import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env.js';
import { prisma } from './plugins/prisma.js';
import { authRoutes } from './routes/auth.routes.js';
import { campaignRoutes } from './routes/campaign.routes.js';
import { characterRoutes } from './routes/character.routes.js';
import { reservationRoutes } from './routes/reservation.routes.js';
import { marketplaceRoutes } from './routes/marketplace.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { aiRoutes } from './routes/ai.routes.js';
import { libraryRoutes } from './routes/library.routes.js';
import { foundryRoutes } from './routes/foundry.routes.js';
import { paymentRoutes } from './routes/payment.routes.js';

const app = Fastify({ logger: true });

await app.register(helmet);
await app.register(cors, { origin: env.FRONTEND_URL, credentials: true });
await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
await app.register(jwt, { secret: env.JWT_SECRET });

app.get('/health', async () => ({ status: 'ok', service: 'mestre-orc-api' }));

await app.register(authRoutes, { prefix: '/api' });
await app.register(campaignRoutes, { prefix: '/api' });
await app.register(characterRoutes, { prefix: '/api' });
await app.register(reservationRoutes, { prefix: '/api' });
await app.register(marketplaceRoutes, { prefix: '/api' });
await app.register(dashboardRoutes, { prefix: '/api' });
await app.register(aiRoutes, { prefix: '/api' });
await app.register(libraryRoutes, { prefix: '/api' });
await app.register(foundryRoutes, { prefix: '/api' });
await app.register(paymentRoutes, { prefix: '/api' });

app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);
  return reply.status(400).send({ message: error.message || 'Erro inesperado.' });
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await app.listen({ port: env.PORT, host: '0.0.0.0' });
