-- Página Sobre editável: dados da editora e da autora (incl. foto).
-- Execute no SQL Editor do Supabase após posts_schema.sql.

create table if not exists public.about (
  id text primary key default 'default',
  titulo text,
  subtitulo text,
  paragrafo_1 text,
  paragrafo_2 text,
  linha_editorial_1 text,
  linha_editorial_2 text,
  autor_nome text,
  autor_bio text,
  autor_foto_url text,
  editora_responsavel text,
  linguagem text,
  generos text,
  periodicidade text,
  contato_extra text,
  inspiracao_musica text,
  inspiracao_livros text,
  inspiracao_filmes text,
  updated_at timestamptz default timezone('utc', now())
);

alter table public.about
  add column if not exists inspiracao_musica text,
  add column if not exists inspiracao_livros text,
  add column if not exists inspiracao_filmes text;

-- Garante uma única linha.
insert into public.about (id, titulo, subtitulo, paragrafo_1, paragrafo_2,
  linha_editorial_1, linha_editorial_2, autor_nome, autor_bio, autor_foto_url,
  editora_responsavel, linguagem, generos, periodicidade, contato_extra)
values (
  'default',
  'Um selo artesanal para textos com névoa, silêncio e delicadeza.',
  'sobre a editora',
  'O projeto Contos de Anna nasce como um espaço editorial intimista para contos, crônicas e poesias. A proposta é oferecer uma leitura confortável, com visual noturno, tipografia cuidadosa e um fluxo de publicação simples para a autora.',
  'Aqui, cada texto passa por uma curadoria afetiva: revisão, escolha de título, categorização por atmosfera literária e estimativa de tempo de leitura. O objetivo é que quem chega até aqui se sinta entrando em um pequeno selo literário digital.',
  'Os textos publicados aqui priorizam atmosferas introspectivas, um certo tom de melancolia luminosa e um cuidado especial com ritmo e imagem. Nem todos os textos serão longos; às vezes, uma única cena basta para acender algo em quem lê.',
  'Este site funciona como um caderno público: organizado como um pequeno CMS literário, onde a autora pode criar, editar e publicar com poucos cliques.',
  'Anna',
  null,
  null,
  'Anna (autora)',
  'Português (Brasil)',
  'Contos, crônicas, poesias, microcontos',
  'Publicações sazonais, por inspiração',
  'Para falar sobre propostas editoriais, convites ou parcerias, utilize o contato destacado nos perfis oficiais da autora.'
)
on conflict (id) do nothing;

alter table public.about enable row level security;

-- Leitura pública.
drop policy if exists "Public can read about" on public.about;
create policy "Public can read about"
on public.about for select
using (true);

-- Apenas autenticados podem atualizar (no app só a autora vê o formulário).
drop policy if exists "Authenticated can update about" on public.about;
create policy "Authenticated can update about"
on public.about for update
using (auth.uid() is not null)
with check (auth.uid() is not null);

drop policy if exists "Authenticated can insert about" on public.about;
create policy "Authenticated can insert about"
on public.about for insert
with check (auth.uid() is not null);
