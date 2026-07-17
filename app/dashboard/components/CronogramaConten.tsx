'use client';

import {
  BsCalendar2Week,
  BsSunrise,
  BsSunset,
  BsBook,
  BsPeople,
  BsMic,
  BsHeart,
  BsPinMap,
  BsClock,
} from 'react-icons/bs';

export default function CronogramaContent() {
  const weeklyHighlights = [
    {
      day: 'Sexta-feira',
      title: 'Culto de Pôr do Sol',
      time: '18:00',
      icon: <BsSunset className="text-amber-400" size={24} />,
      color: 'from-amber-500/20 to-slate-900/0',
    },
    {
      day: 'Sábado',
      title: 'Escola Sabatina & Culto Divino',
      time: '09:00 - 12:00',
      icon: <BsBook className="text-sky-400" size={24} />,
      color: 'from-sky-500/20 to-slate-900/0',
    },
    {
      day: 'Sábado',
      title: 'Programa Jovem Adventista',
      time: '16:30',
      icon: <BsPeople className="text-emerald-400" size={24} />,
      color: 'from-emerald-500/20 to-slate-900/0',
    },
  ];

  const weeklySchedule = [
    { day: 'Domingo', event: 'Ação Social', time: '10:00', details: 'Distribuição de alimentos' },
    { day: 'Segunda', event: '---', time: '', details: '' },
    { day: 'Terça', event: 'Reunião de Oração', time: '19:30', details: 'Estudo e oração em grupo' },
    { day: 'Quarta', event: 'Culto Semanal', time: '19:30', details: 'Mensagem e louvor' },
    { day: 'Quinta', event: 'Ensaio do Coral', time: '20:00', details: 'Preparação para o Sábado' },
    { day: 'Sexta', event: 'Culto de Pôr do Sol', time: '18:00', details: 'Início do Sábado' },
    { day: 'Sábado', event: 'Programa Completo', time: '09:00 - 18:00', details: 'Escola Sabatina, Culto e J.A.' },
  ];

  const specialEvents = [
    {
      title: 'Semana de Oração Jovem',
      date: '14 a 21 de Julho',
      description: 'Uma semana inteira dedicada à comunhão e ao crescimento espiritual dos jovens da nossa comunidade.',
      speaker: 'Pr. João Almeida',
    },
    {
      title: 'Congresso Distrital',
      date: '27 de Julho',
      description: 'Reunião de todas as igrejas do distrito para um dia de louvor, testemunhos e confraternização.',
      speaker: 'Líderes da União',
    },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BsCalendar2Week className="text-blue-400 shrink-0" />
            Cronograma de Atividades
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Programação semanal e eventos especiais da comunidade.
          </p>
        </div>
      </div>

      {/* Destaques da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {weeklyHighlights.map((item, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden bg-slate-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl transition-all hover:bg-slate-800/70 hover:border-white/20 shadow-lg`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-bl ${item.color} opacity-60 group-hover:opacity-100 transition-opacity blur-2xl`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.day}</span>
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-2xl font-black text-slate-300 group-hover:text-white transition-colors">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Agenda Semanal Detalhada */}
      <div className="bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <h4 className="text-white font-bold text-lg">Agenda da Semana</h4>
          <p className="text-slate-400 text-sm mt-1">Horários das atividades regulares.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7">
          {weeklySchedule.map((item, index) => (
            <div key={index} className={`p-4 border-b md:border-b-0 md:border-r border-white/5 ${index === 6 ? 'md:border-r-0' : ''} ${item.event === '---' ? 'opacity-50' : ''}`}>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">{item.day}</p>
              {item.event !== '---' ? (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-white">{item.event}</p>
                  <p className="text-xs text-blue-400 font-mono mt-1">{item.time}</p>
                  <p className="text-[11px] text-slate-500 mt-2">{item.details}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600 mt-4 italic">Sem atividades</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Eventos Especiais */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Próximos Eventos Especiais</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {specialEvents.map((event, index) => (
            <div key={index} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-blue-400/30 transition-colors duration-300 shadow-lg">
              <div>
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">{event.date}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{event.title}</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-grow">{event.description}</p>
              <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-full text-slate-400">
                  <BsMic size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Orador</p>
                  <p className="text-sm font-semibold text-white">{event.speaker}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legenda Rápida */}
      <div className="text-center pt-4 border-t border-white/5">
        <p className="text-xs text-slate-500 font-mono">
          <BsSunrise className="inline -mt-1" /> Nascer do Sol e <BsSunset className="inline -mt-1" /> Pôr do Sol são baseados na sua localização.
        </p>
      </div>
    </div>
  );
}