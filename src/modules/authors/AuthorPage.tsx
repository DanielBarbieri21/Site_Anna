import { useParams } from 'react-router-dom'

export function AuthorPage() {
  const { id } = useParams()

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
      <section className="card-surface space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border border-slate-600/70 bg-[#131d31]" />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9cabca]">
              autora
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#f8efe1]">
              Anna (perfil #{id})
            </h1>
            <p className="mt-1 text-sm text-[#b3bed7]">
              Breve biografia da autora, com interesses literários, temas
              preferidos e um pouco da sua história com a escrita.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9cabca]">
            sobre
          </h2>
          <p className="text-sm text-[#b3bed7]">
            Este espaço será preenchido com a bio vinda da tabela{' '}
            <code>users</code> do Supabase, incluindo foto de perfil, redes
            sociais e outras informações relevantes.
          </p>
        </div>
      </section>

      <section className="card-surface space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9cabca]">
          textos publicados
        </h2>
        <div className="space-y-3 text-sm text-[#b3bed7]">
          <p>
            Aqui listaremos os posts associados a <code>autor_id</code> no
            Supabase, permitindo filtrar por contos, poesias, crônicas e outros
            formatos.
          </p>
        </div>
      </section>
    </div>
  )
}

