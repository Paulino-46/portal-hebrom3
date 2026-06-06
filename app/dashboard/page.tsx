import { getLatestNews } from "../../services/news";
import Link from "next/link";

interface DashboardPageProps {
  searchParams?: { role?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const role = searchParams?.role === "admin" ? "admin" : "user";
  const news = await getLatestNews();

  const sidebarItems = [
    { href: "/dashboard", label: "Visão Geral", active: true },
    { href: "/dashboard/news", label: "Notícias" },
    { href: "/dashboard/events", label: "Eventos" },
    { href: "/dashboard", label: "Estatísticas" },
    { href: "/dashboard", label: "Configurações" },
  ];

  const metrics = [
    { label: "Notícias", value: news.length.toString(), color: "blue" },
    { label: "Acessos", value: "1.2K", color: "red" },
    { label: "Engajamento", value: "82%", color: "orange" },
    { label: "Membros", value: "1.8K", color: "yellow" },
    { label: "Eventos", value: "8", color: "blue" },
  ];

  const visitors = [
    { day: "Seg", value: 62 },
    { day: "Ter", value: 95 },
    { day: "Qua", value: 78 },
    { day: "Qui", value: 59 },
    { day: "Sex", value: 92 },
    { day: "Sáb", value: 110 },
    { day: "Dom", value: 72 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 px-5 py-6 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-950/50">
            H3
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Portal Hebrom</p>
            <p className="text-lg font-bold text-white">Painel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.label} href={item.href} label={item.label} active={item.active} />
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-slate-950/40">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Relatório Rápido</p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 shadow-sm">
              <span className="text-sm font-medium text-slate-300">Atividade da semana</span>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-blue-300">+18%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 shadow-sm">
              <span className="text-sm font-medium text-slate-300">Novos membros</span>
              <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-yellow-300">+42</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-6 py-6 shadow-sm shadow-slate-950/10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Painel administrativo</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Olá, {role === "admin" ? "Administrador" : "Membro"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Acompanhe as principais métricas, estatísticas e as notícias mais recentes em tempo real.</p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className="relative w-full max-w-sm">
              <input
                type="search"
                placeholder="Buscar no painel..."
                className="h-12 w-full rounded-full border border-slate-800 bg-slate-900 px-4 pr-12 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            </div>
            <button className="inline-flex h-12 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:opacity-95">
              Relatórios
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="grid gap-6 xl:grid-cols-[1.8fr_1.2fr]">
            <section className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {metrics.map((metric) => (
                  <StatCard key={metric.label} title={metric.label} value={metric.value} color={metric.color as any} />
                ))}
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Visitas semanais</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Tendência de engajamento</h2>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Últimos 7 dias
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-end gap-4">
                    {visitors.map((item) => (
                      <div key={item.day} className="flex-1 text-center">
                        <div className="mx-auto flex h-40 w-12 items-end justify-center rounded-3xl bg-slate-800 p-1">
                          <div className="w-full rounded-t-3xl bg-blue-500 transition-all duration-500" style={{ height: `${item.value}%` }} />
                        </div>
                        <span className="mt-3 block text-sm font-semibold text-slate-300">{item.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 p-4 text-center">
                      <p className="text-sm text-slate-500">Média diária</p>
                      <p className="mt-3 text-2xl font-bold text-slate-900">82%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-center">
                      <p className="text-sm text-slate-500">Crescimento</p>
                      <p className="mt-3 text-2xl font-bold text-blue-600">+14%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4 text-center">
                      <p className="text-sm text-slate-500">Meta de visitas</p>
                      <p className="mt-3 text-2xl font-bold text-slate-900">12.5K</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/10">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Engajamento</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">10%</h3>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 text-orange-300">
                      <span className="text-3xl font-bold text-orange-400">68%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">Taxa de engajamento das últimas publicações e interações com os membros.</p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/10">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Notícias por categoria</p>
                  <div className="mt-6 space-y-4">
                    <ProgressBar label="Cultos" value={45} color="blue" />
                    <ProgressBar label="Eventos" value={28} color="orange" />
                    <ProgressBar label="Comunidade" value={18} color="yellow" />
                  </div>
                </div>
              </div>
            </section>
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Notícias recentes</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Últimas publicações</h3>
                  </div>
                  <button className="rounded-full bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:opacity-95">
                    Ver tudo
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  {news.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[0.65rem] font-semibold text-blue-300">{item.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-slate-950/10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Painel rápido</p>
                <div className="mt-5 space-y-4">
                  <SummaryRow label="Respostas em 24h" value="98%" />
                  <SummaryRow label="Novas mensagens" value="24" />
                  <SummaryRow label="Alertas urgentes" value="3" highlight />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-3xl px-4 py-4 text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-blue-500/10 text-blue-200 shadow-lg shadow-blue-950/20"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} />
      {label}
    </Link>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: "blue" | "red" | "orange" | "yellow" }) {
  const colors = {
    blue: "bg-blue-950/90 text-blue-200 border-blue-800",
    red: "bg-red-950/90 text-red-200 border-red-800",
    orange: "bg-orange-950/90 text-orange-200 border-orange-800",
    yellow: "bg-yellow-950/90 text-yellow-200 border-yellow-800",
  };

  return (
    <div className={`rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default ${colors[color]}`}>
      <p className="text-[0.7rem] font-bold uppercase tracking-[0.08em] opacity-80 text-slate-300 line-clamp-2">{title}</p>
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: "blue" | "orange" | "yellow" }) {
  const colorClass = {
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    yellow: "bg-yellow-400",
  }[color];

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div className={`${colorClass} h-full rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-3xl px-4 py-4 text-sm ${highlight ? "bg-red-500/10" : "bg-slate-800"}`}>
      <span className="text-slate-300">{label}</span>
      <span className={`font-semibold ${highlight ? "text-red-300" : "text-white"}`}>{value}</span>
    </div>
  );
}
