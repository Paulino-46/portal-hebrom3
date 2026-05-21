"use client";

import Link from "next/link";
import { useState } from "react";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-0 sm:px-10 h-[68px]">

        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-bold tracking-wide text-gold-light">
          Hebrom <span className="font-normal text-white">III</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "#about", label: "Sobre" },
            { href: "#news", label: "Notícias" },
            { href: "#events", label: "Eventos" },
            { href: "#contact", label: "Contato" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400 transition-colors hover:text-gold-light"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login-admin"
            className="hidden rounded-full border border-gold/30 px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gold-light transition hover:border-gold hover:bg-gold/10 sm:inline-flex"
          >
            Admin
          </Link>
          <Link
            href="/login-user"
            className="rounded-full bg-gold px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-navy transition hover:bg-gold-light"
          >
            Entrar
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="ml-1 flex flex-col gap-1.5 md:hidden"
            aria-label="Menu"
          >
            <span className={`block h-px w-6 bg-white transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-white transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gold/20 bg-navy px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {[
              { href: "#about", label: "Sobre" },
              { href: "#news", label: "Notícias" },
              { href: "#events", label: "Eventos" },
              { href: "#contact", label: "Contato" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-gold/10 py-2.5 text-sm font-medium text-slate-300 transition hover:text-gold-light"
              >
                {label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <Link href="/login-user" className="flex-1 rounded-full bg-gold py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-navy">
                Usuário
              </Link>
              <Link href="/login-admin" className="flex-1 rounded-full border border-gold/40 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-gold-light">
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}