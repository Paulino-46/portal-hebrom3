import React from 'react';
import { SidebarContent } from './components/SidebarContent';
import { NavbarContent } from './components/NavbarContent';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock data for initial layout render
  // In a real app, you would fetch these from your auth session
  const role = "user"; 
  const userEmail = "usuario@hebrom.com";

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar - O componente Sidebar original já possui a largura definida */}
      <SidebarContent role={role} userEmail={userEmail} />

      <div className="flex-1 flex flex-col min-w-0">
        <NavbarContent role={role} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}