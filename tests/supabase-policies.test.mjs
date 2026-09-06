import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('migration enforces ownership, private files and conflict detection in PostgreSQL', async () => {
  const db = new PGlite();
  try {
    // Minimal Supabase-owned schemas. The application SQL below is unmodified.
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth; create schema storage;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      create function storage.foldername(text) returns text[] language sql immutable as
        $$ select string_to_array($1, '/') $$;
      create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects(id int generated always as identity, bucket_id text, name text);
      alter table storage.objects enable row level security;
      grant usage on schema public, auth, storage to anon, authenticated;
      grant select, insert, update, delete on storage.objects to authenticated;
      grant usage on all sequences in schema storage to authenticated;
      insert into auth.users values ('11111111-1111-4111-8111-111111111111'), ('22222222-2222-4222-8222-222222222222');
    `);
    await db.exec(await readFile(new URL('../supabase/migrations/202609050001_charlib.sql', import.meta.url), 'utf8'));
    const a = '11111111-1111-4111-8111-111111111111';
    const b = '22222222-2222-4222-8222-222222222222';
    await db.exec(`set role anon`);
    await assert.rejects(db.query('select * from public.books'), /permission denied/);
    await assert.rejects(db.query("select public.save_user_state('last-book', '1', 0)"), /permission denied/);
    await db.exec(`reset role; set role authenticated; set request.jwt.claim.sub = '${a}'`);
    await db.query("insert into books(id,title,author,pages,status,file_path) values (1,'A','Author',10,'reading',$1)", [`${a}/1/pdf-test`]);
    await assert.rejects(db.query("insert into books(user_id,id,title,author,pages,status,file_path) values ($1,2,'B','Author',10,'reading',$2)", [b, `${b}/2/pdf-test`]), /row-level security/);
    await assert.rejects(db.query("update books set file_path = $1 where id = 1", [`${b}/1/stolen`]), /check constraint/);
    assert.equal((await db.query("select public.save_user_state('last-book','1',0) as version")).rows[0].version, 1);
    await assert.rejects(db.query("select public.save_user_state('last-book','2',0)"), /CHARLIB_CONFLICT/);
    await db.query("insert into storage.objects(bucket_id,name) values ('charlib',$1)", [`${a}/1/pdf-test`]);
    await db.exec(`set request.jwt.claim.sub = '${b}'`);
    assert.equal((await db.query('select * from books')).rows.length, 0);
    assert.equal((await db.query('select * from user_state')).rows.length, 0);
    assert.equal((await db.query('select * from storage.objects')).rows.length, 0);
    assert.equal((await db.query("delete from books where id=1 returning id")).rows.length, 0);
    await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values ('charlib',$1)", [`${a}/1/bad`]), /row-level security/);
    assert.equal((await db.query("select public.save_user_state('last-book','2',0) as version")).rows[0].version, 1);
    await db.exec('reset role');
    assert.equal((await db.query("select public from storage.buckets where id='charlib'")).rows[0].public, false);
  } finally { await db.close(); }
});
