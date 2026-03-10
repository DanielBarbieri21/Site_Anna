-- Execute este script no SQL Editor do Supabase para habilitar o CMS.
create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid()
);

-- Compatibilidade: adiciona colunas caso a tabela ja exista com schema antigo.
alter table public.posts
  add column if not exists autor_id uuid references auth.users(id) on delete cascade,
  add column if not exists titulo text,
  add column if not exists resumo text,
  add column if not exists conteudo text,
  add column if not exists categoria text default 'contos',
  add column if not exists publicado boolean default false,
  add column if not exists tempo_leitura integer,
  add column if not exists slug text,
  add column if not exists created_at timestamptz default timezone('utc', now()),
  add column if not exists updated_at timestamptz default timezone('utc', now());

-- Backfill para registros antigos sem datas.
update public.posts
set created_at = timezone('utc', now())
where created_at is null;

update public.posts
set updated_at = timezone('utc', now())
where updated_at is null;

-- Corrige FK antiga que pode apontar para public.users.
alter table public.posts drop constraint if exists posts_autor_fk;
alter table public.posts drop constraint if exists posts_autor_id_fkey;

alter table public.posts
  add constraint posts_autor_fk
  foreign key (autor_id)
  references auth.users(id)
  on delete cascade
  not valid;

create index if not exists posts_autor_id_idx on public.posts (autor_id);
create index if not exists posts_publicado_idx on public.posts (publicado, created_at desc);
create index if not exists posts_categoria_idx on public.posts (categoria);
create index if not exists posts_slug_idx on public.posts (slug) where slug is not null;

create or replace function public.touch_posts_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_posts_touch_updated_at on public.posts;
create trigger trg_posts_touch_updated_at
before update on public.posts
for each row execute procedure public.touch_posts_updated_at();

alter table public.posts enable row level security;

-- Leitura publica apenas de posts publicados.
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts
for select
using (publicado = true);

-- Dono pode gerenciar seus proprios posts (insert/update/delete e leitura de rascunhos).
drop policy if exists "Author can manage own posts" on public.posts;
create policy "Author can manage own posts"
on public.posts
for all
using (auth.uid() = autor_id)
with check (auth.uid() = autor_id);

-- Resumo RLS:
-- - SELECT: qualquer um ve posts publicados; autenticado ve tambem os proprios (incl. rascunhos).
-- - INSERT: so se autor_id = auth.uid() (app envia o id do usuario logado).
-- - UPDATE/DELETE: so o dono (auth.uid() = autor_id).
--
-- Realtime (lista da home): no dashboard do Supabase, Database -> Replication,
-- habilite a tabela public.posts para ver novos posts na home sem recarregar.
