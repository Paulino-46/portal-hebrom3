'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora dele para melhorar a UX
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo e Branding */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-navy font-black shadow-[0_0_20px_rgba(212,175,55,0.3)] transition group-hover:scale-110">
              H3
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tighter text-white">HEBROM</span>
              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-gold/80">Portal Comunitário</span>
            </div>
          </Link>

          {/* Navegação Principal */}
          <div className="hidden items-center gap-10 md:flex">
            <Link href="/#about" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition">Sobre</Link>
            <Link href="/news" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition">Notícias</Link>
            <Link href="/events" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition">Eventos</Link>
            
            {/* Botão de Entrada com Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 rounded-full bg-gold px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-navy shadow-lg shadow-gold/10 transition-all hover:shadow-gold/20 hover:brightness-110 active:scale-95"
              >
                Entrar
                <svg 
                  className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="4"
                >
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown Card Estilizado */}
              {isOpen && (
                <div className="absolute right-0 mt-4 w-72 origin-top-right overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="px-5 py-4 border-b border-white/5 mb-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Área de Acesso</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Bem-vindo à comunidade Hebrom III</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Link
                      href="/login-user"
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-4 rounded-[1.5rem] px-5 py-4 transition hover:bg-gold hover:text-navy"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition group-hover:bg-navy/10 group-hover:text-navy">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Login</span>
                        <span className="text-[10px] opacity-60">Acesse sua conta</span>
                      </div>
                    </Link>
                    
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-4 rounded-[1.5rem] px-5 py-4 transition hover:bg-white/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 transition group-hover:bg-slate-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white transition group-hover:text-gold">Register</span>
                        <span className="text-[10px] text-slate-500">Crie seu perfil</span>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="mt-4 bg-slate-950/50 p-4 rounded-[1.75rem]">
                    <p className="text-[9px] text-center leading-relaxed text-slate-500 uppercase tracking-[0.15em]">
                      Distrito de Hebrom III
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}