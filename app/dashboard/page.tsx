import { getLatestNews } from "../../lib/news";
import Link from "next/link";

interface DashboardPageProps {
  searchParams?: { role?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const role = searchParams?.role === "admin" ? "admin" : "user";
  const news = await getLatestNews();

  const sidebarItems = [
    { href: "#", label: "Visão Geral", active: true },
    { href: "#", label: "Notícias" },
    { href: "#", label: "Estatísticas" },
    { href: "#", label: "Eventos" },
    { href: "#", label: "Configurações" },
  ];

  const metrics = [
    { label: "Notícias", value: news.length.toString(), color: "blue" },
    { label: "Acessos", value: "1.2K", color: "emerald" },
    { label: "Engajamento", value: "82%", color: "orange" },
    { label: "Membros", value: "1.8K", color: "purple" },
    { label: "Eventos", value: "8", color: "rose" },
  ];

  const visitors = [
    { day: "Seg", value: 62 },
    { day: "Ter", value: 95 },
    { day: "Qua", value: 78 },
    { day: "Qui", value: 110 },
    { day: "Sex", value: 92 },
    { day: "Sáb", value: 58 },
    { day: "Dom", value: 72 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            H3
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Portal Hebrom</p>
            <p className="text-lg font-bold text-slate-900">Painel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.label} href={item.href} label={item.label} active={item.active} />
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Relatório Rápido</p>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="text-sm font-medium text-slate-700">Atividade da semana</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-700">+18%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="text-sm font-medium text-slate-700">Novos membros</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[0.65rem] font-semibold text-blue-700">+42</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-6 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Painel administrativo</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Olá, {role === "admin" ? "Administrador" : "Membro"}</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">Acompanhe as principais métricas, estatísticas e as notícias mais recentes em tempo real.</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="search"
                placeholder="Buscar conteúdo..."
                className="h-10 rounded-full border border-slate-200 bg-slate-50 px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>
            <button className="inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
              Relatórios
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 py-6">
          <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[1.7fr_1.3fr]">
            <section className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {metrics.map((metric) => (
                  <StatCard key={metric.label} title={metric.label} value={metric.value} color={metric.color as any} />
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Visitas semanais</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">Tendência de engajamento</h2>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Últimos 7 dias
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-end gap-4">
                    {visitors.map((item) => (
                      <div key={item.day} className="flex-1 text-center">
                        <div className="mx-auto flex h-32 w-10 items-end justify-center">
                          <div className="w-full rounded-t-3xl bg-blue-500 transition-all duration-500" style={{ height: `${item.value}%` }} />
                        </div>
                        <span className="mt-2 block text-sm font-semibold text-slate-700">{item.day}</span>
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
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Engajamento</p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">68%</h3>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <span className="text-2xl font-bold text-blue-600">68%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">Taxa de engajamento das últimas publicações e interações com os membros.</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Notícias por categoria</p>
                  <div className="mt-6 space-y-4">
                    <ProgressBar label="Cultos" value={45} color="blue" />
                    <ProgressBar label="Eventos" value={28} color="orange" />
                    <ProgressBar label="Comunidade" value={18} color="emerald" />
                  </div>
                </div>
              </div>
            </section>
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Notícias recentes</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-900">Últimas publicações</h3>
                  </div>
                  <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">Ver tudo</button>
                </div>
                <div className="mt-6 space-y-4">
                  {news.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-[0.65rem] font-semibold text-blue-700">{item.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Painel rápido</p>
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
          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-blue-600" : "bg-slate-300"}`} />
      {label}
    </Link>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: "blue" | "emerald" | "orange" | "purple" | "rose" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
      <p className="mt-4 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: "blue" | "orange" | "emerald" }) {
  const colorClass = {
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    emerald: "bg-emerald-500",
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
    <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-semibold ${highlight ? "text-rose-600" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}
