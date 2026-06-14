# Mestre Orc — Plataforma RPG SaaS

Projeto evoluído para transformar o site Mestre Orc em uma plataforma profissional para mestres de RPG.

## Fase 1 concluída

- Login e cadastro demo
- Simulação de usuário com `localStorage`
- Dashboard SaaS
- Métricas de campanhas, jogadores, vagas e receita
- Blueprint MongoDB em `backend-blueprint/mongodb-models.md`

## Fase 2 concluída

- Gestão de campanhas em `campanhas-manager.html`
- Gestão de personagens em `personagens-manager.html`
- Gestão de reservas em `reservas.html`
- Dados persistidos no navegador com `phase2-data.js`
- Exportação JSON de personagem

## Fase 3 concluída — Foundry Bridge

- `foundry-export.js`
- Exportação de campanha como `WorldManifest`
- Exportação de personagem como `Actor JSON`
- Página `foundry.html` com painel de bridge
- Blueprint de macro/importador em `foundry-blueprint/importer-macro-example.js`

## Fase 4 concluída — IA do Mestre Orc

- `ia-mestre.html` atualizado
- `orc-ai.js` aprimorado
- Geração local de aventura com região, duração, tom, vilão, cenas, NPCs, encontros e loot
- Exportação JSON simples
- Exportação `Foundry Bundle` com Journal, Scene Pack e metadados para módulo futuro

## Arquivos principais

```text
auth.html
dashboard-mestre.html
campanhas-manager.html
personagens-manager.html
reservas.html
foundry.html
ia-mestre.html
phase2-data.js
foundry-export.js
orc-ai.js
backend-blueprint/api-routes.md
foundry-blueprint/importer-macro-example.js
```

## Como testar

1. Abra `auth.html` e faça login demo.
2. Acesse `dashboard-mestre.html`.
3. Cadastre campanhas, personagens e reservas.
4. Vá em `foundry.html` e exporte World/Actor JSON.
5. Vá em `ia-mestre.html`, gere uma aventura e baixe o Foundry Bundle.

## Próximo nível técnico

Para virar produto de mercado, o próximo passo é substituir `localStorage` por backend real:

- Node.js/Fastify ou Express
- MongoDB Atlas
- JWT e senha criptografada
- API de IA real
- Módulo Foundry VTT para importar os bundles com um clique
- Painel financeiro com pagamentos reais


## Fase 5 — Marketplace

Implementado front-end funcional para simular um marketplace premium do Mestre Orc.

Inclui:

- Página `marketplace.html`;
- Catálogo de aventuras, mapas, tokens e bundles Foundry;
- Filtros por categoria;
- Cadastro local de produto;
- Carrinho simulado com `localStorage`;
- Blueprint MongoDB para produtos, pedidos e comissão da plataforma.

## Fase 6 — Aplicativo Mobile / PWA

Implementada camada mobile app-like para preparar o projeto para instalação no celular.

Inclui:

- Página `mobile.html`;
- Layout de aplicativo com cards, atalhos e navegação inferior;
- `manifest.json`;
- `service-worker.js`;
- Registro em `mobile-app.js`;
- Cache básico dos arquivos principais;
- Estrutura futura para push notifications e sessões mobile.

> Observação: para o PWA funcionar plenamente, hospede o projeto em HTTPS. Em ambiente local, alguns navegadores podem limitar o Service Worker.


## Limpeza técnica aplicada

- Corrigido `oneshot..html` para `oneshot.html`.
- Mantido `Oneshot.html` como redirecionamento de compatibilidade.
- Criado `gerador.html` e mantido `gerador-index.html` como redirecionamento.
- Corrigida referência da imagem das Torres Gêmeas para `segredos-torres-gemeas.png`.
- Padronizados nomes de imagens principais em formato web seguro: `corpos-roubados.jpg`, `contrabando-nos-esgotos.jpg` e `a-furia-verde.jpg`.
- Atualizado cache PWA para versão `mestre-orc-pwa-v2`.
- Removidas referências de exemplo a `link.jpg` e `video.mp4` que poderiam confundir a validação de assets.
- Mantidas as telas demo com `localStorage`, prontas para substituição por API real.


## Bloco 1 aplicado — Backend Real

Foi adicionada a pasta `backend/` com API Fastify, MongoDB, Prisma e JWT.

Arquivos importantes:

- `backend/` — API real
- `backend/prisma/schema.prisma` — modelos do banco
- `backend/.env.example` — variáveis necessárias
- `BACKEND_SETUP.md` — passo a passo para rodar
- `api-client.js` — cliente inicial para ligar o front-end à API

Nesta etapa, o backend já está pronto para rodar separadamente. O próximo trabalho é substituir gradualmente os dados em `localStorage` pelas chamadas reais da API.


## Atualização — Sprints 4 e 5

Esta versão adiciona duas camadas importantes ao produto:

### Sprint 4 — IA Mestre Orc Pro

- Nova tela `ia-avancada.html`
- Geração estruturada de aventura completa
- Criação de atos, NPCs, encontros, loot e bundle Foundry
- Salvamento no MongoDB pela rota `POST /api/ai/adventures`
- Fallback local caso a API não esteja rodando

### Sprint 5 — Biblioteca Premium

- Nova tela `biblioteca-premium.html`
- Filtros por busca, tipo e conteúdo premium/grátis
- Rotas reais no backend para listar/criar itens
- Seed inicial com aventura premium e NPC gratuito

Para ativar tudo no backend, entre na pasta `backend`, configure o `.env`, rode `npx prisma generate`, `npm run seed` e `npm run dev`.


## Sprints 2 e 3 aplicados

### Sprint 2 — Integração Foundry realista
- Backend com rotas `/api/foundry/campaigns/:id/export`, `/api/foundry/characters/:id/export` e `/api/foundry/generated/:id/bundle`.
- Registro de exportações em `FoundryExportLog`.
- Página `foundry.html` agora possui painel para exportar usando IDs reais do MongoDB.
- Arquivo `foundry-bridge.js` faz fallback local caso o backend não esteja rodando.

### Sprint 3 — Monetização
- Modelos Prisma para `Payment` e `Subscription`.
- Checkout de reserva, produto e assinatura com estrutura para Mercado Pago.
- Página `financeiro.html` com planos e resumo financeiro.
- Webhook `/api/payments/webhook` preparado para atualizar status.

### Variáveis novas no backend
```env
FOUNDRY_BASE_URL="https://vtt.seudominio.com"
FOUNDRY_API_KEY="troque_por_uma_chave_forte"
MERCADO_PAGO_ACCESS_TOKEN=""
MERCADO_PAGO_WEBHOOK_SECRET=""
PAYMENT_SUCCESS_URL="http://localhost:5173/pagamento-sucesso.html"
PAYMENT_FAILURE_URL="http://localhost:5173/marketplace.html"
PAYMENT_PENDING_URL="http://localhost:5173/marketplace.html"
```
