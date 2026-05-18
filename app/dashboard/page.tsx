import { getLatestNews } from "../../lib/news";

interface DashboardPageProps {
  searchParams?: { role?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const role = searchParams?.role === "admin" ? "admin" : "user";
  const news = await getLatestNews();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Dashboard</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">Painel {role === "admin" ? "do Administrador" : "do Usuário"}</h1>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              Tipo de acesso: <strong>{role}</strong>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-3xl bg-emerald-50 p-6">
              <p className="text-sm font-semibold text-emerald-700">Notícias</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{news.length}</p>
            </div>
            <div className="rounded-3xl bg-sky-50 p-6">
              <p className="text-sm font-semibold text-sky-700">Acesso</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{role === "admin" ? "Administrador" : "Leitor"}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-6">
              <p className="text-sm font-semibold text-slate-700">Base</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">MongoDB</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Notícias recentes</h2>
              <p className="mt-2 text-slate-600">As últimas publicações disponíveis no portal.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {news.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{item.author}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.summary}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
