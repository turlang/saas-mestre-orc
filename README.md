# SaaS Mestre Orc

Plataforma SaaS para mestres de RPG criarem, organizarem e gerenciarem campanhas, personagens, reservas, conteúdos gerados e exportações para ecossistemas digitais de RPG.

## Visão geral

O SaaS Mestre Orc é um projeto autoral voltado para o universo de RPG de mesa. A proposta é oferecer uma central para mestres gerenciarem campanhas, jogadores, reservas, materiais de campanha, conteúdos gerados e integrações com ferramentas como Foundry VTT.

O projeto demonstra visão de produto, construção de dashboards, organização de fluxos, geração de conteúdo, simulação SaaS e planejamento de evolução para backend, banco de dados, pagamentos e IA real.

## Principais funcionalidades

- Login e cadastro demo.
- Dashboard SaaS.
- Métricas de campanhas, jogadores, vagas e receita.
- Gestão de campanhas.
- Gestão de personagens.
- Gestão de reservas.
- Persistência local com `localStorage`.
- Exportação JSON de personagem.
- Foundry Bridge.
- Exportação de campanha como `WorldManifest`.
- Exportação de personagem como `Actor JSON`.
- Geração local de aventuras.
- Exportação de Foundry Bundle.
- Marketplace premium simulado.

## Stack e recursos técnicos

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Dashboard UI
- Exportação JSON
- Arquitetura de produto SaaS
- Blueprint MongoDB
- Blueprint de API
- Foundry VTT Bridge
- Geração local de conteúdo

## Arquivos principais

```text
auth.html
dashboard-mestre.html
campanhas-manager.html
personagens-manager.html
reservas.html
foundry.html
ia-mestre.html
marketplace.html
phase2-data.js
foundry-export.js
orc-ai.js
backend-blueprint/api-routes.md
backend-blueprint/mongodb-models.md
foundry-blueprint/importer-macro-example.js
```

## Como testar

1. Abra `auth.html`.
2. Faça login demo.
3. Acesse `dashboard-mestre.html`.
4. Cadastre campanhas, personagens e reservas.
5. Acesse `foundry.html` para exportar World/Actor JSON.
6. Acesse `ia-mestre.html` para gerar uma aventura.
7. Exporte o conteúdo gerado como JSON ou Foundry Bundle.

## Diferenciais técnicos

- Nicho específico com proposta de produto clara.
- Dashboard com métricas de negócio.
- Gestão de campanhas, personagens e reservas.
- Integração conceitual com Foundry VTT.
- Geração local de conteúdo.
- Planejamento de evolução para SaaS real.
- Documentação de modelos e rotas futuras.

## Próximo nível técnico

Para virar produto comercial completo, os próximos passos são:

- Substituir `localStorage` por backend real.
- Implementar API Node.js com Fastify ou Express.
- Usar MongoDB Atlas.
- Adicionar autenticação JWT.
- Criptografar senhas.
- Integrar API de IA real.
- Criar módulo Foundry VTT instalável.
- Adicionar pagamentos reais.
- Criar painel financeiro.
- Adicionar testes automatizados.

## Posicionamento no portfólio

Este projeto deve ser apresentado como um produto autoral criativo, mostrando capacidade de transformar uma comunidade/nicho em plataforma SaaS, com dashboard, fluxos de usuário, geração de conteúdo e integração com ferramentas externas.

## Status

Protótipo avançado e base de produto para evolução full stack.
