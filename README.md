# Vincaeros Combat Tracker

App Svelte para gerenciamento de combate de rpg de mesa no setting de Vincaeros (D&D5e Homebrew).

## Finalidade e features principais

- Adicionar/remover combatentes com nome, AC e HP máximo
- Cards com botões de dano/cura individual e entrada numérica
- Aplicar condições negativas e buffs individualmente ou em massa
- Adicionar eventos de batalha com contagem regressiva de rodadas
- Arrastar e soltar para reordenar a iniciativa
- Persistência local (salvar/carregar combate)
- Layout responsivo (mobile, tablet, desktop)

## Dependências

- Svelte 5
- SortableJS
- Vite

## Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Lucca-Bellini/Vincaeros-Combat-Tracker.git
   cd Vincaeros-Combat-Tracker
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

5. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

7. Acesse http://localhost:5173 no navegador.

Para gerar a versão de produção:
   ```bash
   npm run build
   ```
Os arquivos estáticos ficarão na pasta `dist`.

## Features do Svelte utilizadas

- Reatividade com `$derived` – atualizações automáticas da UI
- Stores (`writable`) – estado global reativo e persistência com `localStorage`
- Ações (`use:sortable`) – integração limpa com SortableJS
- Binding bidirecional (`bind:value`) – formulários sem código extra
- Estilo escopado – CSS por componente, sem conflitos
- Renderização condicional e loops (`{#if}`, `{#each}`) – template declarativo
- Compilação (não Virtual DOM) – alta performance

## Autores

Essa página foi desenvolvida como parte da Atividade Prática - Framework Svelte da disciplina de Programação WEB na FATEC Mogi Mirim, primeiro semestre de 2026. 
Autores: Lucca Bellini Pena e Danielle Rachel Rios Moreira.
