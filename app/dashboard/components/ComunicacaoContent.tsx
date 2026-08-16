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

type Message = {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  verse?: {
    reference: string;
    text: string;
    source?: string;
  };
};

export default function ComunicacaoContent() {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Olá! Sou o assistente virtual da comunidade Hebrom. Posso responder sobre cultos, eventos, notícias, Bíblia, doutrina adventista e temas do cristianismo.',
      timestamp: 'Sistema Ativo',
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: query, timestamp: 'Enviado' };
    const currentQuery = query;

    setMessages(prev => [...prev, userMessage, { role: 'ai', content: '', timestamp: 'Pensando...' }]);
    setQuery('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentQuery, conversationId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Não foi possível processar a mensagem.');
      }

      if (data?.conversationId) {
        setConversationId(data.conversationId);
      }

      const answer = data?.answer || 'Não consegui encontrar uma resposta adequada para sua pergunta no momento.';
      const verse = data?.verse;

      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'ai', content: answer, timestamp: 'Gerado agora', verse },
      ]);
    } catch (error) {
      const fallbackMessage = 'Posso responder apenas sobre a igreja adventista, a Bíblia e assuntos do cristianismo. Tente formular uma pergunta sobre eventos, notícias, cultos, estudos bíblicos ou doutrina.';

      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'ai', content: fallbackMessage, timestamp: 'Erro' },
      ]);
      console.error('Erro ao consultar o agente:', error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
    { text: 'Qual o versículo do dia?', icon: <BsBook /> },
    { text: 'Quais são os próximos eventos da igreja?', icon: <BsCalendarEvent /> },
    { text: 'Resuma as últimas notícias da comunidade', icon: <BsLightbulb /> },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#050b14] px-4 pb-4 pt-5 sm:px-6 lg:px-8">
      <div className="mb-4 rounded-[22px] border border-[#1b2635] bg-[#0d141d]/90 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a2434] text-[#7bc4ff] shadow-[0_0_20px_rgba(77,146,255,0.2)]">
              <BsChatSquareQuote size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Assistente da Comunidade</h2>
              <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8ea4bf]">
                <span className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                Online
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-[24px] border border-[#1a2534] bg-[#0a111a]/90 px-3 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.01)]">
        <div className="space-y-4 pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.2s_ease-out]`}
            >
              <div className={`max-w-[85%] md:max-w-[72%]`}>
                <div
                  className={`rounded-[20px] border px-4 py-3 ${
                    msg.role === 'user'
                      ? 'border-[#1e4fb8]/50 bg-[#152c62]/70 text-white shadow-[0_8px_24px_rgba(33,91,214,0.28)]'
                      : 'border-[#243548] bg-[#111c29]/90 text-slate-100 shadow-[0_8px_24px_rgba(0,0,0,0.25)]'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-inherit">{msg.content}</p>

                  {msg.role === 'ai' && msg.verse && (
                    <div className="mt-3 rounded-xl border border-[#2a3d57] bg-[#0d1725] p-3 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ab9ff]">
                        Versículo sugerido
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#dfeeff]">{msg.verse.reference}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-200">“{msg.verse.text}”</p>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400">
                      {msg.timestamp}
                    </span>
                    {msg.role === 'ai' && msg.content && !msg.content.endsWith('▌') && (
                      <div className="flex items-center gap-2 text-[#7bc4ff]">
                        <BsMagic size={11} title="Refinar" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              title={s.text}
              onClick={() => setQuery(s.text)}
              className="flex items-center gap-2 rounded-full border border-[#243548] bg-[#0d1723] px-3 py-1.5 text-[10px] font-medium text-slate-300 transition-all hover:border-[#335b91] hover:bg-[#10213a] hover:text-[#bfe2ff]"
            >
              <span className="text-[#76b7ff]">{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="group relative">
          <div className="absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_left,_rgba(78,128,255,0.18),transparent_55%)] opacity-0 blur-xl transition-opacity duration-200 group-focus-within:opacity-100" />
          <div className="relative flex items-center gap-2 rounded-[20px] border border-[#233245] bg-[#0b131d] px-2 py-2 shadow-[0_8px_22px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#101b2a] text-[#9ecbff]">
              <BsStars size={16} className={isTyping ? 'animate-pulse' : ''} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isTyping ? 'Aguarde um momento...' : 'Pergunte algo ao assistente...'}
              disabled={isTyping}
              className="flex-1 border-none bg-transparent px-2 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={!query.trim() || isTyping}
              aria-label="Enviar pergunta"
              title="Enviar pergunta"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1d4ed8] text-white shadow-[0_6px_18px_rgba(59,130,246,0.4)] transition-all hover:bg-[#255ae0] disabled:cursor-not-allowed disabled:bg-[#1a2434] disabled:text-slate-500 disabled:shadow-none"
            >
              <BsSend size={17} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}