import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../plugins/prisma.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { authGuard } from '../middlewares/auth.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['PLAYER', 'MASTER', 'ADMIN']).default('PLAYER')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const data = registerSchema.parse(request.body);
    const alreadyExists = await prisma.user.findUnique({ where: { email: data.email } });

    if (alreadyExists) {
      return reply.status(409).send({ message: 'E-mail já cadastrado.' });
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        passwordHash: await hashPassword(data.password)
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    const token = app.jwt.sign({ sub: user.id, role: user.role, email: user.email });
    return reply.status(201).send({ user, token });
  });

  app.post('/auth/login', async (request, reply) => {
    const data = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      return reply.status(401).send({ message: 'E-mail ou senha inválidos.' });
    }

    const token = app.jwt.sign({ sub: user.id, role: user.role, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  });

  app.get('/auth/me', { preHandler: authGuard }, async (request) => {
    return prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true }
    });
  });
}
