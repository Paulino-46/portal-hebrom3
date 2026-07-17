'use client';

import { useState } from 'react';
import {
  BsRocketTakeoff,
  BsBuilding,
  BsMegaphone,
  BsTools,
  BsFilter,
  BsGraphUp,
  BsCheck2Circle,
  BsPeopleFill,
  BsPersonWorkspace,
  BsCashCoin,
  BsBullseye,
} from 'react-icons/bs';

export default function ProjectsContent() {
  const [filter, setFilter] = useState('Todos');

  const projects = [
    {
      category: 'Construção',
      title: 'Construção do Novo Templo',
      status: 'Em Andamento',
      progress: 65,
      leader: 'Eng. Manuel Francisco',
      budget: 'AOA 25.000.000',
      volunteers: 45,
      impact: 'Capacidade para 500 membros',
      icon: <BsBuilding />,
      color: 'blue',
    },
    {
      category: 'Evangelismo',
      title: 'Missão Calebe 2026 - Huíla',
      status: 'Planejamento',
      progress: 20,
      leader: 'Ancião João Baptista',
      budget: 'AOA 5.000.000',
      volunteers: 120,
      impact: 'Estimativa de 2000 vidas alcançadas',
      icon: <BsMegaphone />,
      color: 'emerald',
    },
    {
      category: 'Melhoramentos',
      title: 'Renovação da Escola Sabatina',
      status: 'Concluído',
      progress: 100,
      leader: 'Diaconisa Maria da Conceição',
      budget: 'AOA 1.500.000',
      volunteers: 25,
      impact: 'Salas mais modernas e interativas',
      icon: <BsTools />,
      color: 'amber',
    },
    {
      category: 'Construção',
      title: 'Centro Comunitário Hebrom',
      status: 'Em Andamento',
      progress: 40,
      leader: 'Eng. Manuel Francisco',
      budget: 'AOA 12.000.000',
      volunteers: 30,
      impact: 'Apoio social e cursos profissionalizantes',
      icon: <BsBuilding />,
      color: 'blue',
    },
    {
      category: 'Evangelismo',
      title: 'Evangelismo Digital "Esperança Viva"',
      status: 'Em Andamento',
      progress: 80,
      leader: 'Jovem A. Valente',
      budget: 'AOA 800.000',
      volunteers: 15,
      impact: '+50.000 visualizações online',
      icon: <BsMegaphone />,
      color: 'emerald',
    },
  ];

  const filteredProjects = projects.filter(p => filter === 'Todos' || p.category === filter);

  const stats = [
    { label: 'Projetos em Andamento', value: projects.filter(p => p.status === 'Em Andamento').length, icon: <BsGraphUp />, color: 'cyan' },
    { label: 'Projetos Concluídos', value: projects.filter(p => p.status === 'Concluído').length, icon: <BsCheck2Circle />, color: 'emerald' },
    { label: 'Total de Voluntários', value: projects.reduce((acc, p) => acc + p.volunteers, 0), icon: <BsPeopleFill />, color: 'purple' },
  ];

  const filters = ['Todos', 'Construção', 'Evangelismo', 'Melhoramentos'];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BsRocketTakeoff className="text-blue-400 shrink-0" />
            Nossos Projetos
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Acompanhe o andamento das iniciativas que transformam nossa comunidade.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className={`bg-slate-900/50 border border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-lg flex items-center gap-4`}>
            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <BsFilter className="text-slate-400" />
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p, i) => (
          <div key={i} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-400/30 transition-colors duration-300 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest text-${p.color}-400`}>{p.category}</span>
                <h3 className="text-lg font-bold text-white mt-1">{p.title}</h3>
              </div>
              <div className={`p-2 bg-slate-800 rounded-full text-slate-400 text-${p.color}-400`}>{p.icon}</div>
            </div>
            <div className="text-xs font-medium text-slate-300">
              Status: <span className={`font-bold ${p.status === 'Concluído' ? 'text-emerald-400' : 'text-amber-400'}`}>{p.status}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Progresso</span><span>{p.progress}%</span></div>
              <div className="w-full bg-slate-800 rounded-full h-2"><div className={`bg-${p.color}-500 h-2 rounded-full`} style={{ width: `${p.progress}%` }}></div></div>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
              <p className="flex items-center gap-2 text-slate-300"><BsPersonWorkspace className="text-slate-500" /> <strong>Líder:</strong> {p.leader}</p>
              <p className="flex items-center gap-2 text-slate-300"><BsCashCoin className="text-slate-500" /> <strong>Orçamento:</strong> {p.budget}</p>
              <p className="flex items-center gap-2 text-slate-300"><BsPeopleFill className="text-slate-500" /> <strong>Voluntários:</strong> {p.volunteers}</p>
              <p className="flex items-center gap-2 text-slate-300"><BsBullseye className="text-slate-500" /> <strong>Impacto:</strong> {p.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}