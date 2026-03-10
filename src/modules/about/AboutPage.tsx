import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAbout, type AboutData } from '../../lib/aboutApi'
import { useAuth } from '../auth/AuthContext'

export function AboutPage() {
  const { user } = useAuth()
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getAbout()
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
  }, [])

  const about = data ?? {
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
  } as AboutData

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-700/60" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-800/50" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {user?.role === 'author' && (
        <div className="flex justify-end">
          <Link
            to="/sobre/editar"
            className="rounded-full border border-slate-600/70 px-4 py-2 text-xs font-medium tracking-wide text-[#d4deef] transition hover:border-[#baa78c91]"
          >
            Editar página Sobre
          </Link>
        </div>
      )}

      <section className="grid gap-10 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a3b0c9]">
            {about.subtitulo ?? 'sobre a editora'}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#f7f1e7] sm:text-4xl">
            {about.titulo}
          </h1>
          {about.paragrafo_1 && (
            <p className="text-sm leading-relaxed text-[#b5bfd4]">{about.paragrafo_1}</p>
          )}
          {about.paragrafo_2 && (
            <p className="text-sm leading-relaxed text-[#b5bfd4]">{about.paragrafo_2}</p>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card-surface space-y-4"
        >
          {about.autor_foto_url && (
            <div className="flex justify-center">
              <img
                src={about.autor_foto_url}
                alt={about.autor_nome ?? 'Autora'}
                className="h-40 w-40 rounded-full object-cover ring-2 ring-slate-600/50"
              />
            </div>
          )}
          {about.autor_nome && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3b0c9]">
                autora
              </h2>
              <p className="mt-2 font-medium text-[#f4ede0]">{about.autor_nome}</p>
              {about.autor_bio && (
                <p className="mt-2 text-sm leading-relaxed text-[#b5bfd4]">
                  {about.autor_bio}
                </p>
              )}
            </div>
          )}

          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3b0c9]">
            ficha da editora
          </h2>
          <dl className="space-y-2 text-sm text-[#c0c9dd]">
            {about.editora_responsavel && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#8f9bb5]">Editora responsável</dt>
                <dd className="font-medium text-[#f4ede0]">{about.editora_responsavel}</dd>
              </div>
            )}
            {about.linguagem && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#8f9bb5]">Linguagem</dt>
                <dd className="font-medium text-[#f4ede0]">{about.linguagem}</dd>
              </div>
            )}
            {about.generos && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#8f9bb5]">Gêneros</dt>
                <dd className="font-medium text-[#f4ede0]">{about.generos}</dd>
              </div>
            )}
            {about.periodicidade && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#8f9bb5]">Periodicidade</dt>
                <dd className="font-medium text-[#f4ede0]">{about.periodicidade}</dd>
              </div>
            )}
          </dl>

          {about.contato_extra && (
            <div className="pt-2 text-xs text-[#9cabca]">
              <p>{about.contato_extra}</p>
            </div>
          )}
        </motion.aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3b0c9]">
          linha editorial
        </h2>
        {about.linha_editorial_1 && (
          <p className="max-w-3xl text-sm leading-relaxed text-[#b5bfd4]">
            {about.linha_editorial_1}
          </p>
        )}
        {about.linha_editorial_2 && (
          <p className="max-w-3xl text-sm leading-relaxed text-[#b5bfd4]">
            {about.linha_editorial_2}
          </p>
        )}
      </section>

      {(about.inspiracao_musica || about.inspiracao_livros || about.inspiracao_filmes) && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3b0c9]">
            inspirações
          </h2>
          <p className="max-w-3xl text-sm text-[#9cabca]">
            Músicas que inspiram, livros e filmes.
          </p>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {about.inspiracao_musica && (
              <div className="card-surface space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3b0c9]">
                  Música
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#b5bfd4]">
                  {about.inspiracao_musica}
                </p>
              </div>
            )}
            {about.inspiracao_livros && (
              <div className="card-surface space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3b0c9]">
                  Livros
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#b5bfd4]">
                  {about.inspiracao_livros}
                </p>
              </div>
            )}
            {about.inspiracao_filmes && (
              <div className="card-surface space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3b0c9]">
                  Filmes
                </h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#b5bfd4]">
                  {about.inspiracao_filmes}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
