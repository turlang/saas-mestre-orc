import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; role: 'PLAYER' | 'MASTER' | 'ADMIN'; email: string };
    user: { sub: string; role: 'PLAYER' | 'MASTER' | 'ADMIN'; email: string };
  }
}
