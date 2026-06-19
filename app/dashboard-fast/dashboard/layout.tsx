import Sidebar from './components/Sidebar';
import Navbar from './components/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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