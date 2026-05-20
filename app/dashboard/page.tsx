import { getLatestNews } from "../../lib/news";
import Link from "next/link";

interface DashboardPageProps {
  searchParams?: { role?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const role = searchParams?.role === "admin" ? "admin" : "user";
  const news = await getLatestNews();

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden w-54 flex-col border-r border-slate-200 bg-white px-6 py-8 md:flex">
        <div className="mb-10 flex items-center gap-3 px-2 text-blue-600 transition-transform hover:scale-105 cursor-pointer">
          <div className="h-8 w-8 rounded-lg bg-blue-600 shadow-lg shadow-blue-200"></div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Hebrom III</span>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          <SidebarLink href="#" label="Início" active />
          <SidebarLink href="#" label="Notícias" />
          <SidebarLink href="#" label="Eventos" />
          <SidebarLink href="#" label="Configurações" />
          
        </nav>

        <div className="mt-auto border-t border-slate-950 pt-6">
          <Link href="/" className="group flex items-center gap-1 px-4 py-2 text-slate-500 transition-all duration-200 hover:text-red-600">
            <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="font-medium">Sair do Portal</span>
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="flex h-20 items-center justify-between border-b border-transparent bg-white px-8">
          <div>
            <h2 className="text-sm font-medium text-slate-500">Bem-vindo de volta,</h2>
            <p className="text-lg font-bold text-slate-900 transition-all duration-300 hover:text-blue-600 cursor-default">
              {role === "admin" ? "Administrador Hebrom" : "Membro Hebrom"}
            </p>
          </div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{role === "admin" ? "Admin" : "Usuário"}</span>
              <span className="text-xs text-emerald-500 font-medium">Online</span>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-2 ring-white shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="mx-auto max-w-6xl space-y-10">
            {/* Stats Cards */}
            <section className="grid gap-3 grid-cols-1 sm:grid-cols-8 lg:grid-cols-5">
              <StatCard title="Total de Notícias" value={news.length.toString()} color="blue" />
              <StatCard title="Tipo de Acesso" value={role === "admin" ? "Administrador" : "Leitor"} color="emerald" />
              <StatCard title="Status do Banco" value="Conectado" color="orange" />
              <StatCard title="Usuários Ativos" value="12" color="purple" />
              <StatCard title="Eventos Agendados" value="4" color="rose" />
            </section>

            {/* Content Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-600 transition-colors duration-300 hover:text-blue-700 cursor-default">Notícias Recentes</h2>
                <button className="text-sm font-semibold text-blue-400 hover:text-blue-600 transition-colors">Ver todas as publicações</button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((item) => (
                  <article key={item.id} className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{item.author}</span>
                      <span className="text-[10px] font-medium text-slate-400">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold leading-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {item.summary}
                    </p>
                    <div className="mt-6 flex items-center text-sm font-semibold text-slate-900">
                      <span className="mr-2">Ler notícia completa</span>
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </article>
                ))}
              </div>
            </section>
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
      className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
        active 
          ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className={`h-1.5 w-1.5 rounded-full transition-all ${active ? "bg-blue-600 scale-125" : "bg-transparent"}`}></div>
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
    <div className={`rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-default ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-black text-slate-900 transition-all duration-300 group-hover:scale-105">{value}</p>
    </div>
  );
}
