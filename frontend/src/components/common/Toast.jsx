import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border bg-white animate-in slide-in-from-bottom-5 duration-200">
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
      )}
      <div className="text-sm font-medium text-slate-800 pr-2 max-w-sm">
        {toast.message}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
