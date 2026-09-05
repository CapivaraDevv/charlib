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
npm test       # testa regras de progresso (Node.js 22.6 ou superior)
npm run build  # valida TypeScript e gera a build de produção
```

## Persistência de dados

No leitor, use **Editar livro** para alterar título, autor, status, quantidade de
páginas, PDF ou capa. Sem selecionar novos arquivos, os atuais são mantidos;
também é possível remover a capa. O ID, as notas, os marcadores e o histórico
permanecem associados ao livro. Se trocar o PDF, confira as páginas das anotações.

Livros marcados como finalizados exibem 100% e abrem na última página do PDF,
inclusive cadastros antigos. Consultar outra página não desfaz a conclusão.
Marcar como finalizado não credita retroativamente páginas nas metas.
O status pode ser alterado pela edição; apenas abrir o leitor não muda o status.
O card mensal mostra os livros da biblioteca com status **Lendo**.

O projeto adota uma abordagem local-first:

- **IndexedDB:** guarda livros adicionados, PDFs e capas.
- **localStorage:** guarda progresso, última leitura, metas, registros de leitura, notas e marcadores.

Por isso, os dados permanecem no navegador atual. Limpar os dados do site ou usar outro dispositivo não transfere automaticamente a biblioteca.

Os PDFs e capas são persistidos como arquivos (Blobs), não como URLs `blob:`.
As URLs temporárias são recriadas a partir do IndexedDB ao carregar a biblioteca
e revogadas quando substituídas ou quando o provider é desmontado. Recarregar a
página ou publicar uma nova versão no mesmo domínio não exige reimportar o PDF;
outro domínio (inclusive uma URL de preview) tem seu próprio armazenamento.

## Publicação na Vercel

O `vercel.json` define os headers de segurança e o fallback das rotas do React
Router para `/index.html`. Esse rewrite permite abrir ou recarregar diretamente
`/library/<id>` e as demais telas; os arquivos estáticos existentes continuam
sendo servidos normalmente. Não existe API de upload: a importação é local.

A CSP permite `blob:` em `connect-src` porque o PDF.js lê a URL temporária do
PDF. As permissões já existentes em `img-src` (capas) e `worker-src` não foram
ampliadas, e scripts continuam restritos a `'self'`. O worker do PDF.js é
empacotado pelo Vite como um arquivo da própria aplicação.

Após um deploy, valide no mesmo navegador e domínio:

1. Importe um PDF local, abra-o na biblioteca e navegue entre as páginas.
2. Recarregue `/library/<id>` e confirme que o PDF e o progresso permanecem.
3. Feche e reabra a aba nessa URL; confirme também a capa, caso tenha sido enviada.
4. No painel Network, confirme HTTP 200 para a rota e para o worker em `/assets/`,
   e ausência de bloqueios CSP na leitura do PDF. O header deve conter
   `connect-src 'self' blob:`.

`npm run dev` e `npm run preview` não aplicam automaticamente os headers e
rewrites do `vercel.json`; testar apenas nesses servidores não valida a CSP da
Vercel.

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
