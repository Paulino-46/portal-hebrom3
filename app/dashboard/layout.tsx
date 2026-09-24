'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Navbar from './components/navbar';

const editorAllowedPaths = new Set([
  '/dashboard',
  '/dashboard/cronograma',
  '/dashboard/news',
  '/dashboard/events',
  '/dashboard/projects',
  '/dashboard/vitrine',
  '/dashboard/vetrine',
]);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser) as { profile?: string; role?: string };
      const isEditor = user.profile === 'editor' || user.role === 'editor';

      if (isEditor && !editorAllowedPaths.has(pathname || '')) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao validar perfil do usuário no dashboard:', error);
    }
  }, [pathname, router]);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 mt-16 md:ml-64 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}