import { motion } from 'framer-motion'

export function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-10 lg:grid-cols-[1.7fr,1fr]">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#a3b0c9]">
            sobre a editora
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#f7f1e7] sm:text-4xl">
            Um selo artesanal para textos com névoa, silêncio e delicadeza.
          </h1>
          <p className="text-sm leading-relaxed text-[#b5bfd4]">
            O projeto <span className="font-semibold text-[#f7f1e7]">Contos de Anna</span> nasce
            como um espaço editorial intimista para contos, crônicas e poesias. A proposta é
            oferecer uma leitura confortável, com visual noturno, tipografia cuidadosa e um fluxo de
            publicação simples para a autora.
          </p>
          <p className="text-sm leading-relaxed text-[#b5bfd4]">
            Aqui, cada texto passa por uma curadoria afetiva: revisão, escolha de título,
            categorização por atmosfera literária e estimativa de tempo de leitura. O objetivo é que
            quem chega até aqui se sinta entrando em um pequeno selo literário digital.
          </p>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card-surface space-y-4"
        >
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3b0c9]">
            ficha da editora
          </h2>
          <dl className="space-y-2 text-sm text-[#c0c9dd]">
            <div className="flex justify-between gap-4">
              <dt className="text-[#8f9bb5]">Editora responsável</dt>
              <dd className="font-medium text-[#f4ede0]">Anna (autora)</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#8f9bb5]">Linguagem</dt>
              <dd className="font-medium text-[#f4ede0]">Português (Brasil)</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#8f9bb5]">Gêneros</dt>
              <dd className="font-medium text-[#f4ede0]">
                Contos, crônicas, poesias, microcontos
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#8f9bb5]">Periodicidade</dt>
              <dd className="font-medium text-[#f4ede0]">Publicações sazonais, por inspiração</dd>
            </div>
          </dl>

          <div className="pt-2 text-xs text-[#9cabca]">
            <p>
              Para falar sobre propostas editoriais, convites ou parcerias, utilize o contato
              destacado nos perfis oficiais da autora.
            </p>
          </div>
        </motion.aside>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3b0c9]">
          linha editorial
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-[#b5bfd4]">
          Os textos publicados aqui priorizam atmosferas introspectivas, um certo tom de melancolia
          luminosa e um cuidado especial com ritmo e imagem. Nem todos os textos serão longos; às
          vezes, uma única cena basta para acender algo em quem lê.
        </p>
        <p className="max-w-3xl text-sm leading-relaxed text-[#b5bfd4]">
          Este site funciona como um caderno público: organizado como um pequeno CMS literário,
          onde a autora pode criar, editar e publicar com poucos cliques, tendo o Supabase como
          base de dados e autenticação para manter tudo seguro.
        </p>
      </section>
    </div>
  )
}

