# Supabase no CharLib

## Ativação do projeto

1. Execute uma vez `migrations/202609050001_charlib.sql` no SQL Editor.
   Ele cria `books`, `user_state`, as políticas RLS e o bucket privado `charlib`.
   A chave pública não tem privilégios administrativos para executar migrações.
2. Em **Authentication → URL Configuration**, configure:
   - Site URL: `https://charlib-three.vercel.app/`
   - Redirect URLs: `https://charlib-three.vercel.app/`, `http://localhost:5173/`
     e `http://127.0.0.1:5173/`.
   - Para testar um preview, adicione também sua URL exata.
3. Mantenha Email e confirmação de e-mail habilitados. O formulário exige pelo
   menos 8 caracteres no cadastro; configure a mesma exigência no Supabase Auth.
4. Para cadastrar usuários fora da equipe do projeto, configure SMTP próprio em
   Authentication. O serviço de e-mail padrão tem restrições de destinatários e
   limites baixos; não é adequado para uso público em produção.
5. Use `.env.example` como referência. `.env.local` fica fora do Git. Na Vercel,
   configure as mesmas variáveis no projeto e nos ambientes que usar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Faça um novo build/deploy somente depois da configuração. O Vite incorpora
   essas variáveis durante o build; mudar a variável sem novo build não atualiza
   o JavaScript já publicado. A CSP em `vercel.json` permite apenas o domínio
   deste projeto Supabase em `connect-src` e `img-src`; ajuste se trocar o projeto.

Nunca use `service_role`, secret key ou senha do banco nas variáveis `VITE_*`.

## Funcionamento

- Sem configuração, o app mantém o comportamento local. Com Supabase, há login,
  cadastro, recuperação de senha e a opção de continuar apenas neste navegador.
- Os livros são registros privados por usuário. PDFs são baixados com a sessão
  autenticada; capas usam links assinados de uma hora. URLs temporárias não são
  persistidas como arquivos nem tornam o bucket público.
- `books` armazena metadados e caminhos dos arquivos; `user_state` armazena
  documentos separados por chave para notas, marcadores, metas, histórico,
  progresso e último livro. Esse formato mantém compatibilidade com os serviços
  locais existentes; não há ainda tabelas analíticas independentes por anotação.
- Progresso e anotações são salvos primeiro em um cache por usuário e enviados
  em seguida. A fila persiste no navegador e tenta novamente ao reconectar,
  periodicamente e ao entrar na mesma conta. Ela não é enviada para outra conta.
- Os dados remotos são carregados ao entrar/recarregar. Use **Minha conta →
  Sincronizar e atualizar** para buscar alterações feitas em outro dispositivo.
  Não há assinatura Realtime nesta primeira versão.
- Alterações concorrentes no mesmo documento geram conflito explícito. O usuário
  escolhe a versão, com cópia local das duas versões antes da resolução. Notas e
  marcadores de um mesmo documento ainda não têm mesclagem automática de conflitos.
- Edições de metadados verificam a versão do livro para não sobrescrever uma
  edição mais recente. Cadastro, edição, exclusão e abertura de PDFs da nuvem
  exigem internet; a biblioteca inteira não é baixada para uso offline.
- Substituições enviam arquivos com caminhos novos. Se a confirmação do banco
  falhar por rede, os arquivos enviados não são apagados automaticamente, pois
  o registro pode ter sido confirmado no servidor. Isso pode deixar arquivos
  órfãos. A limpeza administrativa deve remover somente arquivos comprovadamente
  sem referência e sempre pela API de Storage, não por DELETE no catálogo SQL.

## Migração local

Entre na conta desejada, abra **Minha conta** e selecione **Importar dados deste
navegador**. Ela copia PDFs, capas, livros, notas, marcadores, progresso, metas e
histórico. Não remove os originais no IndexedDB/localStorage. Dados de contas
diferentes e dados locais legados não se misturam sem essa ação explícita.

A migração mantém IDs para preservar associações, detecta colisões, permite
retomar uma cópia parcial e registra sua conclusão para evitar duplicatas.
Notas e histórico usam IDs para deduplicação; metas e progresso já existentes
na conta são mantidos. A cópia é uma operação de migração, não uma sincronização
contínua entre o modo local e a conta.

## Verificação

`npm test` executa as regras de progresso, o isolamento do cache e as políticas
SQL no PostgreSQL local PGlite. O teste SQL usa schemas mínimos que representam
Auth e Storage e aplica a migração real. Não cria dados no Supabase hospedado.

Antes de publicar, valide com duas contas reais:

1. Cadastro, confirmação de e-mail, login, saída e recuperação de senha.
2. Importação local na conta A, incluindo PDF, capa, notas e metas; confira os
   registros e arquivos no painel e abra o mesmo livro em outro navegador.
3. Confirme que a conta B não vê dados da A, nem usando o ID/caminho de um livro.
4. Edite um livro e anote uma página; recarregue no outro dispositivo.
5. Simule desconexão para notas/progresso, depois reconecte e verifique a fila.
6. Altere o mesmo documento em dois dispositivos e resolva o conflito na conta.
7. Confirme ausência de bloqueios CSP e que nenhum PDF/capa é público.

Fontes oficiais: [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security),
[redirecionamentos](https://supabase.com/docs/guides/auth/redirect-urls),
[SMTP](https://supabase.com/docs/guides/auth/auth-smtp),
[chaves públicas](https://supabase.com/docs/guides/getting-started/api-keys).
