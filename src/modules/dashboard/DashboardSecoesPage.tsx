import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  getSecao,
  updateSecao,
  type SecaoData,
  type EmbedItem,
} from '../../lib/secoesApi'

const SECOES_IDS = ['musica', 'fotos', 'videos'] as const
const TIPOS: Record<string, EmbedItem['tipo'][]> = {
  musica: ['soundcloud'],
  fotos: ['instagram'],
  videos: ['youtube', 'tiktok', 'instagram'],
}

export function DashboardSecoesPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [secoes, setSecoes] = useState<Record<string, SecaoData | null>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
      return
    }
    if (!user) return
    Promise.all(SECOES_IDS.map(id => getSecao(id)))
      .then(([m, f, v]) => {
        setSecoes({ musica: m ?? null, fotos: f ?? null, videos: v ?? null })
      })
      .catch(() => setSecoes({ musica: null, fotos: null, videos: null }))
      .finally(() => setLoading(false))
  }, [authLoading, user, navigate])

  async function handleSave(id: string, payload: Partial<SecaoData>) {
    setSaving(id)
    setError(null)
    setInfo(null)
    try {
      const updated = await updateSecao(id, payload)
      setSecoes(prev => ({ ...prev, [id]: updated }))
      setInfo('Seção salva.')
    } catch (err) {
      console.error(err)
      setError('Não foi possível salvar.')
    } finally {
      setSaving(null)
    }
  }

  if (authLoading || !user) return null
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-700/60" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-800/50" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#f7f1e7]">
            Música, Fotos e Vídeos
          </h1>
          <p className="mt-1 text-sm text-[#b2bed6]">
            Configure os embeds por rede (SoundCloud, Instagram, YouTube, TikTok). Sem pesar a hospedagem.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="rounded-full border border-slate-600/70 px-3 py-1.5 text-xs text-[#d4deef] hover:border-[#baa78c91]"
        >
          Voltar ao painel
        </Link>
      </div>

      {(error || info) && (
        <div className="text-sm">
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

      <div className="rounded-2xl border border-slate-700/50 bg-[#0d1627c0] p-5 text-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#a3b0c9]">
          Como pegar a URL de cada rede
        </p>
        <ul className="space-y-3 text-[#b5bfd4]">
          <li>
            <span className="font-medium text-[#e2dccf]">SoundCloud:</span> Abra a faixa ou playlist no site, copie o link da barra de endereço. Ex.:{' '}
            <code className="rounded bg-[#0b1020] px-1.5 py-0.5 text-[11px] text-[#d2c0a0]">
              soundcloud.com/usuario/nome-da-faixa
            </code>
          </li>
          <li>
            <span className="font-medium text-[#e2dccf]">Instagram (foto ou vídeo):</span> Abra a publicação, toque em ••• e escolha &quot;Copiar link&quot;. Ex.:{' '}
            <code className="rounded bg-[#0b1020] px-1.5 py-0.5 text-[11px] text-[#d2c0a0]">
              instagram.com/p/ABC123/
            </code>
          </li>
          <li>
            <span className="font-medium text-[#e2dccf]">YouTube:</span> Copie o link do vídeo. Ex.:{' '}
            <code className="rounded bg-[#0b1020] px-1.5 py-0.5 text-[11px] text-[#d2c0a0]">
              youtube.com/watch?v=ID_DO_VIDEO
            </code>
          </li>
          <li>
            <span className="font-medium text-[#e2dccf]">TikTok:</span> Abra o vídeo e copie o link. Ex.:{' '}
            <code className="rounded bg-[#0b1020] px-1.5 py-0.5 text-[11px] text-[#d2c0a0]">
              tiktok.com/@usuario/video/123456789
            </code>
          </li>
        </ul>
      </div>

      <div className="space-y-8">
        {SECOES_IDS.map(id => {
          const secao = secoes[id]
          const tipos = TIPOS[id] ?? ['youtube']
          return (
            <SecaoForm
              key={id}
              id={id}
              data={secao}
              tipos={tipos}
              saving={saving === id}
              onSave={payload => handleSave(id, payload)}
            />
          )
        })}
      </div>
    </div>
  )
}

function SecaoForm({
  id,
  data,
  tipos,
  saving,
  onSave,
}: {
  id: string
  data: SecaoData | null
  tipos: EmbedItem['tipo'][]
  saving: boolean
  onSave: (p: Partial<SecaoData>) => void
}) {
  const [titulo, setTitulo] = useState(data?.titulo ?? '')
  const [descricao, setDescricao] = useState(data?.descricao ?? '')
  const [perfilUrl, setPerfilUrl] = useState(data?.perfil_url ?? '')
  const [itens, setItens] = useState<EmbedItem[]>(data?.itens ?? [])

  useEffect(() => {
    if (data) {
      setTitulo(data.titulo ?? '')
      setDescricao(data.descricao ?? '')
      setPerfilUrl(data.perfil_url ?? '')
      setItens(data.itens ?? [])
    }
  }, [data])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSave({ titulo, descricao, perfil_url: perfilUrl || null, itens })
  }

  function addItem(tipo: EmbedItem['tipo']) {
    setItens(prev => [...prev, { tipo, url: '', titulo: '' }])
  }

  function updateItem(index: number, patch: Partial<EmbedItem>) {
    setItens(prev => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function removeItem(index: number) {
    setItens(prev => prev.filter((_, i) => i !== index))
  }

  const labels: Record<string, string> = {
    musica: 'Música (SoundCloud)',
    fotos: 'Fotos (Instagram)',
    videos: 'Vídeos (YouTube, TikTok, Instagram)',
  }

  const exemploUrl =
    id === 'musica'
      ? 'https://soundcloud.com/usuario/nome-da-faixa'
      : id === 'fotos'
        ? 'https://www.instagram.com/p/ABC123xyz/'
        : 'https://www.youtube.com/watch?v=xxxxxxxx'

  return (
    <form onSubmit={handleSubmit} className="card-surface space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8f9bb5]">
        {labels[id] ?? id}
      </h2>

      <div>
        <label className="mb-1 block text-xs text-[#9cabca]">Título da seção</label>
        <input
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="input-surface w-full rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-[#9cabca]">Descrição (opcional)</label>
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          rows={2}
          className="input-surface w-full rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-[#9cabca]">
          Link do perfil na rede (opcional)
        </label>
        <input
          type="url"
          value={perfilUrl}
          onChange={e => setPerfilUrl(e.target.value)}
          placeholder="https://..."
          className="input-surface w-full rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <label className="block text-xs text-[#9cabca]">Itens incorporados (URLs)</label>
            <p className="mt-0.5 text-[11px] text-[#8f9bb5]">
              Cole o link completo. Ex.: <code className="rounded bg-[#0b1020] px-1 text-[10px] text-[#d2c0a0]">{exemploUrl}</code>
            </p>
          </div>
          <div className="flex gap-2">
            {tipos.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => addItem(t)}
                className="rounded-full border border-slate-600/70 px-2.5 py-1 text-[11px] text-[#d2dcef] hover:border-[#baa78c91]"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {itens.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-start gap-2 rounded-xl border border-slate-700/50 bg-[#0b1220] p-3"
            >
              <select
                value={item.tipo}
                onChange={e => updateItem(index, { tipo: e.target.value as EmbedItem['tipo'] })}
                className="input-surface w-28 rounded-lg px-2 py-1.5 text-xs"
              >
                {tipos.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={item.url}
                onChange={e => updateItem(index, { url: e.target.value })}
                placeholder="URL do conteúdo"
                className="input-surface min-w-[200px] flex-1 rounded-lg px-3 py-1.5 text-sm"
              />
              <input
                type="text"
                value={item.titulo ?? ''}
                onChange={e => updateItem(index, { titulo: e.target.value })}
                placeholder="Título (opcional)"
                className="input-surface w-32 rounded-lg px-2 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded border border-rose-500/60 px-2 py-1 text-[11px] text-rose-200 hover:border-rose-400"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mysterious-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] disabled:opacity-60"
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
