'use client';

import { 
  BsPinMap, 
  BsSearch, 
  BsLayers, 
  BsPlusLg, 
  BsDashLg, 
  BsInfoCircle, 
  BsBroadcastPin,
  BsGeoAltFill
} from 'react-icons/bs';

export default function MapContent() {
  const activeMarkers = [
    { id: 1, name: 'Luanda Central', status: 'Online', color: 'bg-emerald-500' },
    { id: 2, name: 'Benguela Hub', status: 'Online', color: 'bg-emerald-500' },
    { id: 3, name: 'Huambo Station', status: 'Manutenção', color: 'bg-amber-500' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-6 h-full flex flex-col animate-in fade-in zoom-in-95 duration-700">
      {/* Header com Filtros e Pesquisa */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BsPinMap className="text-cyan-400 shrink-0" />
            Análise Geográfica
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">Monitoramento em tempo real de infraestruturas e projetos sociais.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative group flex-1 lg:flex-none">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Pesquisar região..." 
              className="bg-slate-900/60 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 w-full lg:w-64 transition-all"
            />
          </div>
          <button 
            aria-label="Gerenciar camadas do mapa" 
            title="Gerenciar camadas do mapa"
            className="p-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
          >
            <BsLayers size={18} />
          </button>
        </div>
      </div>

      {/* Map Viewport Simulation */}
      <div className="flex-1 min-h-[500px] relative rounded-3xl border border-white/10 bg-slate-950/50 overflow-hidden shadow-2xl group">
        {/* Background Grid & Noise para Profundidade */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Simulação Visual de Mapa Central */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 select-none">
          <div className="w-[70%] h-[70%] border-2 border-dashed border-cyan-500/20 rounded-full animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute w-[40%] h-[40%] border border-dashed border-blue-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          <p className="absolute text-slate-700 font-mono text-7xl font-black uppercase tracking-[2rem]">Geodata</p>
        </div>

        {/* Marcadores Simulados com Animações de Status */}
        <div className="absolute top-1/4 left-1/3 group/marker cursor-pointer z-10">
          <div className="relative">
            <div className="absolute -inset-3 bg-cyan-500/20 rounded-full blur animate-ping"></div>
            <BsGeoAltFill className="text-cyan-400 text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-transform group-hover/marker:scale-125" />
            <div className="absolute left-full ml-3 top-0 bg-slate-900/90 border border-white/20 p-3 rounded-xl opacity-0 group-hover/marker:opacity-100 transition-all whitespace-nowrap backdrop-blur-md shadow-2xl translate-x-2 group-hover/marker:translate-x-0">
              <p className="text-xs font-bold text-white">PROJETO ALFA - MATOLA</p>
              <p className="text-[10px] text-cyan-400 uppercase font-bold mt-1">Impacto: 85% Concluído</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 group/marker cursor-pointer z-10">
          <div className="relative">
            <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur animate-pulse"></div>
            <BsBroadcastPin className="text-emerald-400 text-3xl transition-transform group-hover/marker:scale-125" />
            <div className="absolute right-full mr-3 top-0 bg-slate-900/90 border border-white/20 p-3 rounded-xl opacity-0 group-hover/marker:opacity-100 transition-all whitespace-nowrap backdrop-blur-md shadow-2xl -translate-x-2 group-hover/marker:translate-x-0">
              <p className="text-xs font-bold text-white">ANTENA SETORIAL L-24</p>
              <p className="text-[10px] text-emerald-400 uppercase font-bold mt-1">Status: Ativo em Tempo Real</p>
            </div>
          </div>
        </div>

        {/* Controles de Navegação (Overlay) */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          <button aria-label="Aumentar zoom" title="Aumentar zoom" className="p-3 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-all shadow-xl backdrop-blur-md hover:scale-105 active:scale-95">
            <BsPlusLg />
          </button>
          <button aria-label="Diminuir zoom" title="Diminuir zoom" className="p-3 bg-slate-900/80 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-all shadow-xl backdrop-blur-md hover:scale-105 active:scale-95">
            <BsDashLg />
          </button>
        </div>

        {/* Painel Lateral de Legenda e Status (Desktop) */}
        <div className="absolute top-6 left-6 w-64 hidden lg:block z-20">
          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status da Rede</span>
              <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {activeMarkers.map((marker) => (
                <div key={marker.id} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${marker.color} group-hover/item:scale-150 transition-transform`}></div>
                    <span className="text-sm text-slate-300 group-hover/item:text-white transition-colors">{marker.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{marker.status}</span>
                </div>
              ))}
            </div>
            <button aria-label="Ver detalhes da camada" className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all">
              <BsInfoCircle size={14} className="text-cyan-400" /> Detalhes da Camada
            </button>
          </div>
        </div>

        {/* Barra de Rodapé do Mapa */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-950/80 backdrop-blur-sm border-t border-white/5 flex items-center px-4 justify-between select-none">
          <div className="flex gap-4 text-[10px] font-mono text-slate-500">
            <span className="flex gap-1"><span className="text-slate-600">LAT:</span> -8.8383300</span>
            <span className="flex gap-1"><span className="text-slate-600">LONG:</span> 13.2344400</span>
          </div>
          <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-wider animate-pulse">
            Live Stream Connected // App BiT Core v1.0
          </div>
        </div>
      </div>
    </div>
  );
  return null;
}