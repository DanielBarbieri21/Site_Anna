# Contos de Anna
# Veja como ficou :
# https://contosepoesiasdeanna.netlify.app/

Site literario com visual dark/misterioso, autenticacao e CMS para publicacao de contos e poesias.

## Visao Geral

O projeto foi construido com React + Vite e integra Supabase para:

- autenticacao de autora (email/senha e Google)
- armazenamento de posts
- leitura publica de conteudos publicados
- painel CMS com criar/editar/excluir/publicar

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase (Auth + PostgREST)

## Estrutura

```text
src/
  lib/
    supabaseClient.ts
    postsApi.ts
  modules/
    app/
    auth/
    dashboard/
    home/
    posts/
    categories/
    authors/
  shared/
```

## Requisitos

- Node.js 18+
- npm 9+
- Projeto Supabase configurado

## Configuracao

1. Instale dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

3. No Supabase SQL Editor, execute o script:

```text
supabase/posts_schema.sql
```

Esse script cria/ajusta a tabela `posts`, indices, trigger de `updated_at` e politicas de seguranca (RLS).

## Rodando localmente

```bash
npm run dev
```

Build de producao:

```bash
npm run build
```

Preview da build:

```bash
npm run preview
```

## Fluxo de Publicacao

1. Acesse `Entrar` e autentique.
2. Abra `Dashboard`.
3. Crie o post e mantenha `Publicado` marcado para aparecer na pagina inicial.
4. Salve.

## Observacoes de Banco

Se aparecer erro de foreign key (`posts_autor_fk`), rode novamente `supabase/posts_schema.sql` para corrigir a referencia de `autor_id` para `auth.users(id)`.

## Scripts

- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de producao
- `npm run preview` - preview da build

## Licenca

Uso privado do projeto.
