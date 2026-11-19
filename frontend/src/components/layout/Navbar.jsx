import React from 'react';
import { RefreshCw, CheckCircle, Database, Plus } from 'lucide-react';

export default function Navbar({ title, onRefresh, onNewOrder, stats }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-sm/50">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onNewOrder && (
          <button
            onClick={onNewOrder}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Order</span>
          </button>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
