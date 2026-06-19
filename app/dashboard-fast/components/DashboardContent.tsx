import prisma from "../../../repositories/prisma";
import { NewsContent } from "./NewsContent";
import { EventsContent } from "./EventsContent";
import { ScheduleContent } from "./ScheduleContent";
import { ShopContent } from "./ShopContent";
import { BibleVerseContent } from "./BibleVerseContent";

interface BibleVerse {
  reference: string;
  text: string;
}

async function getRandomBibleVerse(): Promise<BibleVerse | null> {
  try {
    const passages = [
      "João 3:16", "Salmos 23:1", "Filipenses 4:13", "Isaías 41:10",
      "Josué 1:9", "Mateus 11:28", "Romanos 8:28", "Jeremias 29:11",
      "Salmos 46:1", "Mateus 6:33", "1 Coríntios 13:4", "Provérbios 3:5"
    ];
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(randomPassage)}?translation=almeida`);

    if (!response.ok) return null;

    const data: any = await response.json();
    return { reference: data.reference, text: data.text.trim() };
  } catch (error) {
    console.error("Erro ao buscar versículo bíblico:", error);
    return null;
  }
}

export default async function DashboardContent({ view }: { view?: string }) {
  const bibleVerse = await getRandomBibleVerse();

  const [newsCount, eventsCount] = await Promise.all([
    prisma!.news.count().catch(() => 0),
    prisma!.event.count().catch(() => 0),
  ]);

  // Lógica de renderização condicional baseada no item clicado na Sidebar
  const renderContent = () => {
    switch (view) {
      case "news":
        return <div className="animate-in fade-in duration-500"><NewsContent newsCount={newsCount} /></div>;
      case "events":
        return <div className="animate-in fade-in duration-500"><EventsContent eventsCount={eventsCount} /></div>;
      case "schedule":
        return <div className="animate-in fade-in duration-500"><ScheduleContent /></div>;
      case "vitrine":
        return <div className="animate-in fade-in duration-500"><ShopContent /></div>;
      case "verse":
        return <div className="animate-in fade-in duration-500"><BibleVerseContent bibleVerse={bibleVerse} /></div>;
      default:
        return (
          <>
            {/* Visão Geral (Painel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <NewsContent newsCount={newsCount} />
              <EventsContent eventsCount={eventsCount} />
              <ScheduleContent />
              <ShopContent />
            </div>

            <div className="grid grid-cols-1">
              <BibleVerseContent bibleVerse={bibleVerse} />
            </div>
          </>
        );
    }
  };

  return (
    <div className="px-6 py-8">
      {renderContent()}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
}