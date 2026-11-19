import React from 'react';
import { RefreshCw, Plus, Menu } from 'lucide-react';

export default function Navbar({ title, onRefresh, onNewOrder, stats, onMenuClick }) {
  return (
    <header className="h-14 sm:h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-sm/50 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger – mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors -ml-1"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight truncate">{title}</h2>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Online
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onNewOrder && (
          <button
            onClick={onNewOrder}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Purchase Order</span>
            <span className="sm:hidden">New Order</span>
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
