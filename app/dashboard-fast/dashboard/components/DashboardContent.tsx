'use client';

import { BsPeople, BsCheckCircle, BsGraphUp, BsMap } from 'react-icons/bs';

export default function DashboardContent() {
  // Esta estrutura está pronta para ser substituída por um estado (useState) 
  // que receba os dados do seu backend via useEffect/fetch.
  const stats = [
    {
      id: 1,
      label: 'Utilizadores Ativos',
      value: '1,284',
      icon: <BsPeople size={18} />,
      color: 'text-blue-400',
      barColor: 'bg-blue-500',
      glow: 'shadow-blue-500/20',
    },
    {
      id: 2,
      label: 'Projetos Concluídos',
      value: '42',
      icon: <BsCheckCircle size={18} />,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      glow: 'shadow-emerald-500/20',
    },
    {
      id: 3,
      label: 'Crescimento Mensal',
      value: '+12.5%',
      icon: <BsGraphUp size={18} />,
      color: 'text-amber-400',
      barColor: 'bg-amber-500',
      glow: 'shadow-amber-500/20',
    },
    {
      id: 4,
      label: 'Regiões Mapeadas',
      value: '18',
      icon: <BsMap size={18} />,
      color: 'text-purple-400',
      barColor: 'bg-purple-500',
      glow: 'shadow-purple-500/20',
    },
  ];

  return (
    <div className="px-4 sm:px-8 pb-8 pt-4 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Grid de Cards (Equivalente a col-3 em layout de 12 colunas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.id}
            className={`relative group overflow-hidden bg-slate-900/50 border border-white/20 p-4 rounded-xl backdrop-blur-xl transition-all hover:bg-slate-800/60 hover:border-white/30 shadow-xl ${stat.glow}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <p className="text-slate-400 text-[0.65rem] font-medium tracking-wide uppercase">{stat.label}</p>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white">{stat.value}</h3>

            {/* Barra Inferior Estilizada */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.barColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      {/* Placeholder para conteúdo adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-64 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl flex items-center justify-center p-4 text-center">
          <p className="text-slate-500 italic">Gráfico de tendências em desenvolvimento...</p>
        </div>
        <div className="h-64 bg-slate-900/40 border border-dashed border-white/10 rounded-3xl flex items-center justify-center p-4 text-center">
          <p className="text-slate-500 italic">Atividades recentes...</p>
        </div>
      </div>
    </div>
  );
}