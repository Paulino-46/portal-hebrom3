'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useState, useEffect } from 'react';
import {
  BsNewspaper,
  BsCalendarEvent,
  BsPeople,
  BsGraphUp,
  BsBook,
  BsRocketTakeoff,
  BsPieChart,
  BsQuestionCircle,
} from 'react-icons/bs';

interface Verse {
  reference: string;
  text: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  church: string;
}

export default function DashboardContent() {
  const [stats, setStats] = useState([
    {
      id: 1,
      label: 'Notícias Publicadas',
      value: '...',
      icon: <BsNewspaper size={18} />,
      color: 'text-blue-400',
      barColor: 'bg-blue-500',
      glow: 'shadow-blue-500/20',
    },
    {
      id: 2,
      label: 'Eventos Agendados',
      value: '...',
      icon: <BsCalendarEvent size={18} />,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-500',
      glow: 'shadow-emerald-500/20',
    },
    {
      id: 3,
      label: 'Utilizadores Ativos', // Agora dinâmico
      value: '...',
      icon: <BsPeople size={18} />,
      color: 'text-amber-400',
      barColor: 'bg-amber-500',
      glow: 'shadow-amber-500/20',
    },
    {
      id: 4,
      label: 'Crescimento Mensal', // Agora dinâmico
      value: '...',
      icon: <BsGraphUp size={18} />,
      color: 'text-purple-400',
      barColor: 'bg-purple-500',
      glow: 'shadow-purple-500/20',
    },
  ]);

  const [verse, setVerse] = useState<Verse | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [churchData, setChurchData] = useState<{ name: string; users: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<{ name: string; value: number }[]>([]);
  const [dailyNewsData, setDailyNewsData] = useState<{ date: string; count: number }[]>([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState<{ name: string; value: number }[]>([]);
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']; // Azul, Verde, Laranja, Roxo, Rosa
  // Lista de versículos populares para buscar aleatoriamente
  const verses = [
    'JHN.3.16',      // João 3:16 (Abreviação correta é JHN)
    'ROM.8.28',      // Romanos 8:28
    'PSA.23.1',      // Salmos 23:1
    '1JN.4.7',       // 1 João 4:7
    'PHP.4.13',      // Filipenses 4:13
    'PRV.3.5',       // Provérbios 3:5
    'MAT.6.33',      // Mateus 6:33
    '1CO.13.4',      // 1 Coríntios 13:4
    'PSA.119.105',   // Salmos 119:105
    'JER.29.11',     // Jeremias 29:11
  ];

  // Buscar versículo aleatório
  const fetchVerse = async () => {
    try {
      setLoadingVerse(true);
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];
      console.log('🔍 Buscando versículo:', randomVerse);
      
      const response = await fetch(`/api/vercel?passage=${randomVerse}`);

      console.log('📊 Status da resposta:', response.status);

      if (!response.ok) {
        let errorDetails: any = `Request failed with status ${response.status}`;
        try {
          // Tenta clonar a resposta para poder ler o corpo duas vezes se necessário
          const errorData = await response.clone().json();
          errorDetails = errorData;
        } catch (e) {
          // Se o corpo não for JSON, lê como texto
          errorDetails = await response.text();
        }
        console.error('❌ Erro na resposta da API:', response.statusText, errorDetails);
        console.error('📋 Detalhes do erro:', errorDetails);
        setLoadingVerse(false);
        return;
      }

      const data = await response.json();
      console.log('✅ Versículo recebido:', data.data.reference);

      // A estrutura correta é data.data com content e reference
      if (data.data) {
        const verseText = data.data.content || 'Versículo não disponível';
        const verseRef = data.data.reference || randomVerse;
        
        console.log('🎉 Versículo em português carregado:', verseRef);
        
        setVerse({
          reference: verseRef,
          text: verseText.trim(),
        });
      } else {
        console.warn('⚠️ Estrutura data.data não encontrada');
      }
      setLoadingVerse(false);
    } catch (error) {
      console.error('💥 Erro ao buscar versículo da Bíblia:', error);
      setLoadingVerse(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [newsRes, eventsRes, usersRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/events'),
          fetch('/api/users/all'), // Correção do endpoint da API
        ]);

        const parseJsonSafely = async (response: Response) => {
          if (!response.ok) return null;

          const contentType = response.headers.get('content-type') ?? '';
          if (!contentType.includes('application/json')) return null;

          try {
            return await response.json();
          } catch {
            return null;
          }
        };

        const newsData = await parseJsonSafely(newsRes);
        const eventsData = await parseJsonSafely(eventsRes);
        const usersData = await parseJsonSafely(usersRes);

        const newsItems = Array.isArray(newsData?.news) ? newsData.news : [];
        const eventItems: any[] = Array.isArray(eventsData?.events) ? eventsData.events : [];
        // A API /api/users/all retorna { users: [...] }
        // Acessar a propriedade 'users' para obter a lista
        const users: User[] = Array.isArray(usersData?.users)
          ? usersData.users
          : (Array.isArray(usersData) ? usersData : []);
        const userCount = users.length || (typeof usersData?.count === 'number' ? usersData.count : 0);

        // Processar dados de usuários por igreja para o gráfico
        const countsByChurch: { [key: string]: number } = users.reduce((acc, user) => {
          // Garante que a propriedade 'church' existe e não é nula
          if (!user.church) return acc;
          acc[user.church] = (acc[user.church] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const chartData = Object.keys(countsByChurch).map(churchName => ({
          name: churchName, users: countsByChurch[churchName]
        }));
        setChurchData(chartData);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const allContent = [
          ...newsItems.map((item: any) => ({ date: new Date(item.createdAt) })),
          ...eventItems.map((item: any) => ({ date: new Date(item.date) })),
        ];

        const currentMonthCount = allContent.filter((item) => {
          const itemDate = item.date;
          return itemDate instanceof Date && !Number.isNaN(itemDate.getTime()) &&
            itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
        }).length;

        const lastMonthCount = allContent.filter((item) => {
          const itemDate = item.date;
          return itemDate instanceof Date && !Number.isNaN(itemDate.getTime()) &&
            itemDate.getMonth() === lastMonth && itemDate.getFullYear() === lastMonthYear;
        }).length;

        let growthPercentage = 0;
        if (lastMonthCount > 0) {
          growthPercentage = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
        } else if (currentMonthCount > 0) {
          growthPercentage = 100;
        }

        setStats((prevStats) =>
          prevStats.map((stat) => {
            if (stat.id === 1) {
              return { ...stat, value: newsItems.length.toString() };
            }
            if (stat.id === 2) {
              return { ...stat, value: eventItems.length.toString() };
            }
            if (stat.id === 3) {
              return { ...stat, value: userCount.toString() };
            }
            if (stat.id === 4) {
              return { ...stat, value: `${growthPercentage >= 0 ? '+' : ''}${growthPercentage.toFixed(1)}%` };
            }
            return stat;
          })
        );

        const userChartData = Object.keys(countsByChurch).map(churchName => ({
          name: churchName,
          value: countsByChurch[churchName],
        }));
        setActivityData(userChartData);

        // Processar dados diários para o gráfico de barras horizontais
        const dailyCounts: { [date: string]: { news: number; events: number; users: number } } = {};

        const processItems = (items: any[], dateField: string, type: 'news' | 'events' | 'users') => {
          items.forEach(item => {
            const itemDate = new Date(item[dateField]);
            if (itemDate instanceof Date && !Number.isNaN(itemDate.getTime())) {
              const dateStr = itemDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
              if (!dailyCounts[dateStr]) {
                dailyCounts[dateStr] = { news: 0, events: 0, users: 0 };
              }
              dailyCounts[dateStr][type]++;
            }
          });
        };

        processItems(newsItems, 'createdAt', 'news');
        processItems(eventItems, 'date', 'events');
        processItems(users, 'createdAt', 'users');

        const sortedDates = Object.keys(dailyCounts).sort((a, b) => {
          // Ordenar por data para pegar os mais recentes
          const dateA = new Date(a.replace(/(\d{2}) de (\w{3})/, '$2 $1, ' + new Date().getFullYear()));
          const dateB = new Date(b.replace(/(\d{2}) de (\w{3})/, '$2 $1, ' + new Date().getFullYear()));
          return dateA.getTime() - dateB.getTime();
        });

        const last7Days = sortedDates.slice(-7);

        const combinedDailyData = last7Days.map(date => ({
          date,
          Notícias: dailyCounts[date].news,
          Eventos: dailyCounts[date].events,
          Utilizadores: dailyCounts[date].users,
        }));

        setDailyNewsData(combinedDailyData as any);

        // Processar dados para o gráfico de pizza de atividade semanal
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Dom) - 6 (Sáb)
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
        firstDayOfWeek.setHours(0, 0, 0, 0);

        const newsThisWeek = newsItems.filter((item: any) => new Date(item.createdAt) >= firstDayOfWeek).length;
        const eventsThisWeek = eventItems.filter((item: any) => {
          const eventDate = new Date(item.date);
          // A data do evento pode não ter hora, então comparamos apenas a data
          const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          return eventDateOnly >= firstDayOfWeek;
        }).length;
        const usersThisWeek = users.filter((user: any) => new Date(user.createdAt) >= firstDayOfWeek).length;

        setWeeklyActivityData([
          { name: 'Notícias', value: newsThisWeek },
          { name: 'Eventos', value: eventsThisWeek },
          { name: 'Utilizadores', value: usersThisWeek },
        ]);

      } catch (error) {
        console.error('Erro ao buscar dados para o dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
    fetchVerse();
  }, []);

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

      {/* Card de Versículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 md:col-span-2 min-h-48 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 border border-amber-500/20 rounded-3xl flex flex-col items-center justify-center p-4 text-center hover:border-amber-500/40 transition-all duration-300 shadow-xl shadow-amber-500/10">
          {loadingVerse ? (
            <div className="space-y-3">
              <BsBook className="text-slate-500 mx-auto animate-pulse" size={32} />
              <p className="text-slate-400 italic">Carregando versículo...</p>
            </div>
          ) : verse ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BsBook className="text-amber-400" size={24} />
                <h3 className="text-lg font-bold text-amber-400">Versículo do Dia</h3>
              </div>
              <p className="text-white text-lg leading-relaxed italic font-light">
                "{verse.text}"
              </p>
              <p className="text-amber-300 font-semibold text-sm pt-2">
                — {verse.reference}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <BsBook className="text-slate-500 mx-auto" size={32} />
              <p className="text-slate-400 italic">Erro ao carregar versículo</p>
            </div>
          )}
        </div>
      </div>

      {/* Novos Cards Horizontais */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Card 1: Gráfico de Barras - Utilizadores por Igreja */}
        <div className="lg:col-span-3 bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors duration-300 shadow-lg flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <BsPeople size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white">Utilizadores por Igreja</h4>
              <p className="text-sm text-slate-400 mt-1">Distribuição dos utilizadores registados.</p>
            </div>
          </div>
          <div className="flex-grow min-h-[200px] flex items-center justify-center">
            {loading ? (
              <p className="text-slate-400 text-sm italic">A carregar dados do gráfico...</p>
            ) : churchData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={churchData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                  <Bar dataKey="users" name="Utilizadores" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm italic">Sem dados de utilizadores para exibir.</p>
            )}
          </div>
        </div>
        {/* Card 2: Gráfico Circular - Atividades Recentes */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors duration-300 shadow-lg flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <BsPieChart size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white">Utilizadores por Igreja</h4>
              <p className="text-sm text-slate-400 mt-1">Distribuição de utilizadores no portal.</p>
            </div>
          </div>
          <div className="flex-grow min-h-[200px] flex items-center justify-center">
            {loading ? (
              <p className="text-slate-400 text-sm italic">A carregar dados do gráfico...</p>
            ) : activityData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={activityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm italic">Nenhum utilizador para exibir.</p>
            )}
          </div>
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras Horizontais - Crescimento de Notícias */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors duration-300 shadow-lg flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
              <BsGraphUp size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white">Atividade Diária</h4>
              <p className="text-sm text-slate-400 mt-1">Notícias, Eventos e Utilizadores nos últimos dias.</p>
            </div>
          </div>
          <div className="flex-grow min-h-[200px] flex items-center justify-center">
            {loading ? (
              <p className="text-slate-400 text-sm italic">A carregar dados...</p>
            ) : dailyNewsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyNewsData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} allowDecimals={false} />
                  <YAxis type="category" dataKey="date" stroke="#94a3b8" fontSize={10} width={40} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Notícias" stackId="a" fill="#22c55e" name="Notícias" barSize={12} />
                  <Bar dataKey="Eventos" stackId="a" fill="#3b82f6" name="Eventos" barSize={12} />
                  <Bar dataKey="Utilizadores" stackId="a" fill="#f59e0b" name="Utilizadores" barSize={12} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-sm italic">Sem dados de notícias para exibir.</p>}
          </div>
        </div>

        {/* Gráfico de Pizza - Atividade Semanal */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors duration-300 shadow-lg flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <BsPieChart size={20} />
            </div>
            <div>
              <h4 className="font-bold text-white">Atividade Semanal</h4>
              <p className="text-sm text-slate-400 mt-1">Novas publicações e registos na semana.</p>
            </div>
          </div>
          <div className="flex-grow min-h-[200px] flex items-center justify-center">
            {loading ? (
              <p className="text-slate-400 text-sm italic">A carregar dados...</p>
            ) : weeklyActivityData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={weeklyActivityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {weeklyActivityData.map((entry, index) => (
                      <Cell key={`cell-weekly-${index}`} fill={['#22c55e', '#3b82f6', '#f59e0b'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-slate-400 text-sm italic">Sem atividade esta semana.</p>}
          </div>
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-purple-500/20 transition-all duration-300 shadow-lg flex flex-col items-start gap-4">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <BsRocketTakeoff size={20} />
          </div>
          <h4 className="font-bold text-white">Gerir Projetos</h4>
          <p className="text-sm text-slate-400 flex-grow">Acesse a área de projetos para acompanhar o andamento das iniciativas da comunidade.</p>
          <button className="mt-auto text-xs font-bold text-purple-400 hover:text-white transition-colors">Ver Projetos →</button>
        </div>

        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/20 transition-all duration-300 shadow-lg flex flex-col items-start gap-4">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
            <BsBook size={20} />
          </div>
          <h4 className="font-bold text-white">Ver Documentação</h4>
          <p className="text-sm text-slate-400 flex-grow">Consulte guias e documentos importantes para a gestão do portal e das atividades.</p>
          <button className="mt-auto text-xs font-bold text-cyan-400 hover:text-white transition-colors">Acessar Documentos →</button>
        </div>

        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300 shadow-lg flex flex-col items-start gap-4">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <BsQuestionCircle size={20} />
          </div>
          <h4 className="font-bold text-white">Central de Ajuda</h4>
          <p className="text-sm text-slate-400 flex-grow">Precisa de suporte? Encontre respostas para as suas dúvidas na nossa central de ajuda.</p>
          <button className="mt-auto text-xs font-bold text-amber-400 hover:text-white transition-colors">Obter Ajuda →</button>
        </div>
      </div>

    </div>
  );
}