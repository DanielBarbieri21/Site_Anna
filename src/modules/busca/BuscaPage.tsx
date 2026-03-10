import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchPublishedPosts, type CMSPost } from '../../lib/postsApi'

export function BuscaPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    searchPublishedPosts(q)
      .then(data => {
        if (active) setPosts(data)
      })
      .catch(() => {
        if (active) setPosts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [q])

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#a3b0c9]">
          busca
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#f7f1e7]">
          {q.trim()
            ? `Resultados para “${q.trim()}”`
            : 'Buscar textos'}
        </h1>
        <p className="text-sm text-[#b2bed6]">
          {q.trim()
            ? `${posts.length} texto(s) encontrado(s).`
            : 'Digite um termo na barra de pesquisa no topo da página.'}
        </p>
      </header>

      {loading && (
        <p className="text-sm text-[#9cabca]">Carregando...</p>
      )}

      {!loading && q.trim() && posts.length === 0 && (
        <div className="card-surface max-w-xl">
          <p className="text-sm text-[#b2bed6]">
            Nenhum texto publicado corresponde a essa busca. Tente outra palavra ou navegue pelas categorias.
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.slug ?? post.id}`}
              className="block rounded-2xl border border-slate-700/40 bg-[#111827b8] p-5 transition hover:-translate-y-0.5 hover:border-[#baa78c91]"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.17em] text-[#98a5c2]">
                <span>{post.categoria ?? 'literatura'}</span>
                <span>•</span>
                <span>{post.tempo_leitura ?? 5} min</span>
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-snug text-[#f4ede0]">
                {post.titulo}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#b5bfd4]">
                {post.resumo || 'Abra para ler o texto completo.'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
