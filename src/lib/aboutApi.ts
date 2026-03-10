import { supabase } from './supabaseClient'

const ABOUT_ID = 'default'

export type AboutData = {
  id: string
  titulo: string | null
  subtitulo: string | null
  paragrafo_1: string | null
  paragrafo_2: string | null
  linha_editorial_1: string | null
  linha_editorial_2: string | null
  autor_nome: string | null
  autor_bio: string | null
  autor_foto_url: string | null
  editora_responsavel: string | null
  linguagem: string | null
  generos: string | null
  periodicidade: string | null
  contato_extra: string | null
  inspiracao_musica: string | null
  inspiracao_livros: string | null
  inspiracao_filmes: string | null
  updated_at: string | null
}

function rowToAbout(row: Record<string, unknown>): AboutData {
  const str = (v: unknown) => (typeof v === 'string' ? v : null)
  return {
    id: str(row.id) ?? ABOUT_ID,
    titulo: str(row.titulo),
    subtitulo: str(row.subtitulo),
    paragrafo_1: str(row.paragrafo_1),
    paragrafo_2: str(row.paragrafo_2),
    linha_editorial_1: str(row.linha_editorial_1),
    linha_editorial_2: str(row.linha_editorial_2),
    autor_nome: str(row.autor_nome),
    autor_bio: str(row.autor_bio),
    autor_foto_url: str(row.autor_foto_url),
    editora_responsavel: str(row.editora_responsavel),
    linguagem: str(row.linguagem),
    generos: str(row.generos),
    periodicidade: str(row.periodicidade),
    contato_extra: str(row.contato_extra),
    inspiracao_musica: str(row.inspiracao_musica),
    inspiracao_livros: str(row.inspiracao_livros),
    inspiracao_filmes: str(row.inspiracao_filmes),
    updated_at: str(row.updated_at),
  }
}

const defaults: AboutData = {
  id: ABOUT_ID,
  titulo: 'Um selo artesanal para textos com névoa, silêncio e delicadeza.',
  subtitulo: 'sobre a editora',
  paragrafo_1:
    'O projeto Contos de Anna nasce como um espaço editorial intimista para contos, crônicas e poesias.',
  paragrafo_2:
    'Aqui, cada texto passa por uma curadoria afetiva: revisão, escolha de título e estimativa de tempo de leitura.',
  linha_editorial_1:
    'Os textos publicados aqui priorizam atmosferas introspectivas e um cuidado especial com ritmo e imagem.',
  linha_editorial_2:
    'Este site funciona como um caderno público, onde a autora pode criar, editar e publicar com poucos cliques.',
  autor_nome: 'Anna',
  autor_bio: null,
  autor_foto_url: null,
  editora_responsavel: 'Anna (autora)',
  linguagem: 'Português (Brasil)',
  generos: 'Contos, crônicas, poesias, microcontos',
  periodicidade: 'Publicações sazonais, por inspiração',
  contato_extra:
    'Para propostas editoriais ou parcerias, utilize o contato dos perfis oficiais da autora.',
  inspiracao_musica: null,
  inspiracao_livros: null,
  inspiracao_filmes: null,
  updated_at: null,
}

export async function getAbout(): Promise<AboutData> {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .eq('id', ABOUT_ID)
    .maybeSingle()

  if (error) throw error
  if (!data) return { ...defaults }
  return rowToAbout(data as Record<string, unknown>)
}

export type AboutPayload = Omit<AboutData, 'id' | 'updated_at'>

export async function updateAbout(payload: Partial<AboutPayload>): Promise<AboutData> {
  const { data, error } = await supabase
    .from('about')
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ABOUT_ID)
    .select('*')
    .single()

  if (error) throw error
  return rowToAbout(data as Record<string, unknown>)
}
