# API planejada — Mestre Orc SaaS

## Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

## Campanhas
- GET `/api/campaigns`
- POST `/api/campaigns`
- PATCH `/api/campaigns/:id`
- DELETE `/api/campaigns/:id`

## Personagens
- GET `/api/characters`
- POST `/api/characters`
- GET `/api/characters/:id/foundry-actor`

## Reservas
- GET `/api/reservations`
- POST `/api/reservations`
- PATCH `/api/reservations/:id/status`

## Foundry Bridge
- POST `/api/foundry/export/world`
- POST `/api/foundry/export/actor`
- POST `/api/foundry/export/adventure-bundle`

## IA do Mestre
- POST `/api/ai/adventure`
- POST `/api/ai/npc`
- POST `/api/ai/session-prep`

Observação: o front atual simula tudo localmente. Esses endpoints são o caminho para produção.
