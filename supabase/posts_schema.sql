-- Execute este script no SQL Editor do Supabase para habilitar o CMS.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  autor_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  resumo text,
  conteudo text not null,
  categoria text not null default 'contos',
  publicado boolean not null default false,
  tempo_leitura integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists posts_autor_id_idx on public.posts (autor_id);
create index if not exists posts_publicado_idx on public.posts (publicado, created_at desc);
create index if not exists posts_categoria_idx on public.posts (categoria);

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

-- Dono pode gerenciar seus proprios posts.
drop policy if exists "Author can manage own posts" on public.posts;
create policy "Author can manage own posts"
on public.posts
for all
using (auth.uid() = autor_id)
with check (auth.uid() = autor_id);
