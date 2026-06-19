'use client';

import { 
  BsFileEarmarkBarGraph, 
  BsDownload, 
  BsMagic, 
  BsActivity, 
  BsCheck2Circle, 
  BsClockHistory, 
  BsArrowRepeat,
  BsCpu
} from 'react-icons/bs';

export default function ReportsContent() {
  const stats = [ // Adicionado barColor e glow para estilização consistente
    { label: 'Relatórios Totais', value: '1,284', icon: <BsFileEarmarkBarGraph />, color: 'text-blue-400', barColor: 'bg-blue-500', glow: 'shadow-blue-500/20' },
    { label: 'Processados por IA', value: '856', icon: <BsMagic />, color: 'text-cyan-400', barColor: 'bg-cyan-500', glow: 'shadow-cyan-500/20' },
    { label: 'Taxa de Precisão', value: '99.2%', icon: <BsCheck2Circle />, color: 'text-emerald-400', barColor: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  ];

  const reports = [
    { id: 1, name: 'Análise de Mobilidade Luanda Q2', date: 'Hoje, 14:20', size: '2.4MB', status: 'Finalizado' },
    { id: 2, name: 'Impacto Social - Benguela', date: 'Ontem, 09:15', size: '1.8MB', status: 'Finalizado' },
    { id: 3, name: 'Métricas de Inclusão Digital', date: '12 Jun 2026', size: '4.2MB', status: 'Processando' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header com IA em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-blue-900/20 border border-cyan-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <BsCpu size={120} className="text-cyan-400 animate-pulse" />
          </div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-cyan-500 animate-ping" />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">Live AI Insight</h2>
            </div>
            
            <h3 className="text-2xl font-bold text-white max-w-md leading-tight">
              Resumo Executivo Gerado Automaticamente
            </h3>
            
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "Detectamos um aumento de 12% na eficiência dos projetos de mobilidade em Luanda Sul comparado ao mês anterior. 
                Os relatórios sugerem que a integração de dados CDRView foi o fator determinante para este crescimento."
              </p>
              <div className="flex items-center gap-4 pt-2 text-[10px] font-mono text-cyan-500/60 uppercase">
                <span>Fonte: DataLake-72</span>
                <span>Confiança: 98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Stats Lateral */}
        <div className="flex flex-col gap-4">
          {stats.map((stat, i) => (
            <div 
              key={i} 
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
      </div>

      {/* Lista de Relatórios com Design de "Sistema de Arquivos" Profissional */}
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <BsActivity className="text-blue-400" />
            <h4 className="text-white font-semibold">Repositório de Relatórios</h4>
          </div>
          <button type="button" title="Sincronizar Relatórios" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95">
            <BsArrowRepeat /> Sincronizar Agora
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4 font-bold">Documento</th>
                <th className="px-6 py-4 font-bold">Data de Emissão</th>
                <th className="px-6 py-4 font-bold">Tamanho</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => (
                <tr key={report.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <BsFileEarmarkBarGraph size={18} />
                      </div>
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                        {report.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {report.size}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {report.status === 'Processando' ? (
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <BsClockHistory className="animate-spin" /> {report.status}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                          {report.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" 
                        title="Analisar com IA" 
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all">
                        <BsMagic size={16} />
                      </button>
                      <button 
                        type="button" 
                        title="Download PDF"
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                      >
                        <BsDownload size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
            Secure Data Transmission Protocol Active // Encryption: AES-256
          </p>
        </div>
      </div>
    </div>
  );
}