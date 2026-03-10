-- Seções Música, Fotos e Vídeos com embeds (SoundCloud, Instagram, YouTube, TikTok).
-- Não hospeda arquivos: só armazena URLs e exibe embeds das redes.
-- Execute no SQL Editor do Supabase.

create table if not exists public.secoes (
  id text primary key,
  titulo text,
  descricao text,
  perfil_url text,
  itens jsonb default '[]'::jsonb,
  updated_at timestamptz default timezone('utc', now())
);

-- Uma linha por seção. itens = [{ "tipo": "soundcloud"|"instagram"|"youtube"|"tiktok", "url": "...", "titulo": "..." }]
insert into public.secoes (id, titulo, descricao, perfil_url, itens)
values
  ('musica', 'Música', 'Tracks e playlists que inspiram. Incorporados pelo SoundCloud.', null, '[]'),
  ('fotos', 'Fotos', 'Imagens e momentos. Incorporados pelo Instagram.', null, '[]'),
  ('videos', 'Vídeos', 'YouTube, TikTok ou Instagram. Incorporados pelas respectivas redes.', null, '[]')
on conflict (id) do nothing;

alter table public.secoes enable row level security;

drop policy if exists "Public can read secoes" on public.secoes;
create policy "Public can read secoes"
on public.secoes for select using (true);

drop policy if exists "Authenticated can update secoes" on public.secoes;
create policy "Authenticated can update secoes"
on public.secoes for update
using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Authenticated can insert secoes" on public.secoes;
create policy "Authenticated can insert secoes"
on public.secoes for insert
with check (auth.uid() is not null);
