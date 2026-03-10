import { supabase } from './supabaseClient'

export type CMSPost = {
  id: string
  titulo: string
  resumo: string | null
  conteudo: string
  categoria: string | null
  publicado: boolean
  created_at: string
  updated_at: string | null
  autor_id: string | null
  tempo_leitura: number | null
}

type UnknownRow = Record<string, unknown>

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' ? value : null
}

function normalizePost(row: UnknownRow): CMSPost {
  return {
    id: asString(row.id) ?? crypto.randomUUID(),
    titulo: asString(row.titulo) ?? asString(row.title) ?? 'Sem titulo',
    resumo: asString(row.resumo) ?? asString(row.excerpt),
    conteudo: asString(row.conteudo) ?? asString(row.content) ?? '',
    categoria: asString(row.categoria) ?? asString(row.category),
    publicado: asBoolean(row.publicado) ?? asBoolean(row.published) ?? false,
    created_at:
      asString(row.created_at) ??
      asString(row.createdAt) ??
      new Date().toISOString(),
    updated_at: asString(row.updated_at) ?? asString(row.updatedAt),
    autor_id: asString(row.autor_id) ?? asString(row.author_id),
    tempo_leitura: asNumber(row.tempo_leitura) ?? asNumber(row.read_time),
  }
}

function sortByDateDesc(posts: CMSPost[]): CMSPost[] {
  return [...posts].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

function matchPublished(post: CMSPost): boolean {
  return post.publicado === true
}

export async function listPublishedPosts(limit = 12): Promise<CMSPost[]> {
  const { data, error } = await supabase.from('posts').select('*')

  if (error) throw error
  const normalized = (data ?? []).map(row => normalizePost(row as UnknownRow))
  return sortByDateDesc(normalized).filter(matchPublished).slice(0, limit)
}

export async function listPostsByCategory(slug: string): Promise<CMSPost[]> {
  const normalized = slug.trim().toLowerCase()
  const { data, error } = await supabase.from('posts').select('*')

  if (error) throw error
  const posts = (data ?? []).map(row => normalizePost(row as UnknownRow))
  return sortByDateDesc(posts).filter(post => {
    const category = post.categoria?.trim().toLowerCase() ?? ''
    return post.publicado && category === normalized
  })
}

export async function getPublishedPostById(id: string): Promise<CMSPost | null> {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id)

  if (error) throw error

  const first = (data ?? [])[0] as UnknownRow | undefined
  if (!first) return null

  const post = normalizePost(first)
  return post.publicado ? post : null
}

export async function listPostsForAuthor(authorId: string): Promise<CMSPost[]> {
  const { data, error } = await supabase.from('posts').select('*')

  if (error) throw error

  const posts = (data ?? []).map(row => normalizePost(row as UnknownRow))
  return sortByDateDesc(posts).filter(post => post.autor_id === authorId)
}

export type PostPayload = {
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  publicado: boolean
  autor_id: string
  tempo_leitura: number | null
}

export async function createPost(payload: PostPayload): Promise<CMSPost> {
  const { data, error } = await supabase
    .from('posts')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return normalizePost(data as UnknownRow)
}

export async function updatePost(
  id: string,
  payload: Omit<PostPayload, 'autor_id'>
): Promise<CMSPost> {
  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return normalizePost(data as UnknownRow)
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}
