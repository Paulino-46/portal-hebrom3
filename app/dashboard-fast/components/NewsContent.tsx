import React from "react";
import { NewsIcon } from "./Icons";

interface NewsContentProps {
  newsCount: number;
}

export function NewsContent({ newsCount }: NewsContentProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">Notícias</p>
        <p className="text-2xl font-bold text-white mt-1">{newsCount}</p>
        <p className="text-xs text-slate-500">Novas Notícias</p>
      </div>
      <div className="text-blue-400 text-3xl"><NewsIcon /></div>
    </div>
  );
}