import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#9cabca]">
        página não encontrada
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-[#f8f0e2]">
        Parece que este corredor termina em neblina.
      </h1>
      <p className="text-sm text-[#b4bfd6]">
        O endereço que você tentou acessar não existe mais ou nunca foi publicado. Talvez o texto
        esteja como rascunho no painel da autora.
      </p>
      <div className="flex items-center justify-center gap-3 text-xs text-[#9cabca]">
        <Link
          to="/"
          className="mysterious-pill rounded-full px-4 py-2.5 font-semibold uppercase tracking-[0.2em] text-[#0b1020]"
        >
          Voltar ao início
        </Link>
        <Link
          to="/categoria/contos"
          className="rounded-full border border-slate-600/70 px-4 py-2.5 font-medium tracking-wide text-[#d4deef] hover:border-[#baa78c91]"
        >
          Explorar contos
        </Link>
      </div>
    </div>
  )
}

