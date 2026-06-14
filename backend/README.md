# Backend Mestre Orc — Bloco 1

API real do Mestre Orc com Fastify, MongoDB, Prisma e JWT.

## Recursos incluídos

- Cadastro e login com senha criptografada
- JWT para rotas protegidas
- MongoDB via Prisma
- Campanhas
- Personagens
- Reservas
- Marketplace
- Dashboard summary
- IA Mestre Orc Pro para geração de aventuras
- Histórico de conteúdos gerados
- Biblioteca premium com filtros
- Seed inicial

## Como rodar

```bash
cd backend
npm install
copy .env.example .env
npx prisma generate
npm run seed
npm run dev
```

No Linux/Mac use:

```bash
cp .env.example .env
```

A API sobe em:

```text
http://localhost:3333
```

Teste:

```text
GET http://localhost:3333/health
```

## Variáveis obrigatórias

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/mestre_orc?retryWrites=true&w=majority"
JWT_SECRET="troque-essa-chave-por-uma-chave-grande-e-secreta"
PORT=3333
FRONTEND_URL="http://localhost:5173"
```

## Rotas principais

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/campaigns
POST /api/campaigns
GET  /api/characters
POST /api/characters
GET  /api/reservations
POST /api/reservations
GET  /api/marketplace/products
POST /api/marketplace/products
GET  /api/dashboard/summary
POST /api/ai/adventures
GET  /api/ai/history
GET  /api/library
GET  /api/library/:id
POST /api/library
```

## Login demo após seed

```text
E-mail: mestre@mestreorc.com.br
Senha: mestreorc123
```
