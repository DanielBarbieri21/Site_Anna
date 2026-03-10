import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  createPost,
  deletePost,
  listPostsForAuthor,
  updatePost,
  type CMSPost,
} from '../../lib/postsApi'

type EditorState = {
  titulo: string
  resumo: string
  conteudo: string
  categoria: string
  publicado: boolean
  tempoLeitura: string
}

const initialState: EditorState = {
  titulo: '',
  resumo: '',
  conteudo: '',
  categoria: 'contos',
  publicado: true,
  tempoLeitura: '6',
}

function formatError(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback

  const maybe = error as {
    message?: string
    details?: string
    hint?: string
    code?: string
  }

  const parts = [maybe.message, maybe.details, maybe.hint].filter(
    value => typeof value === 'string' && value.trim().length > 0
  ) as string[]

  if (parts.length === 0) return fallback
  const codePrefix = maybe.code ? `[${maybe.code}] ` : ''
  return `${codePrefix}${parts.join(' | ')}`
}

export function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editor, setEditor] = useState<EditorState>(initialState)

  useEffect(() => {
    if (!user) return
    void refreshPosts(user.id)
  }, [user])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [loading, user, navigate])

  async function refreshPosts(authorId: string) {
    setLoadingPosts(true)
    setError(null)
    try {
      const data = await listPostsForAuthor(authorId)
      setPosts(data)
    } catch (err) {
      console.error(err)
      setError(formatError(err, 'Não foi possível carregar os posts do CMS.'))
    } finally {
      setLoadingPosts(false)
    }
  }

  function startNewPost() {
    setEditingPostId(null)
    setEditor(initialState)
    setInfo('Novo rascunho iniciado.')
  }

  function startEdit(post: CMSPost) {
    setEditingPostId(post.id)
    setEditor({
      titulo: post.titulo,
      resumo: post.resumo ?? '',
      conteudo: post.conteudo ?? '',
      categoria: post.categoria ?? 'contos',
      publicado: post.publicado,
      tempoLeitura: String(post.tempo_leitura ?? 6),
    })
    setInfo('Modo de edição ativado.')
  }

  async function handleDelete(id: string) {
    if (!user) return

    const confirmed = window.confirm('Deseja excluir este post permanentemente?')
    if (!confirmed) return

    setError(null)
    setInfo(null)
    try {
      await deletePost(id)
      if (editingPostId === id) {
        setEditingPostId(null)
        setEditor(initialState)
      }
      await refreshPosts(user.id)
      setInfo('Post excluído com sucesso.')
    } catch (err) {
      console.error(err)
      setError(formatError(err, 'Falha ao excluir o post.'))
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!user) return

    setSaving(true)
    setError(null)
    setInfo(null)
    try {
      const payload = {
        titulo: editor.titulo.trim(),
        resumo: editor.resumo.trim(),
        conteudo: editor.conteudo.trim(),
        categoria: editor.categoria.trim().toLowerCase(),
        publicado: editor.publicado,
        tempo_leitura: Number.isNaN(Number(editor.tempoLeitura))
          ? null
          : Number(editor.tempoLeitura),
        slug: editor.titulo.trim()
          ? editor.titulo
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
              .slice(0, 80)
          : null,
      }

      if (!payload.titulo || !payload.conteudo) {
        setError('Título e conteúdo são obrigatórios.')
        return
      }

      if (editingPostId) {
        await updatePost(editingPostId, payload)
        setInfo('Post atualizado com sucesso.')
      } else {
        await createPost({
          ...payload,
          autor_id: user.id,
        })
        setInfo('Post criado com sucesso.')
      }

      await refreshPosts(user.id)
      setEditingPostId(null)
      setEditor(initialState)
    } catch (err) {
      console.error(err)
      setError(formatError(err, 'Falha ao salvar no CMS.'))
    } finally {
      setSaving(false)
    }
  }

  // Salvamento automático de rascunho no Supabase
  useEffect(() => {
    if (!user) return

    const hasContent =
      editor.titulo.trim().length > 0 || editor.conteudo.trim().length > 0
    if (!hasContent) return

    const handler = window.setTimeout(async () => {
      setAutoSaving(true)
      setError(null)

      try {
        const payload = {
          titulo: editor.titulo.trim(),
          resumo: editor.resumo.trim(),
          conteudo: editor.conteudo.trim(),
          categoria: editor.categoria.trim().toLowerCase(),
          publicado: editor.publicado,
          tempo_leitura: Number.isNaN(Number(editor.tempoLeitura))
            ? null
            : Number(editor.tempoLeitura),
          slug: editor.titulo.trim()
            ? editor.titulo
                .trim()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .slice(0, 80)
            : null,
        }

        if (!payload.titulo || !payload.conteudo) {
          setAutoSaving(false)
          return
        }

        if (editingPostId) {
          const updated = await updatePost(editingPostId, payload)
          setPosts(prev =>
            prev.map(post => (post.id === updated.id ? updated : post))
          )
        } else {
          const created = await createPost({
            ...payload,
            autor_id: user.id,
          })
          setEditingPostId(created.id)
          setPosts(prev => [created, ...prev])
        }

        const now = new Date()
        const formatted = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
        setLastSavedAt(formatted)
        setInfo('Rascunho salvo automaticamente.')
      } catch (err) {
        console.error(err)
        setError(formatError(err, 'Falha ao salvar rascunho automaticamente.'))
      } finally {
        setAutoSaving(false)
      }
    }, 2000)

    return () => {
      window.clearTimeout(handler)
    }
  }, [editor, user, editingPostId])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-700" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-800/80" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md space-y-4 rounded-2xl border border-amber-500/40 bg-amber-900/20 p-6 text-sm text-amber-100">
        <p className="font-semibold">Faça login para publicar</p>
        <p>
          Entre com seu e-mail ou conta Google para acessar o painel. Depois você
          poderá criar e publicar contos, histórias e poesias.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#98a5c2]">
            seu painel
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#f7efe1]">
            Publicar conto, história ou poesia
          </h1>
          <p className="text-sm text-[#b2bed6]">
            Olá! Crie rascunhos, publique textos e escolha a categoria (contos, crônicas, poesias).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/secoes"
            className="rounded-full border border-slate-600/70 px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#d4deef] transition hover:border-[#baa78c91]"
          >
            Música, Fotos e Vídeos
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-slate-600/70 px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#d4deef] transition hover:border-rose-400 hover:text-rose-200"
          >
            Sair
          </button>
        </div>
      </header>

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

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="card-surface space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f9bb5]">
              {editingPostId ? 'editando post' : 'novo post'}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#8f9bb5]">
              {autoSaving && <span>Salvando rascunho...</span>}
              {!autoSaving && lastSavedAt && (
                <span>Rascunho salvo às {lastSavedAt}</span>
              )}
            </div>
            <button
              type="button"
              onClick={startNewPost}
              className="rounded-full border border-slate-600/70 px-3 py-1 text-[11px] text-[#d2dcef] transition hover:border-[#baa78c91]"
            >
              Limpar
            </button>
          </div>

          <input
            placeholder="Título"
            value={editor.titulo}
            onChange={event => setEditor(prev => ({ ...prev, titulo: event.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />

          <input
            placeholder="Resumo"
            value={editor.resumo}
            onChange={event => setEditor(prev => ({ ...prev, resumo: event.target.value }))}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />

          <textarea
            placeholder="Conteúdo completo"
            value={editor.conteudo}
            onChange={event => setEditor(prev => ({ ...prev, conteudo: event.target.value }))}
            rows={10}
            className="input-surface w-full rounded-lg px-3 py-2 text-sm outline-none"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Categoria"
              value={editor.categoria}
              onChange={event =>
                setEditor(prev => ({ ...prev, categoria: event.target.value }))
              }
              className="input-surface rounded-lg px-3 py-2 text-sm outline-none"
            />

            <input
              type="number"
              min={1}
              max={60}
              placeholder="Tempo leitura"
              value={editor.tempoLeitura}
              onChange={event =>
                setEditor(prev => ({ ...prev, tempoLeitura: event.target.value }))
              }
              className="input-surface rounded-lg px-3 py-2 text-sm outline-none"
            />

            <label className="flex items-center gap-2 rounded-lg border border-slate-600/70 bg-[#0e1626c2] px-3 py-2 text-sm text-[#d4deef]">
              <input
                type="checkbox"
                checked={editor.publicado}
                onChange={event =>
                  setEditor(prev => ({ ...prev, publicado: event.target.checked }))
                }
              />
              Publicado (aparece no inicio)
            </label>
          </div>

          <button
            disabled={saving}
            type="submit"
            className="mysterious-pill rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:brightness-110 disabled:opacity-60"
          >
            {saving
              ? 'Salvando...'
              : editingPostId
                ? 'Atualizar publicação'
                : 'Criar publicação'}
          </button>
        </form>

        <div className="card-surface space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f9bb5]">
              biblioteca
            </p>
            <button
              type="button"
              onClick={() => void refreshPosts(user.id)}
              className="rounded-full border border-slate-600/70 px-3 py-1 text-[11px] text-[#d2dcef] transition hover:border-[#baa78c91]"
            >
              Atualizar
            </button>
          </div>

          {loadingPosts && <p className="text-sm text-[#9cabca]">Carregando posts...</p>}

          {!loadingPosts && posts.length === 0 && (
            <p className="text-sm text-[#9cabca]">Nenhum post criado ainda.</p>
          )}

          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {posts.map(post => (
              <article
                key={post.id}
                className="rounded-xl border border-slate-700/50 bg-[#0f1727c7] p-3"
              >
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8f9bb5]">
                  {post.publicado ? 'publicado' : 'rascunho'} • {post.categoria || 'sem categoria'}
                </p>
                <h2 className="mt-1 line-clamp-2 text-2xl font-semibold text-[#f5eddc]">
                  {post.titulo}
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-[#aab7d2]">
                  {post.resumo || 'Sem resumo'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className="rounded-full border border-slate-600 px-2.5 py-1 text-[#d6e0f3] hover:border-[#baa78c91]"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(post.id)}
                    className="rounded-full border border-rose-500/60 px-2.5 py-1 text-rose-200 hover:border-rose-400"
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

