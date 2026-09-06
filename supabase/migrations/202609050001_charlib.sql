-- Execute once in the Supabase SQL Editor of the CharLib project.
begin;

create table public.books (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  id bigint not null check (id > 0 and id <= 9007199254740991),
  title text not null check (length(trim(title)) between 1 and 1000),
  author text not null check (length(trim(author)) between 1 and 1000),
  pages integer not null check (pages > 0),
  current_page integer not null default 0 check (current_page >= 0),
  status text not null check (status in ('planned', 'reading', 'completed')),
  rating numeric not null default 0 check (rating between 0 and 5),
  file_path text not null,
  cover_path text,
  legacy_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id),
  check (file_path like user_id::text || '/' || id::text || '/%'),
  check (cover_path is null or cover_path like user_id::text || '/' || id::text || '/%')
);
alter table public.books enable row level security;
create policy books_owner on public.books for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.books from anon;
grant select, insert, update, delete on public.books to authenticated;

create function public.touch_book_updated_at() returns trigger language plpgsql
set search_path = '' as $$ begin new.updated_at = clock_timestamp(); return new; end; $$;
create trigger books_updated_at before update on public.books
for each row execute function public.touch_book_updated_at();

-- Compatibility documents for progress, notes, bookmarks, goals and activity.
-- Each key is independently versioned; stale devices cannot silently overwrite it.
create table public.user_state (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  key text not null check (
    key in ('last-book', 'reading_entries', 'daily_reading_goal', 'weekly_reading_goal', 'monthly_reading_goal', 'charlib-bookmarks')
    or key ~ '^book-(progress|notes)-[0-9]+$'
  ),
  value text check (octet_length(value) <= 4194304),
  revision bigint not null default 0,
  primary key (user_id, key)
);
alter table public.user_state enable row level security;
create policy state_owner on public.user_state for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.user_state from anon;
grant select, insert, update on public.user_state to authenticated;

create function public.save_user_state(state_key text, state_value text, expected_revision bigint)
returns bigint language plpgsql security invoker set search_path = '' as $$
declare next_revision bigint;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.user_state(user_id, key, value, revision)
    values (auth.uid(), state_key, null, 0) on conflict do nothing;
  update public.user_state set value = state_value, revision = revision + 1
    where user_id = auth.uid() and key = state_key and revision = expected_revision
    returning revision into next_revision;
  if next_revision is null then raise exception 'CHARLIB_CONFLICT'; end if;
  return next_revision;
end; $$;
revoke all on function public.save_user_state(text, text, bigint) from public, anon;
grant execute on function public.save_user_state(text, text, bigint) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('charlib', 'charlib', false, 26214400,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']);
create policy charlib_files_select on storage.objects for select to authenticated
  using (bucket_id = 'charlib' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy charlib_files_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'charlib' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy charlib_files_delete on storage.objects for delete to authenticated
  using (bucket_id = 'charlib' and (storage.foldername(name))[1] = (select auth.uid())::text);
-- Files are immutable: replacements get a new random path, never an overwrite.
commit;
