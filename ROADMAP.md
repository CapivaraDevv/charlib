# Roadmap do CharLib

## Versão 2 — Sincronização em nuvem com Supabase

Objetivo: permitir que a mesma biblioteca e o progresso de leitura sejam acessados em mais de um dispositivo.

Ordem sugerida de implementação:

1. Configurar o projeto Supabase e as variáveis de ambiente no front-end.
2. Adicionar autenticação (e-mail/senha e, opcionalmente, Google).
3. Migrar metas, progresso e registros de leitura para o banco PostgreSQL.
4. Migrar notas e marcadores, sempre vinculados ao usuário autenticado.
5. Enviar PDFs e capas para o Supabase Storage; guardar no banco apenas os metadados e URLs.
6. Definir a regra de conflito inicial: a alteração mais recente prevalece.
7. Manter uma estratégia de migração dos dados locais existentes para não apagar a biblioteca atual do usuário.

> Esta é uma melhoria de versão futura. A versão atual continua local-first, usando IndexedDB e localStorage.
