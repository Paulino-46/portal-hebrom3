import Link from "next/link";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import NewsletterForm from "../components/NewsletterForm";
import TopNav from "../components/TopNav";
import { getLatestNews } from "../services/news";
import { getLatestEvents } from "../services/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const newsFromDb = await getLatestNews();
  const eventsFromDb = await getLatestEvents();

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

  const carouselItems = [...dynamicNews, ...dynamicEvents];

  return (
    <main className="bg-gradient-to-br from-sky-950 via-slate-950 to-orange-950 text-white">
      <TopNav />

      {/* Video hero + carousel */}
      <HeroSection items={carouselItems} />

      {/* ── ABOUT ── */}
      <section
        id="about"
        className="bg-slate-950/95 px-4 py-14 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-16 max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold sm:text-xs">
              <span className="block h-px w-5 bg-gold" />
              Sobre o portal
            </p>
            <h2 className="text-[2rem] font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              O portal da comunidade do Distrito de Hebrom
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
              Um espaço pensado para fortalecer a união entre membros, partilhar
              notícias, divulgar eventos e lembrar a história da Igreja Adventista
              do Sétimo Dia. Fé, serviço e informação juntos numa experiência
              acolhedora para toda a igreja.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-gold/40 sm:rounded-[2.25rem] sm:p-8 flex flex-col"
              >
                <div
                  className={`pointer-events-none absolute inset-x-6 top-6 h-1.5 rounded-full bg-gradient-to-r ${accent} sm:inset-x-8 sm:top-8`}
                />
                <div className="relative flex-1">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/80 text-2xl text-white shadow-inner shadow-slate-900/40 sm:mb-6 sm:h-14 sm:w-14 sm:rounded-3xl sm:text-3xl">
                    {icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                    {body}
                  </p>

                  <ul className="mt-5 space-y-3 text-sm text-slate-400 sm:mt-6">
                    {points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start gap-3">
                        <span className="mt-1.5 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-white/80" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 sm:mt-8">
                  <Link
                    href="/sobre"
                    className="inline-flex rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light sm:px-6 sm:py-3 sm:text-sm"
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
      <section
        id="news"
        className="border-t border-sky-400/10 bg-slate-950/95 px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:mb-12">
            <div className="max-w-xl">
              <p className="mb-3 flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold sm:text-xs">
                <span className="block h-px w-5 bg-gold" />
                Notícias
              </p>
              <h2 className="text-[2rem] font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Destaques Recentes
              </h2>
            </div>
            <Link
              href="/news"
              className="self-start rounded border border-gold/30 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-gold-light transition hover:border-gold hover:bg-gold/10 sm:self-auto sm:inline-flex sm:px-5 sm:py-2.5 sm:text-xs"
            >
              Ver todas
            </Link>
          </div>

          {/* Featured news */}
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
            <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-blue-950/90 shadow-2xl shadow-slate-950/30 transition hover:-translate-y-1 hover:border-blue-400/40 cursor-pointer sm:rounded-[2rem]">
              <div className="relative overflow-hidden bg-slate-900/60">
                <img
                  src={
                    dynamicNews[0]?.src ||
                    "/img/placeholder-news.jpg"
                  }
                  alt={dynamicNews[0]?.title || "Notícia em destaque"}
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-64 lg:h-72"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent" />
                <div className="absolute left-5 bottom-5 right-5 sm:left-6 sm:bottom-6 sm:right-6">
                  <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-sky-200">
                    {dynamicNews[0]?.tag || "Notícia"}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-white sm:mt-4 sm:text-2xl lg:text-3xl xl:text-4xl">
                    {dynamicNews[0]?.title ||
                      "Veja as últimas notícias da comunidade"}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200 line-clamp-3 sm:line-clamp-none sm:mt-4 sm:max-w-2xl sm:text-base">
                    {dynamicNews[0]?.summary ||
                      "As principais notícias em destaque para você acompanhar o que acontece na Hebrom III."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[0.6rem] uppercase tracking-[0.16em] text-slate-300 sm:mt-6 sm:gap-3 sm:text-xs">
                    <span>{dynamicNews[0]?.desc || "Equipe Hebrom"}</span>
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <span>
                      {dynamicNews[0]?.date
                        ? new Date(dynamicNews[0].date).toLocaleDateString(
                            "pt-BR",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "Data não disponível"}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Secondary news cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              {dynamicNews.slice(1, 4).map((item, idx) => (
                <article
                  key={`news-card-${idx}`}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/95 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-sky-300/30 cursor-pointer sm:rounded-[1.75rem]"
                >
                  <div className="relative h-36 overflow-hidden bg-slate-800 sm:h-40 lg:h-44">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  </div>
                  <div className="p-4 sm:p-5 lg:p-6">
                    <span className="mb-2 inline-flex rounded-full bg-slate-700/70 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-slate-200 sm:mb-3">
                      {item.tag}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-white sm:text-base lg:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2 sm:mt-3 sm:text-sm">
                      {item.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-slate-700/80 pt-3 text-[0.65rem] text-slate-400 sm:text-xs">
                      <span className="truncate pr-2">{item.desc || "Equipe Hebrom"}</span>
                      <span className="flex-shrink-0">
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
      <section
        id="events"
        className="bg-slate-950/95 px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:items-start lg:gap-16">

            {/* Events list */}
            <div>
              <p className="mb-4 flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold sm:mb-5 sm:text-xs">
                <span className="block h-px w-5 bg-gold" />
                Agenda
              </p>
              <h2 className="mb-3 text-[2rem] font-bold leading-tight text-white sm:text-4xl">
                Próximos eventos
              </h2>
              <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-400 sm:mb-10">
                Saiba quando serão os próximos encontros, cultos especiais e
                ações da comunidade Hebrom III.
              </p>

              <div className="flex flex-col gap-3">
                {dynamicEvents.slice(0, 3).map((event: any) => (
                  <Link
                    href={event.href}
                    key={event.id}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/95 p-4 transition hover:border-sky-300/30 hover:translate-x-1 cursor-pointer sm:gap-5 sm:rounded-3xl sm:p-5"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={
                          event.src || "/img/placeholder-event.jpg"
                        }
                        alt={event.title}
                        className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 text-sm font-semibold text-white truncate">
                        {event.title}
                      </h3>
                      <p className="mb-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                        {event.summary}
                      </p>
                      <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-gold truncate sm:text-[0.65rem]">
                        📍 {event.desc}
                      </p>
                    </div>
                  </Link>
                ))}

                <Link
                  href="/events"
                  className="mt-3 text-center text-xs font-medium uppercase tracking-widest text-gold hover:text-gold-light transition-colors sm:mt-4"
                >
                  Ver toda a agenda →
                </Link>
              </div>
            </div>

            {/* Newsletter box */}
            <div className="rounded-2xl bg-blue-950/95 p-6 text-white sm:rounded-3xl sm:p-8 lg:sticky lg:top-24">
              <p className="mb-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold sm:mb-4">
                Newsletter
              </p>
              <h3 className="mb-2 text-xl font-medium sm:mb-3 sm:text-2xl">
                Fique por dentro dos eventos
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-slate-400 sm:mb-6">
                Receba alertas de cultos especiais, eventos e novidades
                diretamente no seu e-mail.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}