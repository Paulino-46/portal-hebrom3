import React from "react";
import { TicketIcon } from "./Icons";

interface EventsContentProps {
  eventsCount: number;
}

export function EventsContent({ eventsCount }: EventsContentProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">Eventos</p>
        <p className="text-2xl font-bold text-white mt-1">{eventsCount}</p>
        <p className="text-xs text-slate-500">Próximos Eventos</p>
      </div>
      <div className="text-orange-400 text-3xl"><TicketIcon /></div>
    </div>
  );
}