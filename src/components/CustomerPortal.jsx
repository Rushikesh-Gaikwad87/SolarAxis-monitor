import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Zap, Leaf, TrendingUp, AlertTriangle, CheckCircle,
  FileText, Download, Bell, Star, Lock, ChevronRight, X,
  BarChart2, Wrench, CloudRain, Wind, Thermometer, Droplets,
  Shield, Wifi, MessageSquare, BrainCircuit, LogOut, Sparkles,
  ArrowUpRight, Battery, Clock, Info, Phone, PhoneCall, AlertOctagon,
  Palette
} from 'lucide-react';
import ThemeSwitcher, { THEMES } from './ThemeSwitcher';

// ── tiny helpers ──────────────────────────────────────────────────────────────
function cn(...classes) { return classes.filter(Boolean).join(' '); }

// animated counter
function useCounter(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ── UPGRADE MODAL ─────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: '/mo',
    color: 'slate',
    features: [
      { label: '6-month energy history', ok: true },
      { label: 'Basic alerts (email)', ok: true },
      { label: 'Monthly PDF report', ok: true },
      { label: 'AI Fault Diagnostics', ok: false },
      { label: 'WhatsApp / SMS alerts', ok: false },
      { label: 'Full history (unlimited)', ok: false },
      { label: 'Priority support (24h)', ok: false },
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/year',
    color: 'blue',
    badge: '🔥 Best Value',
    features: [
      { label: '6-month energy history', ok: true },
      { label: 'Basic alerts (email)', ok: true },
      { label: 'Monthly PDF report', ok: true },
      { label: 'AI Fault Diagnostics', ok: true },
      { label: 'WhatsApp / SMS alerts', ok: true },
      { label: 'Full history (unlimited)', ok: true },
      { label: 'Priority support (24h)', ok: true },
    ],
    cta: 'Start 14-day Free Trial',
    disabled: false,
    savings: 'Save ₹700 vs monthly',
  },

];

function UpgradeModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-xl bg-[#0b1628] border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">Upgrade Your Plan</h2>
                </div>
                <p className="text-slate-400 text-sm">Unlock powerful features to maximize your solar ROI</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLANS.map((plan) => (
                <div key={plan.name}
                  className={cn(
                    'rounded-2xl border p-5 flex flex-col relative',
                    plan.color === 'blue' ? 'border-blue-500/60 bg-blue-600/8 shadow-lg shadow-blue-500/10' :
                    plan.color === 'purple' ? 'border-purple-500/40 bg-purple-600/5' :
                    'border-slate-700/50 bg-slate-800/20'
                  )}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {plan.badge}
                    </span>
                  )}
                  <p className={cn('text-xs font-bold uppercase tracking-widest mb-1',
                    plan.color === 'blue' ? 'text-blue-400' : plan.color === 'purple' ? 'text-purple-400' : 'text-slate-500'
                  )}>{plan.name}</p>
                  <div className="flex items-end gap-0.5 mb-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-[10px] text-green-400 font-bold mb-3 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {plan.savings}
                    </p>
                  )}
                  <ul className="space-y-2 flex-1 mb-5 mt-3">
                    {plan.features.map(f => (
                      <li key={f.label} className={cn('flex items-center gap-2 text-xs', f.ok ? 'text-slate-300' : 'text-slate-600')}>
                        {f.ok
                          ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                          : <X className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />}
                        {f.label}
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled={plan.disabled}
                    className={cn(
                      'w-full py-2.5 rounded-xl text-sm font-bold transition-all',
                      plan.disabled ? 'bg-slate-800 text-slate-600 cursor-not-allowed' :
                      plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-[0.97]' :
                      'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 active:scale-[0.97]'
                    )}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'blue', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className={cn(
        'rounded-2xl p-5 border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300',
        color === 'blue' ? 'bg-blue-600/8 border-blue-500/20' :
        color === 'green' ? 'bg-green-600/8 border-green-500/20' :
        color === 'amber' ? 'bg-amber-600/8 border-amber-500/20' :
        color === 'purple' ? 'bg-purple-600/8 border-purple-500/20' :
        'bg-slate-800/30 border-slate-700/30'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3',
        color === 'blue' ? 'bg-blue-500/15' : color === 'green' ? 'bg-green-500/15' :
        color === 'amber' ? 'bg-amber-500/15' : color === 'purple' ? 'bg-purple-500/15' : 'bg-slate-700/50'
      )}>
        <Icon className={cn('w-5 h-5',
          color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' :
          color === 'amber' ? 'text-amber-400' : color === 'purple' ? 'text-purple-400' : 'text-slate-400'
        )} />
      </div>
      <p className="text-2xl font-black text-white mb-0.5">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-1">{sub}</p>}
    </motion.div>
  );
}

// ── POWER GAUGE ───────────────────────────────────────────────────────────────
function PowerGauge({ kw = 5.6, maxKw = 10 }) {
  const pct = Math.min(kw / maxKw, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ * 0.75; // 270° arc
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Track */}
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform="rotate(135 70 70)" />
        {/* Fill */}
        <circle cx="70" cy="70" r={r} fill="none"
          stroke="url(#gaugeGrad)" strokeWidth="12"
          strokeDasharray={`${animated ? dash : 0} ${circ}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform="rotate(135 70 70)"
          style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <text x="70" y="64" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="system-ui">{kw}</text>
        <text x="70" y="80" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui">kW Live</text>
        <text x="70" y="97" textAnchor="middle" fill="#22d3ee" fontSize="9" fontFamily="system-ui">● Online</text>
      </svg>
    </div>
  );
}

// ── MINI BAR CHART ────────────────────────────────────────────────────────────
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const GEN_DATA = [480, 520, 390, 610, 710, 650]; // kWh
const maxGen = Math.max(...GEN_DATA);

function MiniBarChart() {
  return (
    <div className="flex items-end gap-2 h-24 pt-2">
      {GEN_DATA.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }} animate={{ height: `${(v / maxGen) * 100}%` }}
            transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring', damping: 18 }}
            className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 min-h-[4px]"
          />
          <span className="text-[9px] text-slate-600 font-semibold">{MONTHS[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── SAVINGS BAR ───────────────────────────────────────────────────────────────
function SavingsRow({ label, savings, grid, month }) {
  const pct = Math.round((savings / (savings + grid)) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400 font-medium">{month}</span>
        <span className="text-green-400 font-bold">₹{savings.toLocaleString()} saved</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
        />
      </div>
    </div>
  );
}

// ── TICKET BADGE ──────────────────────────────────────────────────────────────
function TicketBadge({ status }) {
  const map = {
    open:       'bg-red-500/15 text-red-400 border border-red-500/20',
    inprogress: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    resolved:   'bg-green-500/15 text-green-400 border border-green-500/20',
  };
  const labels = { open: 'Open', inprogress: 'In Progress', resolved: 'Resolved' };
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', map[status])}>{labels[status]}</span>
  );
}

// ── EMERGENCY CONTACT ─────────────────────────────────────────────────────────
const VENDOR = {
  name: 'SolarAxis Support',
  phone: '+919876543210',          // ← replace with real vendor number
  whatsapp: '919876543210',        // ← same without '+'
  hours: 'Mon–Sat, 9 AM – 7 PM',
};

function EmergencyContact() {
  const [open, setOpen] = useState(false);

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      'Hello, I need urgent support for my solar system. Please help!'
    );
    window.open(`https://wa.me/${VENDOR.whatsapp}?text=${msg}`, '_blank');
    setOpen(false);
  };

  const handleCall = () => {
    window.open(`tel:${VENDOR.phone}`, '_self');
    setOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-24 right-5 z-50 w-72 bg-[#0b1628] border border-red-500/30 rounded-3xl shadow-2xl shadow-red-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600/30 to-rose-600/20 border-b border-red-500/20 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Emergency Contact</p>
                  <p className="text-[10px] text-slate-400">Reach your vendor instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-700/60 text-slate-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vendor info */}
            <div className="px-5 py-3 border-b border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Vendor</p>
              <p className="text-sm font-semibold text-slate-200">{VENDOR.name}</p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {VENDOR.hours}
              </p>
            </div>

            {/* Action buttons */}
            <div className="p-4 space-y-3">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-white py-3.5 px-4 rounded-2xl transition-all group active:scale-[0.97]"
              >
                {/* WhatsApp SVG icon */}
                <span className="w-9 h-9 rounded-xl bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-[#25D366] group-hover:text-[#20bd5a] transition-colors">WhatsApp Message</p>
                  <p className="text-[10px] text-slate-500">Send a message instantly</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Phone Call */}
              <button
                onClick={handleCall}
                className="w-full flex items-center gap-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-white py-3.5 px-4 rounded-2xl transition-all group active:scale-[0.97]"
              >
                <span className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">Direct Call</p>
                  <p className="text-[10px] text-slate-500">{VENDOR.phone}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Footer note */}
            <div className="px-5 pb-4">
              <p className="text-[10px] text-slate-600 text-center">
                For non-urgent queries, use the <span className="text-blue-400">Tickets</span> section
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating SOS button */}
      <div className="fixed bottom-6 right-5 z-50">
        {/* Pulse rings */}
        {!open && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
            <span className="absolute inset-[-4px] rounded-full border border-red-500/20 animate-pulse" />
          </>
        )}
        <button
          onClick={() => setOpen(p => !p)}
          className={cn(
            'relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300',
            open
              ? 'bg-slate-700 shadow-slate-900/50 rotate-45'
              : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40 hover:scale-110 active:scale-95'
          )}
          title="Emergency Contact"
        >
          {open
            ? <X className="w-5 h-5 text-white" />
            : <Phone className="w-5 h-5 text-white" />}
        </button>
        {/* Label */}
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#0b1628] border border-red-500/30 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg"
          >
            🆘 Emergency
          </motion.div>
        )}
      </div>
    </>
  );
}

// ── LOCKED FEATURE CARD ───────────────────────────────────────────────────────
function LockedCard({ title, desc, icon: Icon, onUpgrade }) {
  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5 relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-[1px] bg-[#020617]/60 flex flex-col items-center justify-center gap-3 z-10 rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-slate-700/60 flex items-center justify-center">
          <Lock className="w-4 h-4 text-slate-400" />
        </div>
        <p className="text-sm font-bold text-slate-300">{title}</p>
        <p className="text-xs text-slate-500 text-center max-w-[160px]">{desc}</p>
        <button onClick={onUpgrade}
          className="mt-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Upgrade to Unlock
        </button>
      </div>
      {/* blurred preview below */}
      <Icon className="w-8 h-8 text-slate-600 mb-2" />
      <p className="text-slate-600 text-sm font-semibold">{title}</p>
      <div className="mt-3 space-y-2">
        {[1, 2, 3].map(i => <div key={i} className="h-2.5 bg-slate-700/60 rounded w-full" />)}
      </div>
    </div>
  );
}

// ── CUSTOMER PORTAL ───────────────────────────────────────────────────────────
export default function CustomerPortal({ onLogout }) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showTheme, setShowTheme] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('solaraxis-customer-theme');
      return saved ? THEMES.find(t => t.id === saved) || THEMES[0] : THEMES[0];
    } catch { return THEMES[0]; }
  });

  const applyTheme = (t) => {
    setTheme(t);
    try { localStorage.setItem('solaraxis-customer-theme', t.id); } catch {}
  };

  const todaySavings = useCounter(1248, 1800, started);
  const co2 = useCounter(17, 1800, started);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  const tickets = [
    { id: 'TKT-031', title: 'Inverter output fluctuation — string 2', status: 'resolved', date: '28 Mar 2026' },
    { id: 'TKT-044', title: 'Annual cleaning & maintenance scheduled', status: 'inprogress', date: '5 Apr 2026' },
    { id: 'TKT-051', title: 'Panel #7 loose connection reported', status: 'open', date: '5 Apr 2026' },
  ];

  const docs = [
    { name: 'System Warranty Certificate', date: 'Jan 2024', icon: Shield, ext: 'PDF' },
    { name: 'Inverter Datasheet (Solis 10K)', date: 'Jan 2024', icon: FileText, ext: 'PDF' },
    { name: 'March 2026 Invoice', date: 'Mar 2026', icon: FileText, ext: 'PDF' },
    { name: 'Last Performance Report', date: 'Mar 2026', icon: BarChart2, ext: 'PDF' },
  ];

  const SECTIONS = ['overview', 'energy', 'tickets', 'documents'];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-20" style={{ filter: theme.filter || undefined }}>
      {/* ── TOP NAV ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Solar<span className="text-blue-500">Axis</span></span>
              <span className="ml-2 text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Customer Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTheme(true)}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
              title="Change Theme">
              <Palette className="w-4 h-4" />
            </button>
            <button onClick={() => setUpgradeOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-600/20 hover:opacity-90 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" /> Upgrade Plan
            </button>
            <button onClick={onLogout}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1 pb-1 overflow-x-auto">
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={cn('px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap',
                activeSection === s ? 'bg-blue-600/20 text-blue-400' : 'text-slate-600 hover:text-slate-300'
              )}>
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ── HERO GREETING ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Welcome back 👋</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Rahul Kumar</h1>
              <p className="text-slate-400 text-sm">Plant: <span className="text-blue-400 font-semibold">Vasant Vihar Residence — 10 kWp</span></p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> System Healthy
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-full">
                  <Wifi className="w-3 h-3" /> Inverter Online
                </span>
              </div>
            </div>
            <div className="text-center bg-[#020617]/40 rounded-2xl p-4 border border-white/5 min-w-[140px]">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Today's Savings</p>
              <p className="text-3xl font-black text-green-400">₹{todaySavings.toLocaleString()}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">vs grid cost</p>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ────────────────────────────────────────── */}
        {(activeSection === 'overview') && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Zap} label="Live Power" value="5.6 kW" sub="Peak today: 8.2 kW" color="blue" delay={0.05} />
              <StatCard icon={Sun} label="Today Generation" value="28.4 kWh" sub="↑ 12% vs yesterday" color="amber" delay={0.10} />
              <StatCard icon={Leaf} label="CO₂ Avoided" value={`${co2} kg`} sub="This month" color="green" delay={0.15} />
              <StatCard icon={TrendingUp} label="Monthly Savings" value="₹3,840" sub="vs grid tariff" color="purple" delay={0.20} />
            </div>

            {/* ── LIVE POWER + WEATHER ─────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Power gauge */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-slate-300">Live Output</p>
                  <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> LIVE
                  </span>
                </div>
                <PowerGauge kw={5.6} maxKw={10} />
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  {[['Voltage', '230 V'], ['Current', '24.3 A'], ['Freq', '50 Hz']].map(([l, v]) => (
                    <div key={l} className="bg-slate-900/50 rounded-xl p-2">
                      <p className="text-[9px] text-slate-600 font-semibold">{l}</p>
                      <p className="text-xs font-bold text-slate-300">{v}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Weather widget */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5">
                <p className="text-sm font-bold text-slate-300 mb-4">Today's Forecast — New Delhi</p>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                      <Sun className="w-9 h-9 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-white">38°C</p>
                      <p className="text-slate-400 text-xs">Clear Sky</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-semibold">Expected Generation</p>
                    <p className="text-xl font-black text-blue-400">42+ kWh</p>
                    <p className="text-[10px] text-green-400">Excellent Solar Day ☀️</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    [Thermometer, 'High', '40°C'],
                    [Wind, 'Wind', '18 km/h'],
                    [Droplets, 'Humidity', '22%'],
                  ].map(([Icon, l, v]) => (
                    <div key={l} className="bg-slate-900/50 rounded-xl p-2.5 flex flex-col items-center gap-1">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <p className="text-[9px] text-slate-600 font-semibold">{l}</p>
                      <p className="text-xs font-bold text-slate-300">{v}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── ALERTS SUMMARY ────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="rounded-2xl border border-green-500/20 bg-green-600/5 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-300 text-sm">System Operating Normally</p>
                <p className="text-xs text-slate-400 mt-0.5">All 16 panels reporting healthy output. No active faults. Last checked 3 min ago.</p>
              </div>
              <button onClick={() => setUpgradeOpen(true)}
                className="hidden sm:flex flex-col items-end text-right flex-shrink-0">
                <span className="text-[9px] font-bold text-slate-600 flex items-center gap-1">
                  <Bell className="w-3 h-3" /> Instant WhatsApp Alerts
                </span>
                <span className="text-[9px] text-blue-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                  <Lock className="w-2.5 h-2.5" /> Upgrade to Pro
                </span>
              </button>
            </motion.div>

            {/* ── LOCKED PREMIUM FEATURES ───────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-300">Premium Features</h2>
                <button onClick={() => setUpgradeOpen(true)}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold">
                  View all plans <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <LockedCard title="AI Fault Diagnostics" desc="Get AI-powered root-cause analysis for every alert" icon={BrainCircuit} onUpgrade={() => setUpgradeOpen(true)} />
                <LockedCard title="WhatsApp Alerts" desc="Instant fault notifications on your phone" icon={MessageSquare} onUpgrade={() => setUpgradeOpen(true)} />
                <LockedCard title="Full Energy History" desc="Access 5+ years of generation data & trends" icon={BarChart2} onUpgrade={() => setUpgradeOpen(true)} />
              </div>
            </div>

            {/* ── UPGRADE BANNER ────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="rounded-3xl bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/20 border border-blue-500/25 p-6 flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Pro Plan</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Get More From Your Solar System</h3>
                <p className="text-slate-400 text-sm">All features unlocked — AI diagnostics, WhatsApp alerts, full history & priority support — just <span className="text-white font-bold">₹499/year</span></p>
                <ul className="mt-3 grid grid-cols-2 gap-1.5">
                  {['⚡ AI Fault Detection', '📱 WhatsApp Alerts', '📊 Full History', '🎯 Priority Support'].map(f => (
                    <li key={f} className="text-[11px] text-slate-300 font-semibold">{f}</li>
                  ))}
                </ul>
              </div>
              <button onClick={() => setUpgradeOpen(true)}
                className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-2xl shadow-blue-600/30 hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
                Start Free Trial <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          </>
        )}

        {/* ── ENERGY SECTION ────────────────────────────────────── */}
        {activeSection === 'energy' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-slate-300">6-Month Generation (kWh)</p>
                <span className="text-[10px] text-slate-600 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">Free: 6 months</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-4">Oct 2025 – Mar 2026</p>
              <MiniBarChart />
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xl font-black text-white">3,360</p><p className="text-[10px] text-slate-600">kWh Total</p></div>
                <div><p className="text-xl font-black text-green-400">₹23,520</p><p className="text-[10px] text-slate-600">Total Saved</p></div>
                <div><p className="text-xl font-black text-blue-400">805 kg</p><p className="text-[10px] text-slate-600">CO₂ Avoided</p></div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-5">
              <p className="text-sm font-bold text-slate-300 mb-4">Monthly Bill Savings</p>
              <div className="space-y-3">
                {[
                  { month: 'March 2026', savings: 4320, grid: 1200 },
                  { month: 'February 2026', savings: 3840, grid: 980 },
                  { month: 'January 2026', savings: 3480, grid: 1100 },
                ].map(d => <SavingsRow key={d.month} {...d} />)}
              </div>
              <button onClick={() => setUpgradeOpen(true)}
                className="mt-4 w-full py-2.5 rounded-xl border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5" /> View Full History — Upgrade to Pro
              </button>
            </div>
          </motion.div>
        )}

        {/* ── TICKETS SECTION ───────────────────────────────────── */}
        {activeSection === 'tickets' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300">Service Requests</h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">1 Active</span>
            </div>
            <div className="space-y-3">
              {tickets.map(t => (
                <motion.div key={t.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Wrench className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">{t.title}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{t.id} · {t.date}</p>
                    </div>
                  </div>
                  <TicketBadge status={t.status} />
                </motion.div>
              ))}
            </div>
            <div className="rounded-2xl border border-blue-500/20 bg-blue-600/5 p-4 flex items-center gap-3">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <p className="text-xs text-slate-400">Need help? Your vendor will respond within <span className="text-white font-semibold">24 hours</span>. <button onClick={() => setUpgradeOpen(true)} className="text-blue-400 font-semibold hover:underline">Upgrade to Pro</button> for 4-hour priority support.</p>
            </div>
          </motion.div>
        )}

        {/* ── DOCUMENTS SECTION ─────────────────────────────────── */}
        {activeSection === 'documents' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300">My Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docs.map(d => (
                <div key={d.name}
                  className="rounded-2xl border border-slate-700/40 bg-slate-800/20 p-4 flex items-center gap-4 hover:border-blue-500/30 hover:bg-blue-600/5 transition-all group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <d.icon className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{d.name}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{d.ext} · Added {d.date}</p>
                  </div>
                  <Download className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
      <EmergencyContact />

      {/* Theme Switcher Panel */}
      <ThemeSwitcher
        open={showTheme}
        onClose={() => setShowTheme(false)}
        currentTheme={theme}
        onApply={applyTheme}
      />
    </div>
  );
}
