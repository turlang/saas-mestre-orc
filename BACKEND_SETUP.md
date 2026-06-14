# O que precisa para o backend funcionar

## 1. Node correto

Use Node.js 20 ou 22. Evite Node 24 por enquanto, porque alguns pacotes podem apresentar incompatibilidade em ambiente local ou deploy.

```bash
node -v
```

## 2. MongoDB

Você precisa de uma URL MongoDB. Pode ser:

- MongoDB Atlas, recomendado para produção
- MongoDB local, bom para teste

Exemplo Atlas:

```env
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/mestre_orc?retryWrites=true&w=majority"
```

## 3. Arquivo `.env`

Dentro da pasta `backend`, copie:

```bash
copy .env.example .env
```

Depois edite:

```env
DATABASE_URL="sua-url-do-mongodb"
JWT_SECRET="uma-chave-grande-com-mais-de-20-caracteres"
PORT=3333
FRONTEND_URL="http://localhost:5173"
```

## 4. Instalação

```bash
cd backend
npm install
npx prisma generate
npm run seed
npm run dev
```

## 5. Teste da API

Abra:

```text
http://localhost:3333/health
```

Deve retornar:

```json
{
  "status": "ok",
  "service": "mestre-orc-api"
}
```

## 6. Login inicial

Após `npm run seed`:

```text
E-mail: mestre@mestreorc.com.br
Senha: mestreorc123
```

## 7. Próxima etapa

O backend já está criado. O próximo passo é trocar as telas que hoje usam `localStorage` para consumir as rotas reais da API usando o arquivo `api-client.js`.

## 8. Sprints 4 e 5 — novas rotas

Depois desta atualização, rode novamente:

```bash
cd backend
npx prisma generate
npm run seed
npm run dev
```

Novas rotas adicionadas:

```text
POST /api/ai/adventures       Protegida por JWT. Gera e salva aventura completa.
GET  /api/ai/history          Protegida por JWT. Lista conteúdos gerados pelo usuário.
GET  /api/library             Lista biblioteca premium com filtros.
GET  /api/library/:id         Detalhe de item da biblioteca.
POST /api/library             Protegida por JWT. Cria item premium/gratuito.
```

Novas telas:

```text
ia-avancada.html
biblioteca-premium.html
```

Observação importante: a IA adicionada agora é uma IA estrutural local/servidor, com geração baseada em regras e pronta para receber uma API de IA externa depois. Para ligar uma IA real, será necessário adicionar uma chave de provedor no `.env`, por exemplo OpenAI, Gemini ou outro serviço.


## Configuração dos Sprints 2 e 3

### Foundry
1. Hospede o Foundry separadamente.
2. Defina `FOUNDRY_BASE_URL` no `.env`.
3. Use as rotas de exportação para baixar JSON Foundry Ready.
4. Para importação automática dentro do Foundry, use o arquivo `foundry-blueprint/importer-macro-example.js` como base para um módulo.

### Mercado Pago
1. Crie uma conta Mercado Pago de desenvolvedor.
2. Copie o access token de teste para `MERCADO_PAGO_ACCESS_TOKEN`.
3. Configure a URL pública do webhook apontando para `/api/payments/webhook`.
4. Em produção, troque as URLs `PAYMENT_SUCCESS_URL`, `PAYMENT_FAILURE_URL` e `PAYMENT_PENDING_URL` para o domínio real.

Sem `MERCADO_PAGO_ACCESS_TOKEN`, o backend cria pagamentos pendentes em modo teste, mas não abre checkout real.
