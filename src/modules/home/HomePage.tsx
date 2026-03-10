import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { listPublishedPosts, type CMSPost } from '../../lib/postsApi'
import { supabase } from '../../lib/supabaseClient'

type HomePost = Pick<
  CMSPost,
  'id' | 'titulo' | 'resumo' | 'categoria' | 'tempo_leitura' | 'slug'
>

const fallbackPosts: HomePost[] = [
  {
    id: '1',
    titulo: 'A casa que respirava memórias',
    resumo:
      'Toda noite, às 23h14, as paredes pareciam se inclinar um pouco mais para ouvir o silêncio...',
    categoria: 'contos',
    tempo_leitura: 6,
    slug: 'a-casa-que-respirava-memorias',
  },
  {
    id: '2',
    titulo: 'Cartas que nunca enviei para mim',
    resumo:
      'Escrevo na borda do travesseiro, porque é ali que os pensamentos se deitam primeiro.',
    categoria: 'cronicas',
    tempo_leitura: 4,
    slug: 'cartas-que-nunca-enviei-para-mim',
  },
]

export function HomePage() {
  const [posts, setPosts] = useState<CMSPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadPosts() {
      setLoading(true)
      try {
        const data = await listPublishedPosts(8)
        if (active) setPosts(data)
      } catch (error) {
        if (active) setPosts([])
        console.error(error)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPosts()
    const channel = supabase
      .channel('public:posts-home-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          void loadPosts()
        }
      )
      .subscribe()

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const recentPosts = useMemo<HomePost[]>(() => {
    if (posts.length > 0) return posts
    return fallbackPosts
  }, [posts])

  const highlightPost = recentPosts[0]

  return (
    <div className="space-y-10">
      <section className="grid gap-12 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a3b0c9]">
            um refúgio para palavras
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#f7f1e7] sm:text-5xl lg:text-6xl">
            Histórias com névoa, silêncio e beleza em cada linha.
          </h1>
          <p className="max-w-xl text-sm text-[#b5bfd4]">
            Um espaço editorial para contos e poesias com atmosfera noturna,
            leitura confortável e curadoria autoral. O conteúdo agora pode ser
            gerenciado diretamente pelo CMS no dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a3b0c9]">
            em destaque
          </p>
          <motion.div
            whileHover={{ y: -4 }}
            className="card-surface cursor-pointer space-y-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#d2c0a0]">
              postagem recente
            </p>
            <h2 className="text-2xl font-semibold leading-snug text-[#f6efe2]">
              {highlightPost?.titulo ?? 'No corredor das janelas acesas'}
            </h2>
            <p className="text-sm text-[#b2bed6]">
              {highlightPost?.resumo ??
                'Uma breve história sobre noites insones, apartamentos silenciosos e as vidas que piscam por trás de cada janela.'}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#8f9bb5]">
              <span>Anna</span>
              <span>•</span>
              <span>{highlightPost?.tempo_leitura ?? 7} min de leitura</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a3b0c9]">
              recentes
            </h2>
            {loading && <span className="text-xs text-[#8f9bb5]">carregando...</span>}
          </div>
          <div className="space-y-4">
            {recentPosts.map(post => (
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
                <h3 className="mt-2 text-2xl font-semibold leading-snug text-[#f4ede0]">
                  {post.titulo}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#b5bfd4]">
                  {post.resumo || 'Abra para ler o texto completo.'}
                </p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-[#8f9bb5]">
                  <span>Anna</span>
                  <span>•</span>
                  <span>Publicado recentemente</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3b0c9]">
              categorias
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {[
                { label: 'Contos', slug: 'contos' },
                { label: 'Poesias', slug: 'poesias' },
                { label: 'Crônicas', slug: 'cronicas' },
                { label: 'Microcontos', slug: 'microcontos' },
              ].map(category => (
                <Link
                  key={category.slug}
                  to={`/categoria/${category.slug}`}
                  className="rounded-full border border-slate-700/60 bg-[#121b2d99] px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#bdc7db] transition hover:border-[#baa78c91] hover:text-[#f2e6d2]"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

