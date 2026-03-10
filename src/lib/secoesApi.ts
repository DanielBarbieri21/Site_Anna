import { supabase } from './supabaseClient'

export type EmbedItem = {
  tipo: 'soundcloud' | 'instagram' | 'youtube' | 'tiktok'
  url: string
  titulo?: string
}

export type SecaoData = {
  id: string
  titulo: string | null
  descricao: string | null
  perfil_url: string | null
  itens: EmbedItem[]
  updated_at: string | null
}

function parseItens(raw: unknown): EmbedItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (x): x is Record<string, unknown> =>
        x != null && typeof x === 'object' && typeof (x as Record<string, unknown>).url === 'string'
    )
    .map(x => ({
      tipo: (['soundcloud', 'instagram', 'youtube', 'tiktok'].includes((x.tipo as string) ?? '')
        ? (x.tipo as EmbedItem['tipo'])
        : 'youtube') as EmbedItem['tipo'],
      url: String(x.url),
      titulo: typeof x.titulo === 'string' ? x.titulo : undefined,
    }))
}

export async function getSecao(id: string): Promise<SecaoData | null> {
  const { data, error } = await supabase.from('secoes').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as Record<string, unknown>
  return {
    id: String(row.id),
    titulo: typeof row.titulo === 'string' ? row.titulo : null,
    descricao: typeof row.descricao === 'string' ? row.descricao : null,
    perfil_url: typeof row.perfil_url === 'string' ? row.perfil_url : null,
    itens: parseItens(row.itens),
    updated_at: typeof row.updated_at === 'string' ? row.updated_at : null,
  }
}

export async function updateSecao(
  id: string,
  payload: Partial<Omit<SecaoData, 'id' | 'updated_at'>>
): Promise<SecaoData> {
  const { data, error } = await supabase
    .from('secoes')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  const row = data as Record<string, unknown>
  return {
    id: String(row.id),
    titulo: typeof row.titulo === 'string' ? row.titulo : null,
    descricao: typeof row.descricao === 'string' ? row.descricao : null,
    perfil_url: typeof row.perfil_url === 'string' ? row.perfil_url : null,
    itens: parseItens(row.itens),
    updated_at: typeof row.updated_at === 'string' ? row.updated_at : null,
  }
}

/** Converte URL do SoundCloud em URL de embed. */
export function soundcloudEmbedUrl(url: string): string {
  const u = url.trim()
  if (u.includes('embed')) return u
  const m = u.match(/soundcloud\.com\/([^/?#]+)\/([^/?#]+)/)
  if (m) return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4b896`
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23d4b896`
}

/** Converte URL do YouTube em URL de embed. */
export function youtubeEmbedUrl(url: string): string {
  const u = url.trim()
  const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  if (u.includes('youtube.com/embed/')) return u
  return u
}

/** URL de embed do TikTok (iframe src). */
export function tiktokEmbedUrl(url: string): string {
  const u = url.trim()
  const m = u.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  if (m) return `https://www.tiktok.com/embed/v2/${m[1]}`
  return u
}

/** URL de embed do Instagram (iframe src). */
export function instagramEmbedUrl(url: string): string {
  const u = url.trim()
  const m = u.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.instagram.com/p/${m[1]}/embed`
  return u
}
