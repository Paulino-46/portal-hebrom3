import React from "react";
import { ShopIcon } from "./Icons";

export function ShopContent() {
  return (
    <div className="rounded-2xl bg-slate-900 p-5 shadow-lg shadow-slate-950/30 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">Vitrine</p>
        <p className="text-2xl font-bold text-white mt-1">25</p> {/* Placeholder */}
        <p className="text-xs text-slate-500">Produtos em Destaque</p>
      </div>
      <div className="text-purple-400 text-3xl">
        <ShopIcon />
      </div>
    </div>
  );
}