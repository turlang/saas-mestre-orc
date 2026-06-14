# Blueprint MongoDB — Mestre Orc SaaS

Este arquivo documenta as coleções planejadas para transformar o front-end demo em uma aplicação real com Node/Fastify, JWT e MongoDB.

## users
```js
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: 'master' | 'player' | 'admin',
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

## campaigns
```js
{
  _id: ObjectId,
  masterId: ObjectId,
  name: String,
  system: String,
  levelRange: String,
  day: String,
  seats: Number,
  filled: Number,
  price: Number,
  status: 'Preparação' | 'Vagas abertas' | 'Captando jogadores' | 'Em andamento' | 'Encerrada',
  foundryWorld: String,
  pitch: String,
  createdAt: Date,
  updatedAt: Date
}
```

## characters
```js
{
  _id: ObjectId,
  playerId: ObjectId,
  campaignId: ObjectId,
  name: String,
  className: String,
  level: Number,
  status: 'Aprovado' | 'Revisar ficha' | 'História pendente' | 'Aguardando jogador',
  notes: String,
  foundryActorId: String,
  sheetJson: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## reservations
```js
{
  _id: ObjectId,
  playerName: String,
  contact: String,
  campaignId: ObjectId,
  seatType: 'Campanha mensal' | 'One-shot' | 'Evento especial',
  payment: 'Sinal pendente' | 'Confirmado' | 'Aguardando Pix' | 'Cortesia',
  status: 'Aguardando pagamento' | 'Confirmada' | 'Lista de espera' | 'Cancelada',
  createdAt: Date,
  updatedAt: Date
}
```

## sessions
```js
{
  _id: ObjectId,
  campaignId: ObjectId,
  title: String,
  scheduledAt: Date,
  durationMinutes: Number,
  status: 'Agendada' | 'Realizada' | 'Cancelada',
  foundrySceneId: String,
  notes: String
}
```

## payments
```js
{
  _id: ObjectId,
  userId: ObjectId,
  campaignId: ObjectId,
  reservationId: ObjectId,
  amount: Number,
  method: 'Pix' | 'Cartão' | 'Dinheiro' | 'Cortesia',
  status: 'Pendente' | 'Pago' | 'Estornado',
  paidAt: Date,
  createdAt: Date
}
```

## Próximas rotas de API

- `POST /auth/register`
- `POST /auth/login`
- `GET /campaigns`
- `POST /campaigns`
- `GET /characters`
- `POST /characters`
- `GET /reservations`
- `POST /reservations`
- `POST /foundry/export-character`
