import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const CONFIG = {
  success: { icon: CheckCircle, bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  error:   { icon: XCircle,     bg: 'bg-red-500/10 border-red-500/30',          text: 'text-red-400',     bar: 'bg-red-500' },
  warning: { icon: AlertTriangle,bg:'bg-yellow-500/10 border-yellow-500/30',    text: 'text-yellow-400',  bar: 'bg-yellow-500' },
  info:    { icon: Info,         bg: 'bg-blue-500/10 border-blue-500/30',        text: 'text-blue-400',    bar: 'bg-blue-500' },
};

function Toast({ toast, onRemove }) {
  const c = CONFIG[toast.type] || CONFIG.info;
  const Icon = c.icon;

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/40 w-80 relative overflow-hidden',
        c.bg
      )}
    >
      {/* Progress bar */}
      <motion.div
        className={cn('absolute bottom-0 left-0 h-0.5', c.bar)}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
      />
      <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', c.text)} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className={cn('text-sm font-bold', c.text)}>{toast.title}</p>}
        <p className="text-xs text-slate-300 leading-snug">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)}
        className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
