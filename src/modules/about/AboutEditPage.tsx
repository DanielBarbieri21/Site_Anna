import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getAbout, updateAbout, type AboutData } from '../../lib/aboutApi'

const emptyAbout: AboutData = {
  id: 'default',
  titulo: '',
  subtitulo: '',
  paragrafo_1: '',
  paragrafo_2: '',
  linha_editorial_1: '',
  linha_editorial_2: '',
  autor_nome: '',
  autor_bio: '',
  autor_foto_url: '',
  editora_responsavel: '',
  linguagem: '',
  generos: '',
  periodicidade: '',
  contato_extra: '',
  inspiracao_musica: '',
  inspiracao_livros: '',
  inspiracao_filmes: '',
  updated_at: null,
}

export function AboutEditPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<AboutData>(emptyAbout)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'author')) {
      navigate('/sobre')
      return
    }
    getAbout()
      .then(setData)
      .catch(() => setData(emptyAbout))
      .finally(() => setLoading(false))
  }, [authLoading, user, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || user.role !== 'author') return
    setSaving(true)
    setError(null)
    setInfo(null)
    try {
      await updateAbout({
        titulo: data.titulo ?? '',
        subtitulo: data.subtitulo ?? '',
        paragrafo_1: data.paragrafo_1 ?? '',
        paragrafo_2: data.paragrafo_2 ?? '',
        linha_editorial_1: data.linha_editorial_1 ?? '',
        linha_editorial_2: data.linha_editorial_2 ?? '',
        autor_nome: data.autor_nome ?? '',
        autor_bio: data.autor_bio ?? '',
        autor_foto_url: data.autor_foto_url ?? '',
        editora_responsavel: data.editora_responsavel ?? '',
        linguagem: data.linguagem ?? '',
        generos: data.generos ?? '',
        periodicidade: data.periodicidade ?? '',
        contato_extra: data.contato_extra ?? '',
        inspiracao_musica: data.inspiracao_musica ?? '',
        inspiracao_livros: data.inspiracao_livros ?? '',
        inspiracao_filmes: data.inspiracao_filmes ?? '',
      })
      setInfo('Página Sobre salva com sucesso.')
      setTimeout(() => navigate('/sobre'), 1200)
    } catch (err) {
      console.error(err)
      setError('Não foi possível salvar. Tente de novo.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-700/60" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/50" />
      </div>
    )
  }

  if (!user || user.role !== 'author') {
    return null
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-[#f7f1e7]">
          Editar página Sobre
        </h1>
        <Link
          to="/sobre"
          className="rounded-full border border-slate-600/70 px-3 py-1.5 text-xs text-[#d4deef] hover:border-[#baa78c91]"
        >
          Voltar
        </Link>
      </div>

      {(error || info) && (
        <div className="space-y-2 text-sm">
          {error && (
            <p className="rounded-xl border border-rose-500/40 bg-rose-900/20 px-3 py-2 text-rose-100">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-xl border border-emerald-500/40 bg-emerald-900/20 px-3 py-2 text-emerald-100">
              {info}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-surface space-y-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            Subtítulo (ex: sobre a editora)
          </label>
          <input
            type="text"
            value={data.subtitulo ?? ''}
            onChange={e => setData(d => ({ ...d, subtitulo: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Título principal</label>
          <input
            type="text"
            value={data.titulo ?? ''}
            onChange={e => setData(d => ({ ...d, titulo: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Parágrafo 1</label>
          <textarea
            value={data.paragrafo_1 ?? ''}
            onChange={e => setData(d => ({ ...d, paragrafo_1: e.target.value }))}
            rows={3}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Parágrafo 2</label>
          <textarea
            value={data.paragrafo_2 ?? ''}
            onChange={e => setData(d => ({ ...d, paragrafo_2: e.target.value }))}
            rows={3}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-slate-700/60" />

        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            URL da foto da autora
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={data.autor_foto_url ?? ''}
            onChange={e => setData(d => ({ ...d, autor_foto_url: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
          {data.autor_foto_url && (
            <div className="mt-2 flex justify-center">
              <img
                src={data.autor_foto_url}
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover ring-2 ring-slate-600/50"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Nome da autora</label>
          <input
            type="text"
            value={data.autor_nome ?? ''}
            onChange={e => setData(d => ({ ...d, autor_nome: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            Bio / texto sobre a autora
          </label>
          <textarea
            value={data.autor_bio ?? ''}
            onChange={e => setData(d => ({ ...d, autor_bio: e.target.value }))}
            rows={3}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-slate-700/60" />

        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            Editora responsável
          </label>
          <input
            type="text"
            value={data.editora_responsavel ?? ''}
            onChange={e => setData(d => ({ ...d, editora_responsavel: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Linguagem</label>
          <input
            type="text"
            value={data.linguagem ?? ''}
            onChange={e => setData(d => ({ ...d, linguagem: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Gêneros</label>
          <input
            type="text"
            value={data.generos ?? ''}
            onChange={e => setData(d => ({ ...d, generos: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Periodicidade</label>
          <input
            type="text"
            value={data.periodicidade ?? ''}
            onChange={e => setData(d => ({ ...d, periodicidade: e.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            Texto de contato / parcerias
          </label>
          <textarea
            value={data.contato_extra ?? ''}
            onChange={e => setData(d => ({ ...d, contato_extra: e.target.value }))}
            rows={2}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-slate-700/60" />

        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            Linha editorial – parágrafo 1
          </label>
          <textarea
            value={data.linha_editorial_1 ?? ''}
            onChange={e => setData(d => ({ ...d, linha_editorial_1: e.target.value }))}
            rows={2}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">
            Linha editorial – parágrafo 2
          </label>
          <textarea
            value={data.linha_editorial_2 ?? ''}
            onChange={e => setData(d => ({ ...d, linha_editorial_2: e.target.value }))}
            rows={2}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-slate-700/60" />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f9bb5]">
          Inspirações (perfil)
        </p>
        <p className="text-[11px] text-[#9cabca]">
          Músicas que inspiram, livros e filmes — aparecem na página Sobre.
        </p>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Música que inspira</label>
          <textarea
            value={data.inspiracao_musica ?? ''}
            onChange={e => setData(d => ({ ...d, inspiracao_musica: e.target.value }))}
            rows={3}
            placeholder="Ex.: artistas, álbuns, playlists..."
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Livros</label>
          <textarea
            value={data.inspiracao_livros ?? ''}
            onChange={e => setData(d => ({ ...d, inspiracao_livros: e.target.value }))}
            rows={3}
            placeholder="Ex.: autores e títulos que marcaram..."
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#9cabca]">Filmes</label>
          <textarea
            value={data.inspiracao_filmes ?? ''}
            onChange={e => setData(d => ({ ...d, inspiracao_filmes: e.target.value }))}
            rows={3}
            placeholder="Ex.: filmes ou diretores que inspiram..."
            className="input-surface w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mysterious-pill rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar página Sobre'}
        </button>
      </form>
    </div>
  )
}
