import Link from "next/link";
import { NEWS_ITEMS } from "../../lib/sliderData";

export default function NewsPage() {
  return (
    <main className="bg-slate-950 text-white px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-6 rounded-[32px] border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
              Notícias em destaque
            </p>
            <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
              As últimas histórias da comunidade Hebrom III
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300">
              Esta página reúne as principais notícias com imagens reais do nosso carrossel, para você navegar de forma mais visual, clara e profissional.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-sky-200 transition hover:border-sky-300 hover:bg-sky-300/15"
            >
              Voltar para a home
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {NEWS_ITEMS.map((news) => (
            <article
              key={news.id}
              className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20"
            >
              <div className="relative h-72 overflow-hidden bg-slate-800">
                <img
                  src={news.image}
                  alt={news.title}
                  className="h-full w-full object-cover object-center transition duration-500 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute left-6 bottom-6 right-6 rounded-3xl bg-slate-950/70 px-5 py-4 backdrop-blur-sm">
                  <span className="inline-flex rounded-full bg-sky-300/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky-200">
                    {news.tag}
                  </span>
                  <p className="mt-3 text-sm text-slate-200">{news.summary}</p>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <span>{news.date}</span>
                  <span>Notícia Hebrom III</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-white">
                  {news.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {news.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
