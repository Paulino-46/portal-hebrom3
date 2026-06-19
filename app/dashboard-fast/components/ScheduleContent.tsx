import React from "react";
import { CalendarIcon } from "./Icons";

export function ScheduleContent() {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">Cronograma</p>
        <p className="text-2xl font-bold text-white mt-1">7</p> {/* Placeholder */}
        <p className="text-xs text-slate-500">Atividades da Semana</p>
      </div>
      <div className="text-green-400 text-3xl">
        <CalendarIcon />
      </div>
    </div>
  );
}