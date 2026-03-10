import { useEffect, useState } from 'react'
import { getSecao, type SecaoData } from '../../lib/secoesApi'
import { EmbedBlock } from './EmbedBlock'

type Props = {
  id: string
  tituloFallback: string
  descricaoFallback: string
}

export function SecaoPage({ id, tituloFallback, descricaoFallback }: Props) {
  const [data, setData] = useState<SecaoData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getSecao(id)
      .then(d => {
        if (active) setData(d)
      })
      .catch(() => {
        if (active) setData(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const titulo = data?.titulo ?? tituloFallback
  const descricao = data?.descricao ?? descricaoFallback
  const perfilUrl = data?.perfil_url
  const itens = data?.itens ?? []

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-700/60" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-800/50" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a3b0c9]">
          {titulo}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#f7f1e7] sm:text-4xl">
          {titulo}
        </h1>
        {descricao && (
          <p className="max-w-2xl text-sm text-[#b5bfd4]">{descricao}</p>
        )}
        {perfilUrl && (
          <a
            href={perfilUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-slate-600/70 px-4 py-2 text-xs font-medium tracking-wide text-[#d4deef] transition hover:border-[#baa78c91]"
          >
            Ver perfil na rede
          </a>
        )}
      </header>

      <section className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        {itens.length === 0 && (
          <div className="card-surface max-w-xl">
            <p className="text-sm text-[#b2bed6]">
              Nenhum conteúdo incorporado ainda. Os itens são exibidos aqui quando configurados no painel.
            </p>
          </div>
        )}
        {itens.map((item, index) => (
          <EmbedBlock key={`${item.url}-${index}`} item={item} />
        ))}
      </section>
    </div>
  )
}
