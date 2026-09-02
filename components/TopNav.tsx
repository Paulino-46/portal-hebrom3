'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloqueia o scroll quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[100] border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between sm:h-20">

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3" onClick={closeMobile}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold font-black text-navy shadow-[0_0_20px_rgba(212,175,55,0.3)] transition group-hover:scale-110 sm:h-10 sm:w-10">
              DH
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tighter text-white sm:text-lg">HEBROM</span>
                <span className="text-[8px] font-medium uppercase tracking-[0.3em] text-gold/80 sm:text-[9px]">Portal Comunitário</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-8 md:flex lg:gap-10">
              <Link href="/#about" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition hover:text-white">Sobre</Link>
              <Link href="/news"   className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition hover:text-white">Notícias</Link>
              <Link href="/events" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition hover:text-white">Eventos</Link>

              {/* Entrar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-3 rounded-full bg-gold px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-navy shadow-lg shadow-gold/10 transition-all hover:shadow-gold/20 hover:brightness-110 active:scale-95"
                >
                  Entrar
                  <svg
                    className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-4 w-72 origin-top-right overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="mb-2 border-b border-white/5 px-5 py-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Área de Acesso</h4>
                      <p className="mt-1 text-[11px] text-slate-500">Bem-vindo à comunidade do Distritu de Hebrom</p>
                    </div>
                    <div className="space-y-1">
                      <Link href="/login-user" onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-4 rounded-[1.5rem] px-5 py-4 transition hover:bg-gold hover:text-navy">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition group-hover:bg-navy/10 group-hover:text-navy">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">Login</span>
                          <span className="text-[10px] opacity-60">Acesse sua conta</span>
                        </div>
                      </Link>
                      <Link href="/register" onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-4 rounded-[1.5rem] px-5 py-4 transition hover:bg-white/5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition group-hover:bg-slate-700">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white transition group-hover:text-gold">Registar</span>
                          <span className="text-[10px] text-slate-500">Crie seu perfil</span>
                        </div>
                      </Link>
                    </div>
                    <div className="mt-4 rounded-[1.75rem] bg-slate-950/50 p-4">
                      <p className="text-center text-[9px] uppercase leading-relaxed tracking-[0.15em] text-slate-500">
                        Distrito de Hebrom 
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 transition hover:border-gold/40 md:hidden"
            >
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-white transition-all duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[99] flex flex-col md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeMobile} />

          {/* Panel — slides in from right */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <span className="text-sm font-bold text-white">Menu</span>
              <button onClick={closeMobile} aria-label="Fechar" className="text-slate-400 hover:text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 p-4">
              {[
                { href: "/#about", label: "Sobre nós" },
                { href: "/news",   label: "Notícias" },
                { href: "/events", label: "Eventos" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className="rounded-2xl px-5 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Auth section */}
            <div className="mt-auto border-t border-white/10 p-4">
              <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Área de Acesso</p>
              <div className="space-y-1">
                <Link href="/login-user" onClick={closeMobile}
                  className="flex items-center gap-4 rounded-2xl bg-gold px-5 py-4 transition active:scale-95">
                  <svg className="h-5 w-5 text-navy" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-navy">Login</p>
                    <p className="text-[10px] text-navy/70">Acesse sua conta</p>
                  </div>
                </Link>
                <Link href="/register" onClick={closeMobile}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4 transition hover:bg-white/5">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-white">Registar</p>
                    <p className="text-[10px] text-slate-500">Crie seu perfil</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}