"use client";

import Link from "next/link";
import { useState } from "react";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <Link href="/" className="text-xl font-semibold tracking-[0.18em] text-slate-900">
          Hebrom III
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#about" className="transition hover:text-slate-900">Sobre</a>
          <a href="#news" className="transition hover:text-slate-900">Notícias</a>
          <a href="#events" className="transition hover:text-slate-900">Eventos</a>
          <a href="#contato" className="transition hover:text-slate-900">Contato</a>
        </nav>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Login
            <span className="text-sm">▾</span>
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
              <Link
                href="/login-user"
                onClick={() => setMenuOpen(false)}
                className="block px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Acesso de Usuário
              </Link>
              <Link
                href="/login-admin"
                onClick={() => setMenuOpen(false)}
                className="block border-t border-slate-100 px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Acesso do Administrador
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
