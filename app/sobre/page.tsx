import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <header className="mb-14 rounded-[2rem] border border-white/10 bg-slate-900/95 p-12 shadow-2xl shadow-slate-950/40 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-gold">Sobre o portal</p>
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            O portal da comunidade Hebrom III
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300">
            Um espaço pensado para fortalecer a união entre membros, partilhar notícias, divulgar eventos e lembrar a história da Igreja Adventista do Sétimo Dia. Fé, serviço e informação juntos numa experiência acolhedora para toda a igreja.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/10 text-2xl text-sky-300">
                  📖
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-sky-300">História da Igreja Adventista</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">Raízes de fé e serviço</h2>
                </div>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-slate-300">
                A Igreja Adventista do Sétimo Dia nasceu durante um movimento espiritual no século XIX. A partir do chamado
                por uma vida íntegra, marcada pela guarda do sábado e pelo cuidado com a saúde, o adventismo se consolidou como
                uma tradição de fé que valoriza o serviço ao próximo.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                Até hoje, essa herança é referência em educação, ação social e missão global. Em Hebrom III, trazemos para a
                nossa realidade local os princípios de esperança, renovação e amor prático.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Pilares centrais</p>
                  <p className="mt-2">Sábado, saúde, educação e serviço ao próximo.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Legado inspirador</p>
                  <p className="mt-2">Uma fé prática que busca transformar vidas dentro e fora da igreja.</p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-red-500/10 text-2xl text-rose-300">
                  🏛️
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-rose-300">História de Hebrom III</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">A trajetória da nossa comunidade</h2>
                </div>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-slate-300">
                Hebrom III nasceu do desejo de construir um espaço de adoração e apoio mútuo. Com cultos dedicados, encontros familiares
                e projetos sociais, nossa igreja cresceu como um ponto de referência para quem busca fé, esperança e comunhão.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-slate-300">
                Hoje, somos uma comunidade que celebra a vida em Cristo, investindo na formação espiritual e no cuidado com as famílias
                da região. Nosso trabalho reflete o compromisso de reunir pessoas em torno dos mesmos valores cristãos.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Crescimento local</p>
                  <p className="mt-2">Uma presença constante com atividades para todas as idades.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Cultura de apoio</p>
                  <p className="mt-2">Cultos, estudos e ações que fortalecem a convivência fraterna.</p>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-8">
            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
              <div className="mb-6 flex items-center gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-500/10 text-2xl text-orange-300">
                  🌟
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-amber-300">Missão, Valor e Visão</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white">O que guia nosso trabalho</h2>
                </div>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-slate-300">
                Nossa missão é levar esperança e serviço à comunidade com postura cristã. Valorizamos a família,
                a integridade e a solidariedade, mantendo o foco em ações que impactam vidas.
              </p>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="font-semibold text-white">Missão</p>
                  <p className="mt-2">Oferecer acolhimento espiritual, apoio social e crescimento pessoal para todas as famílias.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="font-semibold text-white">Valores</p>
                  <p className="mt-2">Fé, amor, compaixão, unidade e dedicação ao próximo como base de todas as atividades.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5">
                  <p className="font-semibold text-white">Visão</p>
                  <p className="mt-2">Ser uma comunidade reconhecida pela transformação, acolhimento e impacto positivo na região.</p>
                </div>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/30">
              <p className="mb-4 text-sm uppercase tracking-[0.22em] text-gold">Destaques</p>
              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Presença comunitária</p>
                  <p className="mt-2">Cultos semanais, estudo bíblico, ação social e encontros de famílias em ambiente acolhedor.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Compromisso social</p>
                  <p className="mt-2">Investimos em iniciativas que ajudam a região e fortalecem a dignidade humana.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Espaço para todos</p>
                  <p className="mt-2">Uma comunidade onde jovens, adultos e idosos encontram apoio para crescer na fé.</p>
                </div>
              </div>
            </article>
          </aside>
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 text-center shadow-2xl shadow-slate-950/30">
          <h2 className="mb-4 text-3xl font-semibold text-white">Transformando esperança em ação</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300">
            Nossa visão para o futuro é ser uma igreja reconhecida pela clareza de propósito e pelo impacto positivo.
            Aqui, cada atividade é pensada para fortalecer a fé, apoiar famílias e fazer a diferença de forma duradoura.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/15"
          >
            Voltar para o início
          </Link>
        </div>
      </section>
    </main>
  );
}
