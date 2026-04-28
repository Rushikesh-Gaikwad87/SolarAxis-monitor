import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Sun, Wifi, Users, AlertTriangle, Settings,
  LogOut, Monitor, Menu, X, Bell, Search, Plus, ChevronRight,
  ShieldCheck, Battery, Mail, Lock, Palette, Keyboard, Maximize, Minimize, Eye, EyeOff,
  CreditCard
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Pages
import DashboardPage         from './components/DashboardPage';
import PlantsPage            from './components/PlantsPage';
import ModbusInverterConnect from './components/ModbusInverterConnect';
import CustomersPage         from './components/CustomersPage';
import AlertsPage            from './components/AlertsPage';
import SystemConfigPage      from './components/SystemConfigPage';
import CustomerPortal        from './components/CustomerPortal';
import AdminPortal           from './components/AdminPortal';
import PaymentPage           from './components/PaymentPage';

// New feature overlays
import CommandPalette        from './components/CommandPalette';
import ThemeSwitcher, { THEMES } from './components/ThemeSwitcher';
import NotificationDrawer    from './components/NotificationDrawer';
import QuickActionsButton    from './components/QuickActions';
import ToastContainer        from './components/ToastContainer';
import KeyboardShortcuts     from './components/KeyboardShortcuts';

// Data
import { ALERTS } from './data/mockData';

// Demo creds per role
const ROLE_CREDS = {
  vendor:   { email: 'vendor@solaraxis.io',   pwd: 'solar@123' },
  admin:    { email: 'admin@solaraxis.io',    pwd: 'admin@123' },
  customer: { email: 'rahul.kumar@gmail.com', pwd: 'customer@123' },
};

function cn(...i) { return twMerge(clsx(i)); }

const NAV = [
  { id:'dashboard', label:'Dashboard',        icon:LayoutDashboard },
  { id:'plants',    label:'Solar Plants',     icon:Sun             },
  { id:'inverters', label:'Inverter Connect', icon:Wifi            },
  { id:'customers', label:'Customers',        icon:Users           },
  { id:'alerts',    label:'Smart Alerts',     icon:AlertTriangle, badge: ALERTS.filter(a=>!a.resolved).length },
  { id:'billing',   label:'Plans & Billing',  icon:CreditCard      },
  { id:'settings',  label:'System Config',    icon:Settings        },
];
const PAGE_TITLES = { dashboard:'Performance Overview', plants:'Solar Plants', inverters:'Inverter Connect', customers:'Customers', alerts:'Smart Alerts', billing:'Plans & Billing', settings:'System Config' };

// ── toast helper hook ────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback(({ message, title, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, title, type, duration }]);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

// ── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, onLogout, mobile, onClose, theme, onTheme }) {
  return (
    <div className={cn('flex flex-col h-full bg-[#070d1e] border-r border-slate-800/60', mobile ? 'w-72 px-4 py-5' : 'w-60 px-4 py-5')}>
      {/* Logo */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Monitor className="w-4 h-4 text-white"/>
          </div>
          <span className="font-bold text-base tracking-tight">Solar<span className="text-blue-400">Axis</span></span>
        </div>
        {mobile && <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500"><X className="w-4 h-4"/></button>}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5">
        {NAV.map(n => (
          <button key={n.id} onClick={() => { setActive(n.id); if (mobile) onClose(); }}
            className={cn('w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm group',
              active===n.id
                ? 'bg-blue-600 text-white nav-active-glow'
                : 'text-slate-500 hover:bg-slate-800/60 hover:text-slate-200')}>
            <div className="flex items-center gap-2.5">
              <n.icon className={cn('w-4 h-4 flex-shrink-0', active===n.id ? 'text-white' : 'text-slate-600 group-hover:text-blue-400 transition-colors')}/>
              <span className="font-medium text-[13px]">{n.label}</span>
            </div>
            {n.badge > 0 && (
              <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                active===n.id ? 'bg-white/20 text-white' : 'bg-red-500/10 text-red-400 border border-red-500/20')}>
                {n.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Theme row */}
      <div className="mt-3 px-2 mb-3">
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-2">Theme</p>
        <div className="flex gap-1.5 flex-wrap">
          {THEMES.slice(0, 6).map(t => (
            <button key={t.id} onClick={() => onTheme(t)} title={t.name}
              className={cn('w-5 h-5 rounded-full border-2 transition-all', theme.id === t.id ? 'scale-125 border-white' : 'border-transparent hover:scale-110')}
              style={{ background: t.preview[1] }}/>
          ))}
          <button onClick={onTheme}
            className="w-5 h-5 rounded-full border-2 border-dashed border-slate-700 hover:border-slate-500 flex items-center justify-center transition-colors"
            title="More themes">
            <span className="text-[8px] text-slate-500">+</span>
          </button>
        </div>
      </div>

      {/* User card */}
      <div className="pt-3 border-t border-slate-800/70">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-slate-800/60">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-xs flex-shrink-0">V</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">Vendor Admin</p>
            <p className="text-[10px] text-slate-500 truncate">solar.vendor@api.com</p>
          </div>
          <button onClick={onLogout} className="text-slate-600 hover:text-red-400 transition-colors p-1">
            <LogOut className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── TOP BAR (mobile) ─────────────────────────────────────────────────────────
function TopBar({ onMenuOpen, onBell, onSearch }) {
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-[#070d1e]/95 backdrop-blur-xl sticky top-0 z-30">
      <button onClick={onMenuOpen} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><Menu className="w-5 h-5"/></button>
      <span className="font-bold text-sm text-slate-200">Solar<span className="text-blue-400">Axis</span></span>
      <div className="flex items-center gap-0.5">
        <button onClick={onSearch} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><Search className="w-4 h-4"/></button>
        <button onClick={onBell} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 relative">
          <Bell className="w-4 h-4"/>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"/>
        </button>
      </div>
    </div>
  );
}

// ── BOTTOM NAV (mobile) ──────────────────────────────────────────────────────
function BottomNav({ active, setActive }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#070d1e]/95 backdrop-blur-xl border-t border-slate-800/80 z-30 safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {NAV.slice(0,5).map(n => (
          <button key={n.id} onClick={() => setActive(n.id)}
            className={cn('flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl relative transition-all',
              active===n.id ? 'bg-blue-600/10' : 'hover:bg-slate-800/40')}>
            <n.icon className={cn('w-[18px] h-[18px] transition-colors', active===n.id ? 'text-blue-400' : 'text-slate-600')}/>
            <span className={cn('text-[9px] font-semibold', active===n.id ? 'text-blue-400' : 'text-slate-600')}>{n.label.split(' ')[0]}</span>
            {n.badge > 0 && <span className="absolute top-0.5 right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[7px] font-bold flex items-center justify-center">{n.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── DESKTOP HEADER ───────────────────────────────────────────────────────────
function DesktopHeader({ tab, onSearch, onBell, bellCount, onTheme, onShortcuts, isFullscreen, onFullscreen }) {
  return (
    <header className="hidden lg:flex items-center justify-between mb-6 flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">{PAGE_TITLES[tab]}</h1>
        <p className="text-[11px] text-slate-500 mt-0.5">SolarAxis Monitor · Vendor Portal</p>
      </div>
      <div className="flex items-center gap-1.5">
        {/* Search / Command Palette trigger */}
        <button onClick={onSearch}
          className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl py-2 pl-3 pr-4 text-xs text-slate-500 hover:text-slate-300 transition-all w-44 group">
          <Search className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors"/>
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[9px] bg-slate-800 px-1 rounded">⌘K</kbd>
        </button>

        {/* Bell */}
        <button onClick={onBell} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-blue-400 relative transition-colors">
          <Bell className="w-4 h-4"/>
          {bellCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500"/>}
        </button>

        {/* Theme */}
        <button onClick={onTheme} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-purple-400 transition-colors" title="Themes (T)">
          <Palette className="w-4 h-4"/>
        </button>

        {/* Keyboard shortcuts */}
        <button onClick={onShortcuts} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 transition-colors" title="Shortcuts (?)">
          <Keyboard className="w-4 h-4"/>
        </button>

        {/* Fullscreen */}
        <button onClick={onFullscreen} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 transition-colors" title="Fullscreen (F)">
          {isFullscreen ? <Minimize className="w-4 h-4"/> : <Maximize className="w-4 h-4"/>}
        </button>
      </div>
    </header>
  );
}

// ── LIVE TICKER ──────────────────────────────────────────────────────────────
function LiveTicker() {
  const items = ['Live Power: 716.9 kW', 'Today Generation: 716.9 kWh', 'Online Plants: 4/6', 'Monthly Savings: ₹1,52,000', 'CO₂ Saved: 171.9 T', 'Active Alerts: 5 (3 critical)', 'Next Sync: 14 min', 'System Uptime: 99.1%'];
  return (
    <div className="bg-blue-600/6 border-b border-blue-500/10 py-1 overflow-hidden relative flex-shrink-0">
      <div className="flex gap-10 animate-ticker whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-[10px] font-semibold text-blue-400/60 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-blue-500/50 flex-shrink-0"/>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
function MainApp({ onLogout }) {
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('solaraxis-theme');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return THEMES[0];
  });
  const { toasts, addToast, removeToast } = useToasts();

  const applyTheme = (t) => {
    setTheme(t);
    localStorage.setItem('solaraxis-theme', JSON.stringify(t));
    addToast({ message: `${t.emoji} Theme switched to ${t.name}`, type: 'success', duration: 2500 });
  };

  const openTheme = (t) => {
    if (t && t.id) { applyTheme(t); }
    else { setThemeOpen(true); }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Ignore if typing in an input or textarea
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'k') { e.preventDefault(); setCommandOpen(p => !p); }
        return;
      }
      switch (e.key) {
        case '?': setShortcutsOpen(p => !p); break;
        case 't': case 'T': setThemeOpen(p => !p); break;
        case 'n': case 'N': setNotifOpen(p => !p); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'r': case 'R': addToast({ message: 'Force sync initiated for all inverters', type: 'info' }); break;
        case 'Escape': setCommandOpen(false); setThemeOpen(false); setNotifOpen(false); setShortcutsOpen(false); break;
        case '1': setTab('dashboard'); break;
        case '2': setTab('plants'); break;
        case '3': setTab('inverters'); break;
        case '4': setTab('customers'); break;
        case '5': setTab('alerts'); break;
        case '6': setTab('billing'); break;
        case '7': setTab('settings'); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const bellCount = ALERTS.filter(a => !a.resolved).length;

  const pageContent = {
    dashboard: <DashboardPage />,
    plants:    <PlantsPage />,
    inverters: <ModbusInverterConnect />,
    customers: <CustomersPage />,
    alerts:    <AlertsPage />,
    billing:   <PaymentPage />,
    settings:  <SystemConfigPage />,
  };

  return (
    <div
      className="flex h-screen text-slate-100 overflow-hidden relative transition-all duration-500"
      style={{ background: '#020617', filter: theme.filter || undefined }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-full flex-shrink-0">
        <Sidebar active={tab} setActive={setTab} onLogout={onLogout} theme={theme} onTheme={openTheme}/>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>
            <motion.div initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}} transition={{type:'spring', damping:30, stiffness:300}}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden shadow-2xl">
              <Sidebar active={tab} setActive={setTab} onLogout={onLogout} mobile theme={theme} onTheme={openTheme} onClose={() => setSidebarOpen(false)}/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar onMenuOpen={() => setSidebarOpen(true)} onBell={() => setNotifOpen(p=>!p)} onSearch={() => setCommandOpen(true)}/>
        <LiveTicker />

        <main className="flex-1 overflow-y-auto">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/4 blur-[120px] -z-10 rounded-full pointer-events-none"/>

          <div className="p-4 sm:p-5 lg:p-6 xl:p-8 pb-24 lg:pb-6">
            <DesktopHeader
              tab={tab}
              onSearch={() => setCommandOpen(true)}
              onBell={() => setNotifOpen(p => !p)}
              bellCount={bellCount}
              onTheme={() => setThemeOpen(true)}
              onShortcuts={() => setShortcutsOpen(true)}
              isFullscreen={isFullscreen}
              onFullscreen={toggleFullscreen}
            />
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} transition={{duration:0.18}}>
                {pageContent[tab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <BottomNav active={tab} setActive={setTab}/>

      {/* ── OVERLAY FEATURES ────────────────────────────────────────── */}
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={(id) => { setTab(id); setCommandOpen(false); }}
      />

      <ThemeSwitcher
        open={themeOpen}
        onClose={() => setThemeOpen(false)}
        currentTheme={theme}
        onApply={applyTheme}
      />

      <NotificationDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

      <KeyboardShortcuts
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />

      <QuickActionsButton
        onNavigate={(id) => setTab(id)}
        onShowToast={addToast}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// ── LOGIN HELPERS ─────────────────────────────────────────────────────────────
const ROLE_LABELS = { vendor: '🏢 Vendor', admin: '🛡️ Admin', customer: '☀️ Customer' };
const ROLE_DESCRIPTIONS = {
  vendor:   'Manage your solar fleet, customers & inverters',
  admin:    'Full platform administration & configuration',
  customer: 'View your plant stats, savings & service history',
};

// Registered accounts (in-memory; would be server-side in production)
const REGISTERED_ACCOUNTS = {
  vendor:   [...Object.values(ROLE_CREDS).map((c,i)=>({...c, role: Object.keys(ROLE_CREDS)[i]}))],
  customer: [],
};

function pwdStrength(p) {
  if (p.length < 8) return 'too_short';
  if (!/[0-9]/.test(p)) return 'no_number';
  if (!/[^A-Za-z0-9]/.test(p)) return 'no_special';
  return 'ok';
}
function pwdMsg(s) {
  if (s === 'too_short') return 'Minimum 8 characters required';
  if (s === 'no_number') return 'Must contain at least 1 number';
  if (s === 'no_special') return 'Must contain at least 1 special character';
  return '';
}

// ── SHARED FIELD COMPONENT (keeps original design, adds validation border) ────
function ValidatedField({ label, id, type = 'text', value, onChange, placeholder, touched, valid, errorMsg, suffix, icon: Icon }) {
  let borderCls = 'border-[#1e293b]';
  if (touched && value) borderCls = valid ? 'border-emerald-500/60' : 'border-red-500/50';
  else if (touched && !value) borderCls = 'border-red-500/50';

  return (
    <div>
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <div className={cn('flex items-center gap-0 bg-[#0f172a] border rounded-2xl overflow-hidden focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.10)] transition-all', borderCls)}>
        {Icon && <div className="pl-4 pr-2 flex items-center flex-shrink-0"><Icon className="w-4 h-4 text-slate-600"/></div>}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-3 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none font-sans"
        />
        {suffix}
      </div>
      <AnimatePresence>
        {touched && errorMsg && (
          <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="text-[10px] text-red-400 mt-1">{errorMsg}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── FORGOT PASSWORD MODAL ─────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  const [contact, setContact] = useState('');
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const valid = contact.trim().length > 0;

  const handleSend = async () => {
    setTouched(true);
    if (!valid) return;
    setSending(true);
    try {
      // Try real Supabase password reset first
      const { supabase } = await import('./lib/supabase');
      await supabase.auth.resetPasswordForEmail(contact, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    } catch (e) {
      // Silently continue — keeps demo working even without anon key
      console.warn('Password reset (demo mode):', e?.message);
    }
    setSending(false);
    setSent(true);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[500] flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{scale:0.93,y:16}} animate={{scale:1,y:0}} exit={{scale:0.93,y:16}}
          className="bg-[#0b1628] border border-slate-800 rounded-3xl w-full max-w-sm p-7 shadow-2xl"
          onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-100">Forgot Password?</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">We'll send a reset link to you</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4"/>
            </button>
          </div>

          {!sent ? (
            <>
              <ValidatedField
                label="Registered Email or Phone"
                id="forgot-contact"
                value={contact}
                onChange={e => { setContact(e.target.value); setTouched(false); }}
                placeholder="email@example.com or +91 XXXXX"
                touched={touched}
                valid={valid}
                errorMsg={!valid ? 'This field is required' : ''}
                icon={Mail}
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full mt-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all">
                {sending
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending...</>
                  : 'Send Reset Link'}
              </button>
            </>
          ) : (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>
              <p className="font-semibold text-slate-100 text-sm">Reset Link Sent!</p>
              <p className="text-xs text-slate-500">A password reset link has been sent to your registered email/phone.</p>
              <button onClick={onClose} className="mt-3 w-full py-2.5 rounded-2xl border border-slate-700 text-slate-400 text-sm font-bold hover:border-slate-600 transition-colors">
                Close
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── REGISTRATION MODAL ────────────────────────────────────────────────────────
function RegisterModal({ role, onClose, onSuccess }) {
  const isVendor = role === 'vendor';
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => { setForm(p => ({...p, [k]: v})); setTouched(p => ({...p, [k]: true})); };

  const strength = pwdStrength(form.password);

  const fieldValid = {
    name:     form.name.trim().length > 0,
    email:    form.email.trim().length > 0 && form.email.includes('@'),
    phone:    form.phone.trim().length > 0,
    password: strength === 'ok',
    confirm:  form.confirm.length > 0 && form.confirm === form.password,
  };

  const allValid = Object.values(fieldValid).every(Boolean);

  const handleRegister = async () => {
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true });
    if (!allValid) return;
    setSaving(true);
    try {
      const { supabase } = await import('./lib/supabase');
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name, phone: form.phone, role } },
      });
      if (error) throw error;
    } catch (e) {
      // In demo mode (no anon key), still proceed to let user explore
      console.warn('Register (demo mode):', e?.message);
    }
    setSaving(false);
    onSuccess(form.email, form.password);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[500] flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div initial={{scale:0.93,y:16}} animate={{scale:1,y:0}} exit={{scale:0.93,y:16}}
          className="bg-[#0b1628] border border-slate-800 rounded-3xl w-full max-w-sm max-h-[92vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-[#0b1628] z-10">
            <div>
              <h3 className="font-bold text-slate-100">Create {isVendor ? 'Vendor' : 'Customer'} Account</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Fill in your details to get started</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4"/>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <ValidatedField
              label={isVendor ? 'Vendor / Business Name' : 'Full Name'}
              id="reg-name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder={isVendor ? 'e.g. SunTech Solutions' : 'e.g. Rahul Kumar'}
              touched={touched.name}
              valid={fieldValid.name}
              errorMsg={!fieldValid.name ? 'This field is required' : ''}
            />
            <ValidatedField
              label="Email"
              id="reg-email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@example.com"
              touched={touched.email}
              valid={fieldValid.email}
              errorMsg={!form.email.trim() ? 'This field is required' : !form.email.includes('@') ? 'Enter a valid email' : ''}
              icon={Mail}
            />
            <ValidatedField
              label="Phone Number"
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              touched={touched.phone}
              valid={fieldValid.phone}
              errorMsg={!fieldValid.phone ? 'This field is required' : ''}
            />
            <ValidatedField
              label="Password"
              id="reg-password"
              type={showPwd ? 'text' : 'password'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="Min 8 chars, 1 number, 1 special"
              touched={touched.password}
              valid={fieldValid.password}
              errorMsg={!form.password ? 'This field is required' : pwdMsg(strength)}
              icon={Lock}
              suffix={
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="pr-4 pl-2 text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0">
                  {showPwd ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              }
            />
            <ValidatedField
              label="Confirm Password"
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
              placeholder="Re-enter password"
              touched={touched.confirm}
              valid={fieldValid.confirm}
              errorMsg={!form.confirm ? 'This field is required' : form.confirm !== form.password ? 'Passwords do not match' : ''}
              icon={Lock}
              suffix={
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="pr-4 pl-2 text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0">
                  {showConfirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              }
            />

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 text-sm font-bold hover:border-slate-600 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={saving}
                className={cn(
                  'flex-1 py-3 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60',
                  isVendor ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-500 hover:bg-amber-400'
                )}>
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Creating...</>
                  : 'Create Account'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('vendor');
  const [email, setEmail] = useState(ROLE_CREDS.vendor.email);
  const [pwd, setPwd] = useState(ROLE_CREDS.vendor.pwd);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, pwd: false });
  const [showForgot, setShowForgot] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const selectRole = (r) => {
    setRole(r);
    setEmail(ROLE_CREDS[r].email);
    setPwd(ROLE_CREDS[r].pwd);
    setError('');
    setTouched({ email: false, pwd: false });
    setShowForgot(false);
    setShowRegister(false);
  };

  // Field validity
  const emailValid = email.trim().length > 0 && email.includes('@');
  const pwdStrengthResult = pwdStrength(pwd);
  const pwdValid = pwdStrengthResult === 'ok' && pwd.length > 0;
  const canSubmit = email.trim().length > 0 && pwd.trim().length > 0;

  // Border classes
  const emailBorder = touched.email
    ? (emailValid ? 'border-emerald-500/60' : 'border-red-500/50')
    : 'border-[#1e293b]';
  const pwdBorder = touched.pwd
    ? (pwdValid ? 'border-emerald-500/60' : 'border-red-500/50')
    : 'border-[#1e293b]';

  const emailErr = touched.email && !email.trim()
    ? 'This field is required'
    : touched.email && !email.includes('@')
    ? 'Enter a valid email'
    : '';

  const pwdErr = touched.pwd && !pwd
    ? 'This field is required'
    : touched.pwd && pwdStrengthResult !== 'ok'
    ? pwdMsg(pwdStrengthResult)
    : '';

  const handleLogin = async () => {
    setTouched({ email: true, pwd: true });
    if (!email.trim()) { setError('Email is required'); return; }
    if (!pwd.trim())   { setError('Password is required'); return; }
    setError('');
    setLoading(true);
    try {
      // ── Try real Supabase auth first ──────────────────────────────────────
      const { supabase } = await import('./lib/supabase');
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (!authErr && data?.user) {
        // Fetch profile to get role
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        setLoading(false);
        onLogin(prof?.role || role);
        return;
      }
    } catch (_) {
      // Supabase not configured yet — fall through to demo mode
    }
    // ── Demo / offline fallback ───────────────────────────────────────────────
    const creds = ROLE_CREDS[role];
    if (email !== creds.email || pwd !== creds.pwd) {
      setLoading(false);
      setError('Incorrect email or password');
      return;
    }
    setTimeout(() => { setLoading(false); onLogin(role); }, 600);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/8 rounded-full blur-[130px]"/>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/8 rounded-full blur-[100px]"/>
      {role === 'customer' && <div className="absolute top-[20%] right-[5%] w-[30%] h-[30%] bg-green-600/6 rounded-full blur-[100px]"/>}

      <motion.div initial={{opacity:0,scale:0.95,y:16}} animate={{opacity:1,scale:1,y:0}}
        className="w-full max-w-[340px] bg-[#0b1628]/90 backdrop-blur-2xl border border-white/8 p-6 sm:p-7 rounded-[2rem] shadow-2xl relative z-10">

        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: role === 'customer' ? [0, 360] : 0 }}
            transition={{ duration: 2, repeat: role === 'customer' ? Infinity : 0, ease: 'linear' }}
            className={cn(
              'w-16 h-16 p-4 rounded-2xl mx-auto mb-4 shadow-xl',
              role === 'customer'
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/25'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25'
            )}>
            {role === 'customer'
              ? <Sun className="w-full h-full text-white"/>
              : <ShieldCheck className="w-full h-full text-white"/>}
          </motion.div>
          <h2 className="text-2xl font-bold mb-1">Solar<span className="text-blue-500">Axis</span></h2>
          <AnimatePresence mode="wait">
            <motion.p key={role} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
              className="text-slate-500 text-xs">{ROLE_DESCRIPTIONS[role]}</motion.p>
          </AnimatePresence>
        </div>

        {/* Role tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-900/60 p-1 rounded-2xl border border-slate-800">
          {Object.keys(ROLE_CREDS).map(r => (
            <button key={r} onClick={() => selectRole(r)}
              className={cn('py-2 rounded-xl text-xs font-bold capitalize transition-all',
                role===r
                  ? (r === 'customer' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20')
                  : 'text-slate-500 hover:text-slate-300')}>
              {r}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Email field */}
          <div>
            <label htmlFor="login-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Email</label>
            <div className={cn('flex items-center gap-0 bg-[#0f172a] border rounded-2xl overflow-hidden focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.10)] transition-all', emailBorder)}>
              <div className="pl-4 pr-2 flex items-center flex-shrink-0">
                <Mail className="w-4 h-4 text-slate-600" />
              </div>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); setTouched(p => ({...p, email: true})); }}
                className="flex-1 bg-transparent py-3 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none font-sans"
                placeholder="email@solaraxis.io"
              />
            </div>
            <AnimatePresence>
              {emailErr && (
                <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="text-[10px] text-red-400 mt-1">{emailErr}</motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="login-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Password</label>
            <div className={cn('flex items-center gap-0 bg-[#0f172a] border rounded-2xl overflow-hidden focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.10)] transition-all', pwdBorder)}>
              <div className="pl-4 pr-2 flex items-center flex-shrink-0">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                value={pwd}
                onChange={e => { setPwd(e.target.value); setError(''); setTouched(p => ({...p, pwd: true})); }}
                className="flex-1 bg-transparent py-3 text-sm text-slate-200 placeholder-slate-600 outline-none font-mono"
                placeholder="••••••••"
                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
              />
              <button
                onClick={() => setShowPwd(p => !p)}
                type="button"
                className="pr-4 pl-2 flex items-center text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {pwdErr && (
                <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="text-[10px] text-red-400 mt-1">{pwdErr}</motion.p>
              )}
            </AnimatePresence>

            {/* Forgot Password — Customer & Vendor only */}
            {role !== 'admin' && (
              <div className="text-right mt-1.5">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                  Forgot Password?
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button id="login-btn" onClick={handleLogin} disabled={loading || !canSubmit}
            className={cn(
              'w-full text-white py-3.5 rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2',
              role === 'customer'
                ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25',
              (loading || !canSubmit) && 'opacity-50 cursor-not-allowed'
            )}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/></>
              : <>{role === 'customer' ? '☀️ Enter Portal' : 'Sign In'} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></>}
          </button>

          {/* Create New Account — Customer & Vendor only */}
          {role !== 'admin' && (
            <p className="text-center text-[11px] text-slate-600 mt-1">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Create New Account
              </button>
            </p>
          )}
        </div>

        {/* Demo credentials box */}
        <div className="mt-6 p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
          <p className="text-[10px] text-slate-500 text-center font-semibold mb-2">DEMO CREDENTIALS</p>
          <div className="space-y-1">
            {Object.entries(ROLE_CREDS).map(([r, c]) => (
              <button key={r} onClick={() => selectRole(r)}
                className={cn('w-full text-left text-[10px] px-2 py-1 rounded-lg transition-colors',
                  role === r ? 'bg-blue-900/40 text-blue-300' : 'text-slate-600 hover:text-slate-400')}>
                <span className="font-bold capitalize">{r}:</span> {c.email} / {c.pwd}
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-5 opacity-40">
          <span className="flex items-center gap-1 text-[9px] font-bold"><ShieldCheck className="w-3 h-3 text-blue-400"/>SSL</span>
          <span className="flex items-center gap-1 text-[9px] font-bold"><Battery className="w-3 h-3 text-green-400"/>AES-256</span>
          <span className="flex items-center gap-1 text-[9px] font-bold"><Monitor className="w-3 h-3 text-purple-400"/>v2.4.0</span>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {/* Registration Modal */}
      {showRegister && (
        <RegisterModal
          role={role}
          onClose={() => setShowRegister(false)}
          onSuccess={(newEmail, newPwd) => {
            setShowRegister(false);
            setEmail(newEmail);
            setPwd(newPwd);
            setTouched({ email: false, pwd: false });
            setError('');
          }}
        />
      )}
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ── Restore session from Supabase on page load ──────────────────────────────
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && active) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (active && prof?.role) setRole(prof.role);
        }
      } catch (_) {
        // Demo mode — no session to restore
      } finally {
        if (active) setAuthChecked(true);
      }
    })();
    return () => { active = false; };
  }, []);

  // Show spinner while checking session
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const { supabase } = await import('./lib/supabase');
      await supabase.auth.signOut();
    } catch (_) {}
    setRole(null);
  };

  if (!role)               return <LoginScreen onLogin={(r) => setRole(r)} />;
  if (role === 'admin')    return <AdminPortal    onLogout={handleLogout} />;
  if (role === 'customer') return <CustomerPortal onLogout={handleLogout} />;
  return <MainApp onLogout={handleLogout} />;
}
