import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { listPostsByCategory, type CMSPost } from '../../lib/postsApi'

export function CategoryPage() {
  const { slug } = useParams()
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      if (!slug) return

      setLoading(true)
      try {
        const data = await listPostsByCategory(slug)
        if (active) setPosts(data)
      } catch (error) {
        if (active) setPosts([])
        console.error(error)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [slug])

  const categoryName = (slug ?? 'categoria').replaceAll('-', ' ')

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9cabca]">
          categoria
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[#f7f1e7]">
          {categoryName}
        </h1>
        <p className="text-sm text-[#b2bed6]">
          Conteúdos publicados nesta categoria e gerenciados pelo CMS.
        </p>
      </header>

      <section className="space-y-3 text-sm text-[#b2bed6]">
        {loading && <p>Carregando textos...</p>}
        {!loading && posts.length === 0 && (
          <div className="card-surface max-w-xl">
            <p>Nenhum texto publicado nesta categoria até o momento.</p>
          </div>
        )}

        <div className="grid gap-4">
          {posts.map(post => (
            <Link
              key={post.id}
              to={`/post/${post.slug ?? post.id}`}
              className="card-surface block space-y-2"
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#8e9bb8]">
                {post.tempo_leitura ?? 5} min de leitura
              </p>
              <h2 className="text-3xl font-semibold text-[#f7efdf]">{post.titulo}</h2>
              <p className="text-sm text-[#b8c2d8]">
                {post.resumo || 'Abra para ler a publicação completa.'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

