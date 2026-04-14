import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MessageCircle, Users, CheckSquare, Square, Send,
  ChevronDown, Clock, CheckCircle, Smartphone, Zap,
  FileText, AlertTriangle, IndianRupee, Edit3, Eye
} from 'lucide-react';
import { CUSTOMERS } from '../data/mockData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

// ── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'monthly',
    icon: <FileText className="w-4 h-4" />,
    label: 'Monthly Report',
    color: 'blue',
    message: `Hello {{name}} 👋,

Here is your *SolarAxis Monthly Performance Report* 🌞

📍 Plant: *{{plant}}*
⚡ Generation this month: *{{gen}} kWh*
💰 Savings: *₹{{savings}}*
🌿 CO₂ Saved: *{{co2}} kg*

Your system is performing great! View full report on the SolarAxis portal.

— SolarAxis Energy Pvt. Ltd.`,
  },
  {
    id: 'maintenance',
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'Maintenance Alert',
    color: 'orange',
    message: `Dear {{name}},

⚠️ *Scheduled Maintenance Notice*

Your solar plant *{{plant}}* is due for its periodic maintenance check on *{{date}}*.

Our technician will visit between *10 AM – 2 PM*. Please ensure site access is available.

For any queries, call us at +91 98765 00000.

— SolarAxis Energy Team`,
  },
  {
    id: 'payment',
    icon: <IndianRupee className="w-4 h-4" />,
    label: 'Payment Reminder',
    color: 'yellow',
    message: `Hello {{name}},

💳 *AMC Payment Reminder*

Your Annual Maintenance Contract (AMC) payment of *₹{{amount}}* is due on *{{dueDate}}*.

Pay securely via UPI, Bank Transfer, or SolarAxis Portal.

UPI: solar@axisbank
A/C: 1234 5678 9012 (HDFC Bank)

Thank you for choosing SolarAxis! ☀️`,
  },
  {
    id: 'custom',
    icon: <Edit3 className="w-4 h-4" />,
    label: 'Custom Message',
    color: 'purple',
    message: '',
  },
];

// ── Sent Log (session) ────────────────────────────────────────────────────────
const sentLog = [];

// ── Main Component ────────────────────────────────────────────────────────────
export default function BulkWAMessenger({ open, onClose }) {
  const [selectedIds, setSelectedIds] = useState(new Set(CUSTOMERS.map(c => c.id)));
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [message, setMessage] = useState(TEMPLATES[0].message);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSent, setLastSent] = useState(null);
  const [toasts, setToasts] = useState([]);

  // When template changes, update message (except custom)
  useEffect(() => {
    if (template.id !== 'custom') setMessage(template.message);
  }, [template]);

  const toggleAll = () => {
    if (selectedIds.size === CUSTOMERS.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(CUSTOMERS.map(c => c.id)));
  };

  const toggleOne = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedCustomers = CUSTOMERS.filter(c => selectedIds.has(c.id));

  // Fill placeholders for preview
  const fillMessage = (cust) => {
    const plant = cust.name + "'s Plant";
    return message
      .replace(/{{name}}/g, cust.name)
      .replace(/{{plant}}/g, plant)
      .replace(/{{gen}}/g, Math.round(cust.totalCapacity * 4.2))
      .replace(/{{savings}}/g, cust.monthlySavings.toLocaleString())
      .replace(/{{co2}}/g, (cust.totalCapacity * 0.82).toFixed(1))
      .replace(/{{date}}/g, 'April 20, 2026')
      .replace(/{{amount}}/g, '4,500')
      .replace(/{{dueDate}}/g, 'April 30, 2026');
  };

  const addToast = (msg, color = 'emerald') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, color }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const handleSend = async () => {
    if (!selectedCustomers.length || !message.trim()) return;
    setSending(true);
    setSentCount(0);

    for (let i = 0; i < selectedCustomers.length; i++) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 250));
      setSentCount(i + 1);
      addToast(`✅ Sent to ${selectedCustomers[i].name}`, 'emerald');
    }

    const ts = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLastSent({ count: selectedCustomers.length, time: ts, template: template.label });
    setSending(false);
    addToast(`🎉 Bulk WA sent to ${selectedCustomers.length} customers!`, 'blue');
  };

  const previewCustomer = selectedCustomers[0] || CUSTOMERS[0];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#070d1e] border-l border-slate-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100 text-base">Bulk WhatsApp</h2>
                  <p className="text-[11px] text-slate-500">{selectedIds.size} recipients selected</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* ── Last sent notice ── */}
              {lastSent && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="text-emerald-400 font-bold">{lastSent.template}</span>
                    <span className="text-slate-400"> · sent to </span>
                    <span className="text-emerald-400 font-bold">{lastSent.count} customers</span>
                    <span className="text-slate-500"> at {lastSent.time}</span>
                  </div>
                </motion.div>
              )}

              {/* ── Recipients ── */}
              <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <p className="text-sm font-bold text-slate-200">Recipients</p>
                  </div>
                  <button onClick={toggleAll}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    {selectedIds.size === CUSTOMERS.length
                      ? <><CheckSquare className="w-3.5 h-3.5" /> Deselect All</>
                      : <><Square className="w-3.5 h-3.5" /> Select All</>}
                  </button>
                </div>
                <div className="divide-y divide-slate-800/50 max-h-48 overflow-y-auto">
                  {CUSTOMERS.map(c => (
                    <button key={c.id} onClick={() => toggleOne(c.id)}
                      className={cn('w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        selectedIds.has(c.id) ? 'bg-emerald-500/5' : 'hover:bg-slate-800/30')}>
                      <div className={cn('w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all',
                        selectedIds.has(c.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600')}>
                        {selectedIds.has(c.id) && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-200 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" />{c.phone}
                        </p>
                      </div>
                      <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                        c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-500')}>
                        {c.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Template Picker ── */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Message Template</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setTemplate(t)}
                      className={cn('flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left',
                        template.id === t.id
                          ? `bg-${t.color}-500/10 border-${t.color}-500/30 text-${t.color}-400`
                          : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700')}>
                      <span className={template.id === t.id ? `text-${t.color}-400` : 'text-slate-600'}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Message Composer ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Message</p>
                  <button onClick={() => setShowPreview(p => !p)}
                    className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    <Eye className="w-3 h-3" />
                    {showPreview ? 'Hide Preview' : 'Preview'}
                  </button>
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={8}
                  placeholder="Type your WhatsApp message here...&#10;Use {{name}}, {{plant}}, {{savings}} as placeholders."
                  className="w-full bg-[#0b1628] border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none font-mono leading-relaxed"
                />
                <p className="text-[10px] text-slate-600 mt-1.5">
                  Variables: <span className="text-blue-400">{'{{name}}'}</span> {'{{plant}}'} {'{{savings}}'} {'{{gen}}'} {'{{co2}}'}
                </p>
              </div>

              {/* ── WhatsApp Preview ── */}
              <AnimatePresence>
                {showPreview && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Preview — {previewCustomer.name}
                    </p>
                    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-4">
                      {/* WA header */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">SA</div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">SolarAxis Energy</p>
                          <p className="text-[9px] text-emerald-400">● Online</p>
                        </div>
                      </div>
                      {/* Bubble */}
                      <div className="bg-[#1a2b1a] border border-emerald-900/40 rounded-xl rounded-tl-none p-3 max-w-[85%]">
                        <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                          {fillMessage(previewCustomer)}
                        </pre>
                        <p className="text-[9px] text-slate-600 text-right mt-2">
                          {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ✓✓
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer / Send ── */}
            <div className="px-6 py-5 border-t border-slate-800 flex-shrink-0 space-y-3">
              {/* Progress bar while sending */}
              {sending && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Sending messages...</span>
                    <span className="text-emerald-400 font-bold">{sentCount}/{selectedCustomers.length}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                      animate={{ width: `${(sentCount / selectedCustomers.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={sending || !selectedCustomers.length || !message.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
              >
                {sending ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending to {sentCount}/{selectedCustomers.length}...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send WhatsApp to {selectedCustomers.length} Customer{selectedCustomers.length !== 1 ? 's' : ''}</>
                )}
              </button>
            </div>

            {/* ── Toast stack ── */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[60] pointer-events-none" style={{ width: 320 }}>
              <AnimatePresence>
                {toasts.slice(-3).map(t => (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, y: 24, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-lg',
                      t.color === 'emerald' ? 'bg-emerald-900/90 border border-emerald-500/30 text-emerald-200'
                        : 'bg-blue-900/90 border border-blue-500/30 text-blue-200'
                    )}>
                    {t.msg}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
