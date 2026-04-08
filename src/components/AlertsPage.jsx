import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Bell, CheckCircle, XCircle, Clock, Filter,
  WifiOff, Zap, TrendingDown, Wrench, CloudRain, X, ChevronDown
} from 'lucide-react';
import { ALERTS } from '../data/mockData';
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const TYPE_CONFIG = {
  fault:    { icon: XCircle,     label:'Fault',          bg:'bg-red-500/10',    border:'border-red-500/20',    text:'text-red-400'    },
  offline:  { icon: WifiOff,     label:'Offline',        bg:'bg-slate-500/10',  border:'border-slate-500/20',  text:'text-slate-400'  },
  zero_gen: { icon: Zap,         label:'Zero Gen',       bg:'bg-orange-500/10', border:'border-orange-500/20', text:'text-orange-400' },
  low_gen:  { icon: TrendingDown,label:'Low Gen',        bg:'bg-yellow-500/10', border:'border-yellow-500/20', text:'text-yellow-400' },
  amc:      { icon: Wrench,      label:'AMC Due',        bg:'bg-blue-500/10',   border:'border-blue-500/20',   text:'text-blue-400'   },
  weather:  { icon: CloudRain,   label:'Weather',        bg:'bg-cyan-500/10',   border:'border-cyan-500/20',   text:'text-cyan-400'   },
};

const SEV_CONFIG = {
  critical: { badge:'bg-red-500/10 text-red-400 border-red-500/20', dot:'bg-red-500' },
  warning:  { badge:'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot:'bg-yellow-500' },
  info:     { badge:'bg-blue-500/10 text-blue-400 border-blue-500/20', dot:'bg-blue-400' },
};

function AlertCard({ alert, onResolve, onDismiss }) {
  const tc = TYPE_CONFIG[alert.type] || TYPE_CONFIG.fault;
  const sc = SEV_CONFIG[alert.severity];
  const Icon = tc.icon;

  return (
    <motion.div layout initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20, height:0}}
      className={cn('flex items-start gap-4 p-4 rounded-2xl border transition-all', tc.bg, tc.border, alert.resolved && 'opacity-40')}>
      <div className={cn('p-2.5 rounded-xl flex-shrink-0', tc.bg)}>
        <Icon className={cn('w-4 h-4', tc.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
          <div>
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border mr-2', sc.badge, 'border')}>
              {alert.severity}
            </span>
            <span className="text-[10px] text-slate-500">{alert.time}</span>
          </div>
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', tc.bg, tc.border, tc.text)}>
            {tc.label}
          </span>
        </div>
        <p className="text-sm font-semibold text-slate-100">{alert.plant}</p>
        <p className="text-xs text-slate-500 mt-0.5">{alert.message}</p>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        {!alert.resolved && (
          <button onClick={() => onResolve(alert.id)}
            className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
            title="Mark resolved">
            <CheckCircle className="w-3.5 h-3.5"/>
          </button>
        )}
        <button onClick={() => onDismiss(alert.id)}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          title="Dismiss">
          <X className="w-3.5 h-3.5"/>
        </button>
      </div>
    </motion.div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [filter, setFilter] = useState('all');

  const resolve = id => setAlerts(a => a.map(x => x.id===id ? {...x, resolved:true} : x));
  const dismiss = id => setAlerts(a => a.filter(x => x.id!==id));

  const active = alerts.filter(a => !a.resolved);
  const resolved = alerts.filter(a => a.resolved);

  const filtered = alerts.filter(a => {
    if (filter === 'active') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    if (['critical','warning','info'].includes(filter)) return a.severity === filter;
    return true;
  });

  const critCount = active.filter(a=>a.severity==='critical').length;
  const warnCount = active.filter(a=>a.severity==='warning').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400"/>Smart Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{active.length} active · {resolved.length} resolved</p>
        </div>
        <button onClick={()=>setAlerts(a=>a.map(x=>({...x,resolved:true})))}
          className="text-xs text-slate-500 hover:text-emerald-400 border border-slate-800 px-3 py-2 rounded-xl transition-colors flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5"/> Resolve All
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Critical', v:critCount, bg:'bg-red-500/10 border-red-500/20', t:'text-red-400' },
          { label:'Warnings', v:warnCount, bg:'bg-yellow-500/10 border-yellow-500/20', t:'text-yellow-400' },
          { label:'Informational', v:active.filter(a=>a.severity==='info').length, bg:'bg-blue-500/10 border-blue-500/20', t:'text-blue-400' },
          { label:'Resolved', v:resolved.length, bg:'bg-emerald-500/10 border-emerald-500/20', t:'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-2xl border p-4', s.bg)}>
            <p className={cn('text-3xl font-bold', s.t)}>{s.v}</p>
            <p className="text-[11px] text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all','active','resolved','critical','warning','info'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all',
              filter===f ? 'bg-blue-600 text-white' : 'bg-[#0b1628] border border-slate-800 text-slate-400 hover:border-slate-700')}>
            {f}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-20"/>
              <p className="font-semibold">No alerts in this category</p>
            </div>
          ) : (
            filtered.map(a => (
              <AlertCard key={a.id} alert={a} onResolve={resolve} onDismiss={dismiss}/>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Alert Rules Info */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400"/>Auto Alert Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { rule: 'No data > 1 hour', trigger: 'Inverter Offline Alert', icon: WifiOff, c:'text-slate-400' },
            { rule: 'Power = 0 (6AM–6PM)', trigger: 'Zero Generation Alert', icon: Zap, c:'text-orange-400' },
            { rule: 'Gen < 80% of expected', trigger: 'Low Generation Alert', icon: TrendingDown, c:'text-yellow-400' },
            { rule: 'Fault register ≠ 0', trigger: 'Fault Code Alert', icon: XCircle, c:'text-red-400' },
            { rule: 'Rain/storm forecast', trigger: 'Weather Alert', icon: CloudRain, c:'text-cyan-400' },
            { rule: 'AMC due < 7 days', trigger: 'Maintenance Alert', icon: Wrench, c:'text-blue-400' },
          ].map(r => (
            <div key={r.rule} className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-xl">
              <r.icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', r.c)}/>
              <div>
                <p className="text-xs font-semibold text-slate-200">{r.trigger}</p>
                <p className="text-[10px] text-slate-500">{r.rule}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
