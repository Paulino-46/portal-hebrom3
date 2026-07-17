'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BsChatSquareQuote,
  BsSend,
  BsMagic,
  BsLightbulb,
  BsBook,
  BsCalendarEvent,
  BsStars,
} from 'react-icons/bs';

export default function ComunicacaoContent() {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Olá! Sou o assistente virtual da comunidade Hebrom. Como posso te ajudar hoje?',
      timestamp: 'Sistema Ativo',
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Simula o efeito de "streaming" da resposta da IA
  const simulateAIResponse = (userText: string) => {
    setIsTyping(true);

    let mockResponse = 'Desculpe, não entendi a sua pergunta. Poderia tentar de outra forma?';

    if (/versículo/i.test(userText)) {
      mockResponse = 'O versículo para meditação de hoje é: "O Senhor é o meu pastor; de nada terei falta." - Salmos 23:1. Que esta promessa traga paz ao seu coração.';
    } else if (/eventos/i.test(userText)) {
      mockResponse = 'Os próximos eventos são a "Semana de Oração Jovem" de 14 a 21 de Julho e o "Congresso Distrital" no dia 27 de Julho. Você pode ver mais detalhes na seção de Cronograma.';
    } else if (/notícias/i.test(userText)) {
      mockResponse = 'As últimas notícias incluem o sucesso da campanha de doação de alimentos e os preparativos para o nosso próximo projeto missionário. Visite a página de Notícias para ler os artigos completos!';
    } else if (/ajuda|suporte/i.test(userText)) {
      mockResponse = 'Estou aqui para ajudar! Você pode me perguntar sobre os horários dos cultos, próximos eventos, notícias ou pedir um versículo para reflexão. Se precisar de ajuda técnica, por favor, acesse a Central de Ajuda.';
    }

    let currentText = '';
    const tokens = mockResponse.split(' ');
    let i = 0;

    const interval = setInterval(() => {
      if (i < tokens.length) {
        currentText += (i === 0 ? '' : ' ') + tokens[i];
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'ai', content: currentText + ' ▌', timestamp: 'Digitando...' },
        ]);
        i++;
      } else {
        clearInterval(interval);
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'ai', content: mockResponse, timestamp: 'Gerado agora' },
        ]);
        setIsTyping(false);
      }
    }, 50);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userMessage = { role: 'user', content: query, timestamp: 'Enviado' };
    setMessages(prev => [...prev, userMessage, { role: 'ai', content: '', timestamp: 'Pensando...' }]);

    const currentQuery = query;
    setQuery('');
    simulateAIResponse(currentQuery);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
    { text: "Qual o versículo do dia?", icon: <BsBook /> },
    { text: "Próximos eventos da igreja?", icon: <BsCalendarEvent /> },
    { text: "Resumo das últimas notícias", icon: <BsLightbulb /> },
  ];

  return (
    <div className="pt-4 px-4 pb-0 sm:pt-8 sm:px-8 sm:pb-0 h-[calc(100vh-64px)] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header Informativo */}
      <div className="flex items-center justify-between bg-slate-900/40 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
            <BsChatSquareQuote size={24} />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight">Assistente da Comunidade</h2>
            <p className="text-[10px] text-blue-500/60 font-mono uppercase tracking-widest flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online e pronto para ajudar
            </p>
          </div>
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar 
        [&::-webkit-scrollbar]:w-2 
        [&::-webkit-scrollbar-track]:bg-transparent 
        [&::-webkit-scrollbar-thumb]:bg-slate-950 
        [&::-webkit-scrollbar-thumb]:rounded-full
        [scrollbar-width:thin] 
        [scrollbar-color:theme(colors.slate.950)_transparent]"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] group relative`}>
              <div className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${msg.role === 'user'
                  ? 'bg-blue-600/20 border-blue-500/30 text-white rounded-tr-none'
                  : 'bg-slate-900/60 border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                <p className={`text-sm leading-relaxed ${msg.role === 'ai' ? 'font-light' : 'font-medium'}`}>
                  {msg.content}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
                    {msg.timestamp}
                  </span>
                  {msg.role === 'ai' && msg.content && !msg.content.endsWith('▌') && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <BsMagic className="text-cyan-500 cursor-pointer hover:scale-110" size={12} title="Refinar" />
                    </div>
                  )}
                </div>
              </div>
              {msg.role === 'ai' && <div className="absolute -left-2 top-0 w-1 h-full bg-blue-500/50 blur-sm rounded-full" />}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Sugestões e Input */}
      <div className="space-y-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              title={s.text}
              onClick={() => { setQuery(s.text); }}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center gap-2"
            >
              {s.icon} {s.text}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-slate-900 border border-white/20 rounded-2xl p-2 backdrop-blur-2xl">
            <div className="pl-4 text-slate-500">
              <BsStars size={20} className={isTyping ? 'animate-pulse' : ''} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isTyping ? "Aguarde um momento..." : "Pergunte algo ao assistente..."}
              disabled={isTyping}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-white placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping}
              aria-label="Enviar pergunta"
              title="Enviar pergunta"
              className="h-10 w-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
            >
              <BsSend size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}