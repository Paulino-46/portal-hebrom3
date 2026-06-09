﻿﻿﻿// import { getLatestNews } from "../../services/news";
import Link from "next/link";
import prisma from "../../repositories/prisma";

declare const main: any; // Adicionado para resolver o erro "Cannot find name 'main'"

interface BibleVerse {
  reference: string;
  text: string;
}

interface DashboardPageProps {
  searchParams?: { role?: string };
}

async function getRandomBibleVerse(): Promise<BibleVerse | null> {
  try {
    // A API bible-api.com não possui um endpoint nativo para versículos aleatórios.
    // Usamos uma lista de passagens selecionadas para garantir qualidade e evitar erros 404.
    const passages = [
      "João 3:16", "Salmos 23:1", "Filipenses 4:13", "Isaías 41:10",
      "Josué 1:9", "Mateus 11:28", "Romanos 8:28", "Jeremias 29:11",
      "Salmos 46:1", "Mateus 6:33", "1 Coríntios 13:4", "Provérbios 3:5"
    ];
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];

    // A API utiliza 'almeida' como slug para português.
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(randomPassage)}?translation=almeida`);

    if (!response.ok) {
      console.error(`Erro ao buscar versículo bíblico: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: any = await response.json();
    return { reference: data.reference, text: data.text.trim() };
  } catch (error) {
    console.error("Erro ao buscar versículo bíblico:", error);
    return null;
  }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const role = searchParams?.role === "admin" ? "admin" : "user";
  const bibleVerse = await getRandomBibleVerse();

  const [newsCount, eventsCount] = await Promise.all([
    prisma!.news.count().catch(() => 0),
    prisma!.event.count().catch(() => 0),
  ]);

  const sidebarItems = [
    { href: "/dashboard", label: "Painel", icon: <GridIcon />, active: true },
    { href: "/dashboard/schedule", label: "Cronograma", icon: <CalendarIcon /> },
    { href: "/dashboard/comms", label: "Comunicação", icon: <ChatIcon /> },
    { href: "/dashboard/news", label: "Noticias", icon: <NewsIcon /> },
    { href: "/dashboard/events", label: "Eventos", icon: <TicketIcon /> },
    { href: "/dashboard/projects", label: "Projeto", icon: <RocketIcon /> },
    { href: "/dashboard/feedback", label: "Feedback", icon: <FeedbackIcon /> },
    { href: "/dashboard/help", label: "Central de Ajuda", icon: <HelpIcon /> },
    { href: "/dashboard/vitrine", label: "Vitrine", icon: <ShopIcon /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 px-5 py-6 md:flex">
        <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-950/50">
            D.H
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Distrito de Hebrom</p>
            <p className="text-base font-bold text-white">Painel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {sidebarItems.map((item) => (
            <SidebarLink key={item.label} href={item.href} label={item.label} icon={item.icon} active={item.active} />
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 pt-4 relative">
          <details className="group list-none">
            <summary className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-800/40 p-2.5 hover:bg-slate-800/60 transition-all list-none [&::-webkit-details-marker]:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0 shadow-lg shadow-blue-900/20 relative">
                {role === "admin" ? "AD" : "MB"}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-green-500"></span>
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-[11px] font-semibold text-white">
                  {role === "admin" ? "Administrador" : "Membro Hebrom"}
                </span>
                <span className="truncate text-[9px] text-slate-500 uppercase tracking-wider">Online</span>
              </div>
              <div className="text-slate-500 group-open:rotate-180 transition-transform shrink-0">
                <MoreIcon />
              </div>
            </summary>

            <div className="absolute bottom-full left-0 mb-2 w-full rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="px-3 py-2">
                <p className="text-[11px] font-bold text-white truncate">
                  {role === "admin" ? "Administrador" : "Membro Hebrom"}
                </p>
                <p className="text-[9px] text-green-400 uppercase tracking-tight font-medium">Online agora</p>
              </div>
              
              <div className="my-1 border-t border-slate-800" />
              
              <div className="space-y-0.5">
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left">
                  <PersonIcon />
                  Ver Perfil
                </button>
                
                <details className="group/status list-none">
                  <summary className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Status: Online
                    </div>
                    <ChevronDownIcon />
                  </summary>
                  <div className="mt-1 ml-3 space-y-1 border-l border-slate-800 pl-2">
                    <button className="block w-full text-left px-2 py-1 text-[10px] text-slate-400 hover:text-white">Ausente</button>
                    <button className="block w-full text-left px-2 py-1 text-[10px] text-slate-400 hover:text-white">Ocupado</button>
                  </div>
                </details>

                <div className="my-1 border-t border-slate-800" />

                <Link 
                  href={role === "admin" ? "/login-admin" : "/login-user"} 
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogoutIcon />
                  Sair
                </Link>
              </div>
            </div>
          </details>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-6 py-4 shadow-sm shadow-slate-950/10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Painel administrativo</p>
            <h1 className="mt-1 text-xl font-semibold text-white">Olá, {role === "admin" ? "Administrador" : "Membro"}</h1>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">Acompanhe as principais métricas e as notícias recentes.</p>
          </div>

          <div className="flex flex-row items-center gap-3">
            <div className="relative w-full max-w-sm">
              <input
                type="search"
                placeholder="Buscar..."
                className="h-10 w-full rounded-full border border-slate-800 bg-slate-900 px-4 pr-12 text-xs text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            </div>
            <button className="inline-flex h-10 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-6 text-xs font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:opacity-95">
              Relatórios
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-8
          [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar-track]:bg-slate-950 
          [&::-webkit-scrollbar-thumb]:bg-slate-800 
          [&::-webkit-scrollbar-thumb]:rounded-full 
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Notícias */}
            <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Notícias</p>
                <p className="text-2xl font-bold text-white mt-1">{newsCount}</p>
                <p className="text-xs text-slate-500">Novas Notícias</p>
              </div>
              <div className="text-blue-400 text-3xl">
                <NewsIcon />
              </div>
            </div>

            {/* Card 2: Eventos */}
            <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Eventos</p>
                <p className="text-2xl font-bold text-white mt-1">{eventsCount}</p>
                <p className="text-xs text-slate-500">Próximos Eventos</p>
              </div>
              <div className="text-orange-400 text-3xl">
                <TicketIcon />
              </div>
            </div>

            {/* Card 3: Cronograma */}
            <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Cronograma</p>
                <p className="text-2xl font-bold text-white mt-1">7</p> {/* Placeholder */}
                <p className="text-xs text-slate-500">Atividades da Semana</p>
              </div>
              <div className="text-green-400 text-3xl">
                <CalendarIcon />
              </div>
            </div>

            {/* Card 4: Vitrine */}
            <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Vitrine</p>
                <p className="text-2xl font-bold text-white mt-1">25</p> {/* Placeholder */}
                <p className="text-xs text-slate-500">Produtos em Destaque</p>
              </div>
              <div className="text-purple-400 text-3xl">
                <ShopIcon />
              </div>
            </div>
          </div>

          {/* Card: Versículo Bíblico Dinâmico */}
          <div className="grid grid-cols-1">
            <div className="rounded-2xl bg-slate-900 p-8 shadow-lg shadow-slate-950/30 text-center flex flex-col justify-center items-center">
              {bibleVerse ? (
                <>
                  <p className="text-xl font-semibold text-white leading-relaxed mb-4">"{bibleVerse.text}"</p>
                  <p className="text-sm text-purple-200 font-medium">- {bibleVerse.reference}</p>
                </>
              ) : (
                <p className="text-lg text-red-300">Não foi possível carregar o versículo bíblico. Tente novamente mais tarde.</p>
              )}
            </div>
          </div>
          {/* Other dashboard content will go here */}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, label, icon, active = false }: { href: string; label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600/10 text-blue-200"
          : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
      }`}
    >
      <span className={`flex h-5 w-5 items-center justify-center text-sm ${active ? "text-blue-400" : "text-slate-500"}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}


// --- Bootstrap Icons (SVG) ---
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
    <path d="M14 2H2a1 1 0 0 0-1 1h14a1 1 0 0 0-1-1M11.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
  </svg>
);
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.5l2.7 3.375a.625.625 0 0 0 1 0l2.7-3.375a1 1 0 0 1 .8-.5H14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6 1L8 14.375 5.1 11a2 2 0 0 0-1.6-1H2a1 1 0 0 1-1-1z"/>
  </svg>
);
const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
    <path d="M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m-1 0a5 5 0 1 0-10 0 5 5 0 0 0 10 0m-2 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
  </svg>
);
const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 4.5a.5.5 0 0 1 .5.5v2.5l1.5 1.5a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1-.146-.354V5a.5.5 0 0 1 .5-.5"/>
    <path d="M8 1a9 9 0 1 0 9 9 9 9 0 0 0-9-9m0 1a8 8 0 1 1-8 8 8 8 0 0 1 8-8"/>
  </svg>
);
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 8.5 3V1zM5 4h3v1H5z"/>
    <path d="M5 7h6v1H5zm0 3h6v1H5zm0 3h3v1H5z"/>
  </svg>
);
const FeedbackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
  </svg>
);
const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.553 0 .98-.394.98-.927 0-.552-.427-.94-1.01-.94-.585 0-1.01.388-1.01.94"/>
  </svg>
);
const ShopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"/>
  </svg>
);
const MoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  </svg>
);
const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
  </svg>
);
