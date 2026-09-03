# CharLib

Uma biblioteca pessoal para organizar livros, ler PDFs e acompanhar hábitos de leitura. O CharLib funciona localmente no navegador: os dados permanecem no dispositivo do usuário, sem exigir cadastro ou servidor.

🔗 **Demo:** https://charlib-three.vercel.app/

## Funcionalidades

- Biblioteca com busca, filtros e ordenação.
- Cadastro de livros com PDF, capa, quantidade de páginas e status de leitura.
- Leitor de PDF com navegação por botões e teclado.
- Progresso salvo por livro e retomada da última leitura.
- Notas e marcadores por página.
- Metas diária, semanal e mensal em páginas ou minutos.
- Registro automático de páginas lidas e registro manual de leitura.
- Sequência de leitura, atividade recente e indicadores na Home.
- Exclusão segura de livros adicionados pelo usuário, com limpeza dos dados associados.
- Interface responsiva para desktop e dispositivos móveis.
- Página 404 para rotas inexistentes.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React PDF / PDF.js
- Framer Motion
- IndexedDB e localStorage

## Como executar

Pré-requisito: Node.js instalado.

```bash
git clone <https://github.com/CapivaraDevv/charlib.git>
cd charlib
npm install
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

```bash
npm run dev    # inicia o ambiente de desenvolvimento
npm run lint   # verifica regras de qualidade do código
npm run build  # valida TypeScript e gera a build de produção
```

## Persistência de dados

O projeto adota uma abordagem local-first:

- **IndexedDB:** guarda livros adicionados, PDFs e capas.
- **localStorage:** guarda progresso, última leitura, metas, registros de leitura, notas e marcadores.

Por isso, os dados permanecem no navegador atual. Limpar os dados do site ou usar outro dispositivo não transfere automaticamente a biblioteca.

## Estrutura principal

```text
src/
├── components/  # componentes reutilizáveis e seções da interface
├── contexts/    # estado compartilhado da biblioteca
├── pages/       # páginas e rotas da aplicação
├── services/    # persistência e regras de acesso aos dados
├── types/       # tipos TypeScript do domínio
└── utils/       # cálculos de metas, atividade e helpers
```

## Qualidade

Antes da versão 1.0.0, os fluxos principais foram testados manualmente: cadastro, persistência, leitura de PDF, notas, marcadores, metas, registro manual, exclusão e layout móvel. O projeto também passa em `npm run lint` e `npm run build`.

## Roadmap

A próxima evolução planejada é a sincronização em nuvem com Supabase:

- autenticação de usuários;
- sincronização de metas, progresso, notas e marcadores;
- armazenamento de PDFs e capas;
- migração segura dos dados locais existentes.

Os detalhes estão em [ROADMAP.md](ROADMAP.md).

## Versão

Versão atual: **v1.0.0**.
