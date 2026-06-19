import React from "react";

interface NavbarProps { // Corrigido o caminho de importação
  role: string;
}

export function NavbarContent({ role }: NavbarProps) {
  return (
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
        <button 
          type="button"
          title="Visualizar Relatórios"
          className="inline-flex h-10 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-600 via-orange-500 to-red-500 px-6 text-xs font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:opacity-95"
        >
          Relatórios
        </button>
      </div>
    </header>
  );
}