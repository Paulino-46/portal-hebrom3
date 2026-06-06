import Link from "next/link";
import { getLatestNews } from "../../services/news";

export default async function NewsPage() {
  const newsItems = await getLatestNews();

  return (
    <main className="bg-slate-950 text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="mb-12 grid gap-6 rounded-[32px] border border-white/10 bg-slate-900/85 p-10 shadow-2xl shadow-slate-950/40 md:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-200">
              <span className="block h-1.5 w-1.5 rounded-full bg-sky-300" />
              Notícias oficiais
            </span>
            <div className="space-y-4">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Notícias em cards com imagem à esquerda e conteúdo à direita
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Um formato editorial moderno que destaca as imagens do carrossel e apresenta cada publicação com clareza e autoridade.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total de notícias</p>
                <p className="mt-3 text-3xl font-semibold text-white">{newsItems.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Design</p>
                <p className="mt-3 text-3xl font-semibold text-white">Editorial</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Imagens</p>
                <p className="mt-3 text-3xl font-semibold text-white">Carrossel</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-800 bg-slate-950/90 p-8 shadow-xl shadow-slate-950/20">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Visão geral</p>
              <h2 className="text-2xl font-semibold text-white">Painel de notícias</h2>
              <p className="text-sm leading-6 text-slate-300">
                Cada card organiza a imagem do carrossel no lado esquerdo e os detalhes da notícia no lado direito, garantindo uma leitura rápida e um visual sofisticado.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-800/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-700"
            >
              Voltar para a home
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {newsItems.map((news) => (
            <article
              key={news.id}
              className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/95 shadow-2xl shadow-slate-950/30 transition duration-300 hover:-translate-y-1 hover:border-sky-300/20 lg:grid lg:grid-cols-[360px_minmax(0,1fr)]"
            >
              <div className="relative min-h-[260px] overflow-hidden bg-slate-900 lg:min-h-full">
                <img
                  src={news.image}
                  alt={news.title}
                  className="h-full w-full object-cover object-center transition duration-500 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <span>{new Date(news.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-600" />
                  <span>Notícia</span>
                </div>
                <h2 className="mt-6 text-3xl font-semibold text-white">{news.title}</h2>
                <p className="mt-5 text-sm leading-7 text-slate-300">{news.summary}</p>
                <div className="mt-8 flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Autor</p>
                    <p className="mt-1 text-sm font-semibold text-white">{news.author}</p>
                  </div>
                  <button className="rounded-full bg-slate-900/90 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-100 transition hover:bg-slate-800">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
