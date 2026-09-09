<div align="center">
  <img src="src/assets/Logo.png" alt="Logo do CharLib" width="180" />

  # CharLib

  **Sua biblioteca pessoal para ler, organizar e acompanhar cada capítulo.**

  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-integrado-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)

  [Experimentar a aplicação](https://charlib-three.vercel.app/) · [Explorar o código](https://github.com/CapivaraDevv/charlib) · [Consultar o roadmap](ROADMAP.md)
</div>

## Sobre o projeto

O CharLib nasceu para reunir em um só lugar o que normalmente fica espalhado entre leitores de PDF, aplicativos de notas e rastreadores de hábitos. Com ele, é possível montar uma biblioteca, continuar a leitura de onde parou, registrar anotações e acompanhar metas sem depender obrigatoriamente de uma conta.

A aplicação funciona em dois modos:

- **Local:** livros, arquivos e dados de leitura permanecem no navegador atual.
- **Nuvem:** uma conta Supabase permite manter uma biblioteca privada e sincronizar dados entre dispositivos.

## Principais funcionalidades

### Biblioteca e leitura

- Biblioteca com busca, filtros e ordenação, inclusive por avaliação.
- Cadastro e edição de livros com PDF, capa, autor, gênero, páginas e status.
- Avaliação pessoal de livros de 1 a 5 estrelas.
- Leitor de PDF com navegação por botões e teclado.
- Progresso salvo por livro e retomada automática da última página.
- Notas e marcadores associados às páginas do livro.

### Hábitos e acompanhamento

- Metas diárias, semanais e mensais em páginas ou minutos.
- Registro automático de páginas lidas e registro manual de sessões.
- Sequência de leitura, atividade recente e indicadores na página inicial.
- Visualização responsiva para desktop e dispositivos móveis.

### Conta e dados

- Uso local sem cadastro.
- Autenticação por e-mail e senha, cadastro e recuperação de acesso.
- Biblioteca privada com arquivos no Supabase Storage.
- Migração explícita dos dados locais para a conta, sem apagar os originais.
- Exclusão segura de livros e limpeza dos dados associados.

## Tecnologias

- **Interface:** React, TypeScript, Tailwind CSS e Framer Motion.
- **Navegação:** React Router.
- **PDFs:** React PDF e PDF.js.
- **Dados locais:** IndexedDB e localStorage.
- **Nuvem:** Supabase Auth, PostgreSQL e Storage.
- **Ferramentas:** Vite, ESLint e Node.js Test Runner.
- **Deploy:** Vercel.

## Arquitetura

```text
src/
├── components/  # componentes reutilizáveis e seções da interface
├── contexts/    # autenticação e estado compartilhado da biblioteca
├── pages/       # páginas e fluxos principais
├── services/    # persistência, sincronização e regras de acesso
├── types/       # tipos TypeScript do domínio
└── utils/       # cálculos de metas, atividade e helpers
```

Os serviços de persistência isolam o armazenamento local da integração em nuvem. Essa separação permite usar a aplicação sem conta e migrar os dados posteriormente, mantendo a experiência principal disponível mesmo quando o Supabase não está configurado.

## Executando localmente

### Pré-requisitos

- Node.js 22.6 ou superior.
- npm.

### Instalação

```bash
git clone https://github.com/CapivaraDevv/charlib.git
cd charlib
npm install
cp .env.example .env
npm run dev
```

Abra o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

O Supabase é opcional: sem as credenciais, o CharLib continua disponível no modo local. Para ativar autenticação, armazenamento e sincronização, consulte o [guia de configuração do Supabase](supabase/SETUP.md).

## Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
```

Nunca envie o arquivo `.env` para o repositório.

## Scripts

```bash
npm run dev      # inicia o ambiente de desenvolvimento
npm run lint     # verifica as regras de qualidade do código
npm test         # executa os testes automatizados
npm run build    # valida o TypeScript e gera a build de produção
npm run preview  # serve localmente a build gerada
```

## Persistência e sincronização

No modo local:

- O **IndexedDB** guarda livros, PDFs e capas.
- O **localStorage** guarda progresso, última leitura, avaliações, metas, registros, notas e marcadores.

Esses dados permanecem no navegador e no domínio atuais. Limpar os dados do site ou acessar outro dispositivo não transfere automaticamente a biblioteca.

Com uma conta, livros e arquivos ficam no Supabase. Os demais dados usam cache por conta e uma fila de sincronização. A migração local é iniciada pelo usuário e preserva os dados originais.

Os PDFs e as capas são persistidos como arquivos, não como URLs `blob:`. As URLs temporárias são recriadas ao carregar a biblioteca e revogadas quando deixam de ser necessárias.

## Comportamentos importantes

- Editar um livro sem escolher novos arquivos preserva o PDF e a capa atuais.
- Trocar o PDF mantém notas, marcadores e histórico; por isso, as páginas das anotações devem ser conferidas.
- Livros finalizados exibem 100% e são abertos na última página.
- Consultar outra página não desfaz a conclusão do livro.
- Marcar um livro como finalizado não credita páginas retroativamente nas metas.

## Deploy na Vercel

O arquivo `vercel.json` configura os headers de segurança e o fallback das rotas do React Router. Isso permite acessar ou recarregar diretamente URLs como `/library/<id>` sem retornar erro 404.

A política de segurança permite `blob:` em `connect-src`, necessário para que o PDF.js leia os PDFs locais. O worker do PDF.js é empacotado pelo Vite e servido pela própria aplicação.

Após um deploy, valide no mesmo navegador e domínio:

1. Importe um PDF, abra-o e navegue entre as páginas.
2. Recarregue a rota do livro e confirme a persistência do arquivo e do progresso.
3. Feche e reabra a aba e confira também a capa.
4. Verifique no painel de rede as respostas do documento e do worker em `/assets/`.

> `npm run dev` e `npm run preview` não aplicam automaticamente os headers e rewrites do `vercel.json`.

## Qualidade

Os fluxos principais possuem testes automatizados para progresso, isolamento de cache e políticas SQL. Cadastro, persistência, leitura de PDF, notas, marcadores, metas, avaliações, edição, exclusão e layout móvel também foram validados manualmente.

Antes de enviar alterações, execute:

```bash
npm run lint
npm test
npm run build
```

## Roadmap

A primeira integração com Supabase está concluída, incluindo autenticação, biblioteca privada, armazenamento de arquivos e migração dos dados locais. As próximas evoluções planejadas incluem:

- sincronização em tempo real;
- cache offline de PDFs;
- tabelas analíticas por entidade;
- aprimoramentos na resolução de conflitos entre dispositivos.

Veja o planejamento completo em [ROADMAP.md](ROADMAP.md).

## Versão

Versão atual: **v1.0.0**.

---

<div align="center">
  Feito para transformar páginas lidas em uma jornada visível.
</div>
