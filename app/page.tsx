import Link from "next/link";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import TopNav from "./components/TopNav";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-sky-950 via-slate-950 to-orange-950 text-white">
      <TopNav />

      {/* Video hero + carousel in one component */}
      <HeroSection />

      {/* ── ABOUT ── */}
      <section id="about" className="bg-slate-950/95 text-white px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Text */}
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-gold">
              <span className="block h-px w-5 bg-gold" />
              Sobre o portal
            </p>
            <h2 className="font-serif text-4xl font-bold leading-snug text-navy sm:text-5xl">
              Uma experiência para toda a igreja
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600">
              Um portal com navegação simples, conteúdo destacado e áreas
              personalizadas para cada membro — tudo com foco em clareza,
              modernidade e conexão com Hebrom III.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { icon: "📡", title: "Notícias em tempo real", body: "Fique por dentro de tudo que acontece na igreja instantaneamente." },
                { icon: "🤝", title: "Projetos sociais", body: "Acompanhe as ações de servir à comunidade ao redor." },
                { icon: "📅", title: "Agenda de eventos", body: "Todos os cultos e encontros organizados num só lugar." },
                { icon: "🔐", title: "Área do membro", body: "Acesso exclusivo para membros e administradores." },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-lg border border-navy/10 bg-white p-5 transition hover:border-gold/50"
                >
                  <span className="mb-3 block text-xl">{icon}</span>
                  <h3 className="mb-1.5 text-sm font-semibold text-navy">{title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg bg-navy">
              <span className="font-serif text-8xl font-bold text-gold/20">H3</span>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-lg bg-gold p-5 text-center text-navy shadow-xl">
              <p className="font-serif text-3xl font-bold leading-none">15+</p>
              <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-widest">
                Anos de fé
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section id="news" className="border-t border-sky-400/10 bg-slate-950/95 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-gold">
                <span className="block h-px w-5 bg-gold" />
                Notícias
              </p>
              <h2 className="font-serif text-3xl font-medium text-white sm:text-4xl">
                Destaques recentes
              </h2>
            </div>
            <Link
              href="#"
              className="hidden rounded border border-gold/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-gold-light transition hover:border-gold hover:bg-gold/10 sm:inline-flex"
            >
              Ver todas
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr]">
            {/* Featured */}
            <article className="group overflow-hidden rounded-3xl border border-white/10 bg-blue-950/90 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-blue-400/40 cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden bg-blue-950/10">
                <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_45%),linear-gradient(to_bottom,_rgba(15,23,42,0),_rgba(15,23,42,0.75))]" />
              </div>
              <div className="p-6">
                <span className="inline-block rounded-full bg-blue-500/15 px-3 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] text-sky-200 mb-4">
                  Culto
                </span>
                <h3 className="font-serif text-xl font-medium leading-snug text-white mb-2">
                  Culto de celebração com mensagem especial
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Mensagens inspiradoras, música e comunhão a cada semana na nossa comunidade.
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-blue-400/10 pt-4">
                  <span className="text-xs text-slate-400">16 Maio 2026</span>
                  <span className="text-sm text-sky-200">→</span>
                </div>
              </div>
            </article>

            {/* Secondary cards */}
            {[
              {
                tag: "Ação Social",
                tagClass: "bg-red-900/25 text-red-300",
                title: "Projeto social na comunidade",
                body: "Apoio à comunidade e evangelismo em ações de serviço.",
                date: "14 Maio 2026",
              },
              {
                tag: "Evento",
                tagClass: "bg-blue-900/25 text-blue-300",
                title: "Semana da família — Inscrições abertas",
                body: "Encontros, oficinas e atividades para todas as idades.",
                date: "25 Maio 2026",
              },
            ].map(({ tag, tagClass, title, body, date }) => (
              <article
                key={tag}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 transition hover:-translate-y-1 hover:border-sky-300/30 cursor-pointer"
              >
                <div className="aspect-video bg-gold/5 flex items-center justify-center text-gold/20">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                </div>
                <div className="p-5">
                  <span className={`inline-block rounded-full px-3 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] mb-3 ${tagClass}`}>
                    {tag}
                  </span>
                  <h3 className="font-serif text-base font-medium leading-snug text-white mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{body}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-gold/15 pt-4">
                    <span className="text-xs text-slate-500">{date}</span>
                    <span className="text-sm text-gold">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" className="bg-slate-950/95 px-6 py-24 sm:px-10">
        <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-2">

          {/* Events list */}
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-gold">
              <span className="block h-px w-5 bg-gold" />
              Agenda
            </p>
            <h2 className="mb-3 font-serif text-4xl font-bold leading-snug text-navy">
              Próximos eventos
            </h2>
            <p className="mb-10 max-w-sm text-sm leading-relaxed text-slate-500">
              Saiba quando serão os próximos encontros, cultos especiais e ações
              da comunidade Hebrom III.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { day: "16", month: "Mai", title: "Culto de louvor", body: "Ministração especial de música e palavra de fé com convidados.", time: "Templo principal — 18h00" },
                { day: "25", month: "Mai", title: "Ação social", body: "Compromisso com a comunidade e cuidado com quem mais precisa.", time: "Sede central — 09h00" },
                { day: "07", month: "Jun", title: "Semana da família", body: "Uma semana de encontros, reflexão e celebração em família.", time: "Complexo Hebrom — o dia todo" },
              ].map(({ day, month, title, body, time }) => (
                <div
                  key={title}
                  className="flex gap-5 rounded-3xl border border-white/10 bg-slate-900/95 p-5 transition hover:border-sky-300/30 hover:translate-x-1 cursor-pointer"
                >
                  <div className="flex min-w-[52px] flex-col items-center justify-center rounded-2xl bg-blue-950/90 p-2 text-center">
                    <span className="font-serif text-2xl font-bold leading-none text-gold-light">{day}</span>
                    <span className="mt-0.5 text-[0.58rem] uppercase tracking-widest text-white/40">{month}</span>
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold text-navy">{title}</h3>
                    <p className="mb-2 text-xs leading-relaxed text-slate-500">{body}</p>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-gold">📍 {time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter box */}
          <div className="rounded-3xl bg-blue-950/95 p-8 text-white lg:sticky lg:top-24">
            <p className="mb-4 text-[0.67rem] font-medium uppercase tracking-[0.22em] text-gold">Newsletter</p>
            <h3 className="mb-3 font-serif text-2xl font-medium">Fique por dentro dos eventos</h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Receba alertas de cultos especiais, eventos e novidades diretamente no seu e-mail.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Seu nome"
                className="rounded bg-white/5 border border-gold/20 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 transition focus:border-gold"
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                className="rounded bg-white/5 border border-gold/20 px-4 py-3 text-sm text-white outline-none placeholder-slate-500 transition focus:border-gold"
              />
              <button
                type="button"
                className="mt-1 rounded bg-gold py-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy transition hover:bg-gold-light"
              >
                Assinar newsletter
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}