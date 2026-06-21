"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {  GridIcon, 
          CalendarIcon, 
          ChatIcon, 
          NewsIcon, 
          TicketIcon, 
          RocketIcon, 
          FeedbackIcon, 
          HelpIcon, 
          ShopIcon, 
          MoreIcon, 
          PersonIcon, 
          ChevronDownIcon, 
          LogoutIcon } from "./Icons";

interface SidebarProps {
  role: string;
  userEmail: string;
}

// Componente para o Diálogo de Cronograma
function ScheduleDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 p-8 shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Cronograma da Comunidade</h2>
        <p className="text-slate-300 mb-6">
          Aqui você encontrará o cronograma de atividades, cultos e eventos da nossa comunidade.
          Fique atento às atualizações!
        </p>
        <div className="bg-slate-800 p-4 rounded-lg text-slate-400">
          <p>Conteúdo do cronograma virá aqui...</p>
          <ul className="mt-4 space-y-2">
            <li>Culto de Domingo: 10:00 - 12:00</li>
            <li>Estudo Bíblico (Quarta-feira): 19:30 - 21:00</li>
            <li>Reunião de Jovens (Sexta-feira): 20:00 - 22:00</li>
          </ul>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Fechar"
          aria-label="Fechar cronograma"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1 0-.708"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SidebarContent({ role, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");

  const sidebarItems = [
    { href: "/dashboard", label: "Painel", icon: <GridIcon /> },
    { href: "/dashboard?view=schedule", label: "Cronograma", icon: <CalendarIcon /> },
    { href: "/dashboard/comms", label: "Comunicação", icon: <ChatIcon /> },
    { href: "/dashboard?view=news", label: "Noticias", icon: <NewsIcon /> },
    { href: "/dashboard?view=events", label: "Eventos", icon: <TicketIcon /> },
    { href: "/dashboard/projects", label: "Projeto", icon: <RocketIcon /> },
    { href: "/dashboard/feedback", label: "Feedback", icon: <FeedbackIcon /> },
    { href: "/dashboard/help", label: "Central de Ajuda", icon: <HelpIcon /> },
    { href: "/dashboard?view=vitrine", label: "Vitrine", icon: <ShopIcon /> },
  ];

  return (
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
        {sidebarItems.map((item) => {
          // Lógica para definir se o item está ativo
          const itemUrl = new URL(item.href, "http://localhost");
          const itemView = itemUrl.searchParams.get("view");
          
          const isActive = itemView 
            ? currentView === itemView 
            : (pathname === item.href && !currentView);

          return (
            <SidebarLink 
              key={item.label} 
              href={item.href} 
              label={item.label} 
              icon={item.icon} 
              active={isActive}
            />
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4 relative">
        <details className="group list-none">
          <summary className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-800/40 p-2.5 hover:bg-slate-800/60 transition-all list-none [&::-webkit-details-marker]:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0 shadow-lg shadow-blue-900/20 relative">
              {role === "admin" ? "AD" : "MB"}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-green-500"></span>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-[11px] font-semibold text-white">{userEmail}</span>
              <span className="truncate text-[9px] text-slate-500 uppercase tracking-wider">Online</span>
            </div>
            <div className="text-slate-500 group-open:rotate-180 transition-transform shrink-0">
              <MoreIcon />
            </div>
          </summary>

          <div className="absolute bottom-full left-0 mb-2 w-full rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
            <div className="px-3 py-2">
              <p className="text-[11px] font-bold text-white truncate">{userEmail}</p>
              <p className="text-[9px] text-green-400 uppercase tracking-tight font-medium">Online agora</p>
            </div>
            <div className="my-1 border-t border-slate-800" />
            <div className="space-y-0.5">
              <button 
                type="button"
                title="Ver Perfil do Usuário"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
              >
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
                  <button type="button" title="Alterar para Ausente" className="block w-full text-left px-2 py-1 text-[10px] text-slate-400 hover:text-white">Ausente</button>
                  <button type="button" title="Alterar para Ocupado" className="block w-full text-left px-2 py-1 text-[10px] text-slate-400 hover:text-white">Ocupado</button>
                </div>
              </details>
              <div className="my-1 border-t border-slate-800" />
              <Link href={role === "admin" ? "/login-admin" : "/login-user"} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-red-400 hover:bg-red-500/10 transition-colors text-left">
                <LogoutIcon />
                Sair
              </Link>
            </div>
          </div>
        </details>
      </div>
      </aside>
  );
}

function SidebarLink({ href, label, icon, active = false, onClick }: { href?: string; label: string; icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  const commonClasses = `flex items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${active ? "bg-blue-600/10 text-blue-200" : "text-slate-400 hover:bg-slate-800/40 hover:text-white"}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={commonClasses} title={label}>
        <span className={`flex h-5 w-5 items-center justify-center text-sm ${active ? "text-blue-400" : "text-slate-500"}`}>
          {icon}
        </span>
        {label}
      </button>
    );
  }

  return (
    <Link 
      href={href!} 
      title={label}
      className={commonClasses}
    >
      <span className={`flex h-5 w-5 items-center justify-center text-sm ${active ? "text-blue-400" : "text-slate-500"}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}