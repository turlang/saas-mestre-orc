# Blueprint de módulo importador Foundry

Este projeto agora gera JSON pelo backend. Para transformar em importação de um clique dentro do Foundry:

1. Criar um módulo Foundry chamado `mestre-orc-importer`.
2. Adicionar uma tela de upload JSON.
3. Ler `type` do arquivo: `WORLD`, `ACTOR` ou `BUNDLE`.
4. Para `ACTOR`, usar `Actor.create(payload)`.
5. Para `BUNDLE`, criar `JournalEntry`, `Actor` e `Item` com base em `payload.content`.
6. Para `WORLD`, criar journals, atores e cenas dentro do mundo atual.

A API do site não precisa rodar dentro do Foundry. Ela só gera o pacote JSON seguro para importação.
