import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublishedPostById, type CMSPost } from '../../lib/postsApi'

export function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<CMSPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadPost() {
      if (!id) return

      setLoading(true)
      try {
        const data = await getPublishedPostById(id)
        if (active) setPost(data)
      } catch (error) {
        if (active) setPost(null)
        console.error(error)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPost()
    return () => {
      active = false
    }
  }, [id])

  const paragraphs = useMemo(() => {
    if (!post?.conteudo) return []
    return post.conteudo
      .split(/\n\n+/)
      .map(chunk => chunk.trim())
      .filter(Boolean)
  }, [post])

  if (loading) {
    return <p className="text-sm text-[#9cabca]">Carregando texto...</p>
  }

  if (!post) {
    return (
      <div className="card-surface max-w-xl space-y-2">
        <h1 className="text-2xl font-semibold text-[#f6efe2]">Texto não encontrado</h1>
        <p className="text-sm text-[#9cabca]">
          Esse conteúdo pode estar como rascunho no CMS ou foi removido.
        </p>
      </div>
    )
  }

  return (
    <article className="prose prose-lg max-w-3xl prose-headings:text-[#f8efe0] prose-p:text-[#d8dfef] prose-strong:text-[#fff5e6] prose-hr:border-slate-700 prose-a:text-[#d9c09a]">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9cabca]">
        leitura
      </p>
      <h1 className="mb-2 text-5xl font-semibold tracking-tight text-[#fff5e6]">
        {post.titulo}
      </h1>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-[#9cabca]">
        <span>por Anna</span>
        <span>•</span>
        <span>
          Publicado em{' '}
          {new Date(post.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <span>•</span>
        <span>{post.tempo_leitura ?? 6} min de leitura</span>
      </div>

      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
      ) : (
        <p>{post.resumo || 'Este texto ainda não possui conteúdo formatado.'}</p>
      )}

      <hr className="my-8" />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9cabca]">
          comentários
        </h2>
        <p className="mt-3 text-sm text-[#b3bed6]">
          Próximo upgrade: comentários autenticados com moderação no CMS.
        </p>
      </section>
    </article>
  )
}

