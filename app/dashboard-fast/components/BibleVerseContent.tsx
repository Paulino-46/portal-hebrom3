import React from "react";

interface BibleVerse {
  reference: string;
  text: string;
}

interface BibleVerseContentProps {
  bibleVerse: BibleVerse | null;
}

export function BibleVerseContent({ bibleVerse }: BibleVerseContentProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-8 shadow-lg shadow-slate-950/30 text-center flex flex-col justify-center items-center">
      {bibleVerse ? (
        <>
          <p className="text-xl font-semibold text-white leading-relaxed mb-4">"{bibleVerse.text}"</p>
          <p className="text-sm text-purple-200 font-medium">- {bibleVerse.reference}</p>
        </>
      ) : (
        <p className="text-lg text-red-300">Não foi possível carregar o versículo bíblico. Tente novamente mais tarde.</p>
      )}
    </div>
  );
}