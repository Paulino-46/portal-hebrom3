import Link from "next/link";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import TopNav from "../components/TopNav";
import { getLatestNews } from "../services/news";
import { getLatestEvents } from "../services/events";
import { SLIDES } from "../lib/sliderData";

export default async function Home() {
  // Busca dados dinâmicos do banco
  const newsFromDb = await getLatestNews();
  const eventsFromDb = await getLatestEvents();

  // Formata as notícias do banco para o formato do slider
  const dynamicNews = newsFromDb.map((item: any) => ({
    id: `db-news-${item.id || item._id}`,
    src: item.image || "/img/istockphoto-1144570336-1024x1024.jpg",
    tag: "Notícia",
    title: item.title,
    desc: item.author || "Equipe Hebrom",
    summary: item.summary,
    date: item.createdAt,
    href: "/news",
  }));

  // Formata os eventos do banco para o formato do slider
  const dynamicEvents = eventsFromDb.map((item: any) => ({
    id: `db-event-${item.id || item._id}`,
    src: item.image || "/img/istockphoto-1144570336-1024x1024.jpg",
    tag: "Evento",
    title: item.title,
    desc: item.location || "",
    summary: item.description,
    date: item.date,
    href: "/events",
  }));

  const carouselNews = dynamicNews.length > 0
    ? dynamicNews
    : SLIDES.map((s) => ({ ...s, id: `static-${s.id}` }));

  const carouselItems = [
    ...carouselNews,
    ...dynamicEvents,
  ];

  return (
    <main className="bg-gradient-to-br from-sky-950 via-slate-950 to-orange-950 text-white">
      <TopNav />

      {/* Video hero + carousel in one component */}
      <HeroSection items={carouselItems} />

      {/* ── ABOUT ── */}
      <section id="about" className="bg-slate-950/95 text-white px-6 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-gold">
              <span className="block h-px w-5 bg-gold" />
              Sobre o portal 
            </p>
            <h2 className="text-4xl font-bold leading-snug text-navy sm:text-5xl">
              O portal da comunidade do Distrito de Hebrom 
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-400">
              Um espaço pensado para fortalecer a união entre membros, partilhar notícias,
              divulgar eventos e lembrar a história da Igreja Adventista do Sétimo Dia.
              Fé, serviço e informação juntos numa experiência acolhedora para toda a igreja.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: "📖",
                title: "História da Igreja Adventista",
                body: "Do movimento do século XIX até a presença atual em nossa comunidade, essa história sustenta nossa fé e compromisso em Hebrom III.",
                points: [
                  "A mensagem adventista valoriza o sábado, a saúde e o serviço ao próximo.",
                  "Essa herança inspira culto, educação e apoio comunitário entre os irmãos.",
                ],
                accent: "from-sky-500/25 via-blue-500/15 to-slate-950/0",
              },
              {
                icon: "🏛️",
                title: "História de Hebrom III",
                body: "Nossa igreja evoluiu no calor da união, do culto e do serviço social, transformando vidas com amor e presença constante.",
                points: [
                  "Hebrom III nasceu do desejo de servir e acolher cada família da região.",
                  "Cultos, estudos bíblicos e ações sociais marcaram nosso crescimento.",
                ],
                accent: "from-red-500/25 via-rose-500/15 to-slate-950/0",
              },
              {
                icon: "🌟",
                title: "Missão, Valor e Visão",
                body: "Servir com amor e respeito, valorizar a família e anunciar a esperança, com foco em ação social e transformação espiritual.",
                points: [
                  "Missão: levar a palavra e o cuidado cristão a todos que precisam.",
                  "Valor: fé, família, compaixão e integridade em cada atividade.",
                ],
                accent: "from-yellow-300/30 via-orange-400/20 to-orange-950/0",
              },
            ].map(({ icon, title, body, points, accent }, idx) => (
              <article
                key={`about-card-${idx}`}
                className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-gold/40 min-h-[26rem]"
              >
                <div className={`pointer-events-none absolute inset-x-8 top-8 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/80 text-3xl text-white shadow-inner shadow-slate-900/40">
                    {icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold text-white">{title}</h3>
                  <p className="text-base leading-relaxed text-slate-300">{body}</p>

                  <ul className="mt-6 space-y-3 text-sm text-slate-400">
                    {points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-white/80" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href="/sobre"
                    className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
                  >
                    Mais detalhes
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section id="news" className="border-t border-sky-400/10 bg-slate-950/95 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-gold">
                <span className="block h-px w-5 bg-gold" />
                Notícias
            </p>
              <h2 className="text-3xl font-medium text-white sm:text-4xl">
                Destaques recentes
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden rounded border border-gold/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-gold-light transition hover:border-gold hover:bg-gold/10 sm:inline-flex"
            >
              Ver todas
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-blue-950/90 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-blue-400/40 cursor-pointer">
              <div className="relative overflow-hidden bg-slate-900/60">
                <img
                  src={dynamicNews[0]?.src || "/img/istockphoto-1144570336-1024x1024.jpg"}
                  alt={dynamicNews[0]?.title || "Notícia em destaque"}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" />
                <div className="absolute left-6 bottom-6 right-6">
                  <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] text-sky-200">
                    {dynamicNews[0]?.tag || "Notícia"}
                  </span>
                  <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                    {dynamicNews[0]?.title || "Veja as últimas notícias da comunidade"}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                    {dynamicNews[0]?.summary || "As principais notícias em destaque para você acompanhar o que acontece na Hebrom III."}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-slate-300">
                    <span>{dynamicNews[0]?.desc || "Equipe Hebrom"}</span>
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span>
                      {dynamicNews[0]?.date
                        ? new Date(dynamicNews[0].date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Data não disponível"}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-5">
              {dynamicNews.slice(1, 4).map((item, idx) => (
                <article
                  key={`news-card-${idx}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/95 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-sky-300/30 cursor-pointer"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-800">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="mb-3 inline-flex rounded-full bg-slate-700/70 px-3 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] text-slate-200">
                      {item.tag}
                    </span>
                    <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.summary}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-700/80 pt-4 text-xs text-slate-400">
                      <span>{item.desc || "Equipe Hebrom"}</span>
                      <span>
                        {item.date
                          ? new Date(item.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
            <h2 className="mb-3 text-4xl font-bold leading-snug text-navy">
              Próximos eventos
            </h2>
            <p className="mb-10 max-w-sm text-sm leading-relaxed text-slate-500">
              Saiba quando serão os próximos encontros, cultos especiais e ações
              da comunidade Hebrom III.
            </p>

            <div className="flex flex-col gap-3">
              {dynamicEvents.slice(0, 3).map((event: any) => {
                return (
                <Link
                  href={event.href}
                  key={event.id}
                  className="flex gap-5 rounded-3xl border border-white/10 bg-slate-900/95 p-5 transition hover:border-sky-300/30 hover:translate-x-1 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={event.src || "/img/istockphoto-1144570336-1024x1024.jpg"} // Use event.src para a imagem
                      alt={event.title}
                      className="h-14 w-14 rounded-xl object-cover" // Ajuste o tamanho e estilo conforme necessário
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-sm font-semibold text-navy truncate">{event.title}</h3>
                    <p className="mb-2 text-xs leading-relaxed text-slate-500 line-clamp-2">{event.summary}</p>
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-gold truncate">📍 {event.desc}</p>
                  </div>
                </Link>
                );
              })}

              <Link href="/events" className="mt-4 text-center text-xs font-medium uppercase tracking-widest text-gold hover:text-gold-light transition-colors">
                Ver toda a agenda →
              </Link>
            </div>
          </div>

          {/* Newsletter box */}
          <div className="rounded-3xl bg-blue-950/95 p-8 text-white lg:sticky lg:top-24">
            <p className="mb-4 text-[0.67rem] font-medium uppercase tracking-[0.22em] text-gold">Newsletter</p>
            <h3 className="mb-3 text-2xl font-medium">Fique por dentro dos eventos</h3>
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
                className="mt-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 py-4 text-xs font-bold uppercase tracking-[0.2em] text-navy shadow-lg shadow-gold/20 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
              >
                ASSINAR Newsletter
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}