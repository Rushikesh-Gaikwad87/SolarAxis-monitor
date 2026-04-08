import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Sun, Wifi, Users, AlertTriangle, Settings,
  Search, ChevronRight, Zap, Bell, Plus, MapPin, RefreshCw, LogOut
} from 'lucide-react';
import { PLANTS, ALERTS, CUSTOMERS } from '../data/mockData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard',       icon:LayoutDashboard, hint:'Performance Overview' },
  { id:'plants',    label:'Solar Plants',    icon:Sun,             hint:'Manage all solar plants' },
  { id:'inverters', label:'Inverter Connect',icon:Wifi,            hint:'Modbus TCP connections' },
  { id:'customers', label:'Customers',       icon:Users,           hint:'Customer accounts' },
  { id:'alerts',    label:'Smart Alerts',    icon:AlertTriangle,   hint:'Active alerts and notifications' },
  { id:'settings',  label:'System Config',   icon:Settings,        hint:'App settings & API keys' },
];

const ACTIONS = [
  { label:'Add New Plant',    hint:'Create a plant record',  cmd:'add-plant',    icon:Plus },
  { label:'Add Customer',     hint:'Register new customer',  cmd:'add-customer', icon:Plus },
  { label:'Force Sync',       hint:'Refresh all inverters',  cmd:'sync',         icon:RefreshCw },
  { label:'View Live Power',  hint:'Real-time generation',   cmd:'dashboard',    icon:Zap },
  { label:'Sign Out',         hint:'Log out of portal',      cmd:'logout',       icon:LogOut },
];

export default function CommandPalette({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open ? onClose() : null;
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const q = query.toLowerCase();

  const matchedPages = NAV_ITEMS.filter(n =>
    n.label.toLowerCase().includes(q) || n.hint.toLowerCase().includes(q)
  );
  const matchedActions = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q)
  );
  const matchedPlants = PLANTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
  ).slice(0, 3);
  const matchedCustomers = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  ).slice(0, 3);

  const hasResults = matchedPages.length + matchedActions.length + matchedPlants.length + matchedCustomers.length > 0;

  const handleSelect = (item) => {
    if (item.type === 'page') onNavigate(item.id);
    if (item.type === 'plant') onNavigate('plants');
    if (item.type === 'customer') onNavigate('customers');
    if (item.type === 'action') {
      if (item.cmd === 'dashboard') onNavigate('dashboard');
      if (item.cmd === 'sync') { /* trigger sync toast */ }
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[201] px-4"
          >
            <div className="bg-[#0d1b33] border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
                <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search pages, plants, customers, actions..."
                  className="flex-1 bg-transparent text-slate-100 text-sm placeholder-slate-600 outline-none"
                />
                <kbd className="text-[10px] font-mono bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-md">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-0.5">
                {!hasResults && (
                  <div className="text-center py-8 text-slate-600 text-sm">No results for "{query}"</div>
                )}

                {matchedPages.length > 0 && (
                  <Group label="Pages">
                    {matchedPages.map(n => (
                      <ResultRow key={n.id} icon={n.icon} label={n.label} hint={n.hint}
                        onClick={() => handleSelect({ type:'page', id:n.id })} />
                    ))}
                  </Group>
                )}

                {matchedPlants.length > 0 && (
                  <Group label="Plants">
                    {matchedPlants.map(p => (
                      <ResultRow key={p.id} icon={Sun} label={p.name} hint={`${p.location} · ${p.capacity} kW`}
                        badge={p.status} onClick={() => handleSelect({ type:'plant' })} />
                    ))}
                  </Group>
                )}

                {matchedCustomers.length > 0 && (
                  <Group label="Customers">
                    {matchedCustomers.map(c => (
                      <ResultRow key={c.id} icon={Users} label={c.name} hint={c.email}
                        onClick={() => handleSelect({ type:'customer' })} />
                    ))}
                  </Group>
                )}

                {matchedActions.length > 0 && (
                  <Group label="Actions">
                    {matchedActions.map(a => (
                      <ResultRow key={a.cmd} icon={a.icon} label={a.label} hint={a.hint}
                        onClick={() => handleSelect({ type:'action', cmd:a.cmd })} />
                    ))}
                  </Group>
                )}
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 border-t border-slate-800 text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="bg-slate-800 px-1 rounded">Ctrl+K</kbd> toggle</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Group({ label, children }) {
  return (
    <div className="mb-1">
      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 py-1.5">{label}</p>
      {children}
    </div>
  );
}

function ResultRow({ icon: Icon, label, hint, badge, onClick }) {
  const badgeColor = badge === 'online' ? 'text-emerald-400' : badge === 'fault' ? 'text-red-400' : 'text-slate-500';
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors group">
      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-200 truncate">{label}</p>
        {hint && <p className="text-[11px] text-slate-500 truncate">{hint}</p>}
      </div>
      {badge && <span className={cn('text-[9px] font-bold capitalize', badgeColor)}>{badge}</span>}
      <ChevronRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition-colors" />
    </button>
  );
}
