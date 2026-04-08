import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Sun, Users, RefreshCw, Download, BarChart3,
  Wifi, Bell, HelpCircle, Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const QUICK_ACTIONS = [
  { icon: Sun,      label: 'Add Plant',     color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20', action: 'add-plant' },
  { icon: Users,    label: 'Add Customer',  color: 'bg-blue-500/15 text-blue-400 border-blue-500/20',       action: 'add-customer' },
  { icon: RefreshCw,label: 'Force Sync',    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', action: 'sync' },
  { icon: Download, label: 'Export Data',   color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20', action: 'export' },
  { icon: BarChart3,label: 'Reports',       color: 'bg-purple-500/15 text-purple-400 border-purple-500/20', action: 'reports' },
  { icon: Wifi,     label: 'Add Inverter',  color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',       action: 'inverter' },
];

export default function QuickActionsButton({ onNavigate, onShowToast }) {
  const [open, setOpen] = useState(false);

  const handle = (action) => {
    setOpen(false);
    if (action === 'sync') {
      onShowToast({ message: 'Force sync initiated for all inverters…', type: 'info' });
    } else if (action === 'export') {
      onShowToast({ message: 'Data export started — CSV downloading…', type: 'success' });
    } else if (action === 'reports') {
      onShowToast({ message: 'Generating monthly report…', type: 'info' });
    } else if (action === 'add-plant') {
      onNavigate('plants');
    } else if (action === 'add-customer') {
      onNavigate('customers');
    } else if (action === 'inverter') {
      onNavigate('inverters');
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-[150] flex flex-col items-end gap-3">
      {/* Action Items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-2 items-end"
          >
            {QUICK_ACTIONS.map((a, i) => (
              <motion.button
                key={a.action}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handle(a.action)}
                className={cn(
                  'flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-lg transition-all active:scale-95',
                  a.color, 'bg-opacity-90 hover:scale-105'
                )}
              >
                <a.icon className="w-4 h-4" />
                <span className="text-xs font-bold whitespace-nowrap">{a.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(p => !p)}
        className="w-13 h-13 w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center transition-colors relative"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
