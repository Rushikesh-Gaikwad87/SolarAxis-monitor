import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, CheckCircle, X, Zap, Shield, Star, Crown,
  Building, IndianRupee, Smartphone, Lock, ArrowRight,
  Copy, Check, RefreshCw, Receipt, Download, ChevronRight,
  Wifi, Users, Sun, BarChart3, AlertTriangle, Phone
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

// ── Plans ─────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    emoji: '🌱',
    price: 999,
    period: 'month',
    color: 'blue',
    popular: false,
    desc: 'Perfect for small solar installers getting started',
    features: [
      'Up to 5 solar plants',
      '2 inverter connections',
      '50 customers',
      'Email alerts',
      'Basic reporting',
      'Modbus TCP support',
    ],
    limit: '5 Plants',
  },
  {
    id: 'standard',
    name: 'Standard',
    emoji: '⚡',
    price: 2499,
    period: 'month',
    color: 'indigo',
    popular: true,
    desc: 'For growing solar businesses with multiple sites',
    features: [
      'Up to 25 solar plants',
      'Unlimited inverters',
      '500 customers',
      'WhatsApp + SMS alerts',
      'Advanced analytics',
      'Bulk WA messaging',
      'Priority support',
      'Custom reports',
    ],
    limit: '25 Plants',
  },
  {
    id: 'premium',
    name: 'Premium',
    emoji: '🏆',
    price: 5999,
    period: 'month',
    color: 'yellow',
    popular: false,
    desc: 'Enterprise-grade for large solar portfolios',
    features: [
      'Unlimited plants',
      'Unlimited inverters',
      'Unlimited customers',
      'All alert channels',
      'AI fault diagnostics',
      'White-label portal',
      'Dedicated account manager',
      'SLA guarantee',
      'API access',
    ],
    limit: 'Unlimited',
  },
];

// ── Payment Methods ───────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay', icon: '💳', desc: 'Cards, UPI, Net Banking, Wallets', color: 'blue' },
  { id: 'upi',      label: 'UPI',      icon: '📱', desc: 'GPay, PhonePe, Paytm, BHIM',    color: 'green' },
  { id: 'netbank',  label: 'Net Banking', icon: '🏦', desc: 'All major Indian banks',       color: 'indigo' },
  { id: 'card',     label: 'Credit / Debit Card', icon: '💰', desc: 'Visa, Mastercard, RuPay', color: 'purple' },
  { id: 'emi',      label: 'No-Cost EMI',  icon: '📅', desc: '3 / 6 / 12 months via Razorpay', color: 'orange' },
];

// ── Invoice Log (mock) ────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: 2499, plan: 'Standard', status: 'paid' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: 2499, plan: 'Standard', status: 'paid' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: 999,  plan: 'Basic',    status: 'paid' },
];

// ── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({ plan, method, onClose, onSuccess }) {
  const [step, setStep] = useState('form'); // form | processing | done
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' });
  const [bank, setBank] = useState('sbi');

  const handlePay = async () => {
    setStep('processing');
    await new Promise(r => setTimeout(r, 2200));
    setStep('done');
    onSuccess(plan);
    setTimeout(onClose, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={step === 'form' ? onClose : undefined}>
        <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold">Secure Payment</span>
              </div>
              {step === 'form' && (
                <button onClick={onClose} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-blue-100">SolarAxis {plan?.name} Plan</p>
            <p className="text-3xl font-bold mt-1">₹{plan?.price?.toLocaleString()}<span className="text-sm font-normal text-blue-200">/month</span></p>
          </div>

          {/* Body */}
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-5 space-y-4">

                {/* Payment method info */}
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3">
                  <span className="text-2xl">{method?.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{method?.label}</p>
                    <p className="text-xs text-slate-500">{method?.desc}</p>
                  </div>
                </div>

                {/* UPI */}
                {method?.id === 'upi' && (
                  <div className="space-y-3">
                    <label htmlFor="payment-upi-id" className="text-xs font-bold text-slate-600 uppercase tracking-wide block">UPI ID</label>
                    <input id="payment-upi-id" value={upiId} onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi" type="text"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    <div className="grid grid-cols-4 gap-2">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                        <button key={app} onClick={() => setUpiId(`name@${app.toLowerCase()}`)}
                          className="py-2 text-xs font-bold border border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-slate-600">
                          {app}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card */}
                {(method?.id === 'card' || method?.id === 'razorpay') && (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="payment-card-num" className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Card Number</label>
                      <input id="payment-card-num" value={card.num}
                        onChange={e => setCard(p => ({ ...p, num: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim() }))}
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="payment-card-exp" className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">Expiry</label>
                        <input id="payment-card-exp" value={card.exp}
                          onChange={e => setCard(p => ({...p, exp: e.target.value.replace(/\D/g,'').slice(0,4).replace(/(.{2})/,'$1/')}))}
                          placeholder="MM/YY" maxLength={5}
                          className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                      </div>
                      <div>
                        <label htmlFor="payment-card-cvv" className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1.5">CVV</label>
                        <input id="payment-card-cvv" value={card.cvv} onChange={e => setCard(p=>({...p,cvv:e.target.value.slice(0,4)}))}
                          placeholder="•••" type="password" maxLength={4}
                          className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                      </div>
                    </div>
                    <input value={card.name} onChange={e => setCard(p=>({...p,name:e.target.value}))}
                      placeholder="Cardholder Name"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20" />
                  </div>
                )}

                {/* Net Banking */}
                {method?.id === 'netbank' && (
                  <div>
                    {/* Changed from <label> to <p> — labels a button group, not a single input */}
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Select Bank</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {id:'sbi',name:'SBI'},
                        {id:'hdfc',name:'HDFC'},
                        {id:'icici',name:'ICICI'},
                        {id:'axis',name:'Axis'},
                        {id:'kotak',name:'Kotak'},
                        {id:'other',name:'Other'},
                      ].map(b => (
                        <button key={b.id} onClick={() => setBank(b.id)}
                          className={cn('py-2.5 text-xs font-bold rounded-xl border transition-colors',
                            bank === b.id ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300')}>
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EMI */}
                {method?.id === 'emi' && (
                  <div>
                    {/* Changed from <label> to <p> — labels a group of options, not a single focusable input */}
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Select EMI Tenure</p>
                    <div className="space-y-2">
                      {[
                        { months: 3,  monthly: Math.ceil(plan.price / 3)  },
                        { months: 6,  monthly: Math.ceil(plan.price / 6)  },
                        { months: 12, monthly: Math.ceil(plan.price / 12) },
                      ].map(e => (
                        <div key={e.months} className="flex items-center justify-between p-3 border border-slate-200 rounded-2xl hover:border-blue-400 cursor-pointer transition-colors">
                          <span className="text-sm font-semibold text-slate-700">{e.months} months</span>
                          <span className="text-sm font-bold text-blue-600">₹{e.monthly.toLocaleString()}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security badges */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-green-500" /> SSL Secured</span>
                  <span className="flex items-center gap-1">🔒 PCI DSS</span>
                  <span className="flex items-center gap-1">⚡ Razorpay</span>
                </div>

                {/* Pay button */}
                <button onClick={handlePay}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25">
                  <Lock className="w-4 h-4" />
                  Pay ₹{plan?.price?.toLocaleString()} Securely
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
                  <div className="w-20 h-20 rounded-full absolute inset-0 flex items-center justify-center">
                    <IndianRupee className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-lg">Processing Payment</p>
                  <p className="text-sm text-slate-500 mt-1">Please wait, connecting to Razorpay…</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: '0%' }} animate={{ width: '95%' }} transition={{ duration: 2, ease: 'easeOut' }} />
                </div>
              </motion.div>
            )}

            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center gap-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-lg">Payment Successful! 🎉</p>
                  <p className="text-sm text-slate-500 mt-1">Your <strong>{plan?.name}</strong> plan is now active</p>
                  <p className="text-xs text-slate-400 mt-2">Invoice sent to your email</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, currentPlan, onSelect }) {
  const colors = {
    blue:   { border: 'border-blue-200',   bg: 'bg-blue-50',    badge: 'bg-blue-100 text-blue-700',   btn: 'bg-blue-600 hover:bg-blue-500',   icon: 'text-blue-500' },
    indigo: { border: 'border-indigo-300', bg: 'bg-indigo-50',  badge: 'bg-indigo-100 text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-500', icon: 'text-indigo-500' },
    yellow: { border: 'border-yellow-300', bg: 'bg-yellow-50',  badge: 'bg-yellow-100 text-yellow-700', btn: 'bg-yellow-500 hover:bg-yellow-400', icon: 'text-yellow-500' },
  };
  const c = colors[plan.color];
  const isActive = currentPlan === plan.id;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className={cn('relative bg-white border-2 rounded-3xl p-6 flex flex-col shadow-sm hover:shadow-lg transition-all',
        isActive ? `${c.border} shadow-md` : 'border-slate-100 hover:border-slate-200',
        plan.popular ? 'ring-2 ring-indigo-400 ring-offset-2' : '')}>

      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            ⭐ MOST POPULAR
          </span>
        </div>
      )}

      {isActive && (
        <div className="absolute top-4 right-4">
          <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full', c.badge)}>
            ✓ Current Plan
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center text-2xl', c.bg)}>
          {plan.emoji}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{plan.name}</h3>
          <p className="text-[11px] text-slate-500">{plan.limit}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-slate-900">₹{plan.price.toLocaleString()}</span>
          <span className="text-slate-500 text-sm mb-1">/ month</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
      </div>

      <ul className="space-y-2 flex-1 mb-5">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle className={cn('w-3.5 h-3.5 flex-shrink-0', c.icon)} />
            {f}
          </li>
        ))}
      </ul>

      <button onClick={() => onSelect(plan)}
        disabled={isActive}
        className={cn('w-full py-3 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]',
          isActive ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : `${c.btn} shadow-md`)}>
        {isActive ? 'Current Plan' : `Upgrade to ${plan.name}`}
      </button>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PaymentPage() {
  const [currentPlan, setCurrentPlan] = useState('standard');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [tab, setTab] = useState('plans'); // plans | billing

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setSelectedMethod(null);
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setCheckoutOpen(true);
  };

  const handlePaymentSuccess = (plan) => {
    setCurrentPlan(plan.id);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Plans & Billing</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your SolarAxis subscription</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-1">
          {['plans', 'billing'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all',
                tab === t ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200')}>
              {t === 'plans' ? '📦 Plans' : '🧾 Billing History'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'plans' && (
          <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-6">

            {/* Current plan banner */}
            <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-200">
                  Currently on <span className="text-blue-400">{PLANS.find(p => p.id === currentPlan)?.name}</span> Plan
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Renews on May 1, 2026 · ₹{PLANS.find(p => p.id === currentPlan)?.price?.toLocaleString()}/month
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ● Active
              </span>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PLANS.map(plan => (
                <PlanCard key={plan.id} plan={plan} currentPlan={currentPlan} onSelect={handleSelectPlan} />
              ))}
            </div>

            {/* Payment method step (shown after plan is selected) */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="bg-[#0b1628] border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-bold text-slate-100">Choose Payment Method</h3>
                      <p className="text-xs text-slate-500 mt-0.5">for <strong className="text-blue-400">{selectedPlan.name}</strong> Plan — ₹{selectedPlan.price.toLocaleString()}/month</p>
                    </div>
                    <button onClick={() => setSelectedPlan(null)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map(method => (
                      <motion.button key={method.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectMethod(method)}
                        className="flex items-center gap-3 p-4 bg-slate-900/60 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all text-left group">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-200 group-hover:text-white">{method.label}</p>
                          <p className="text-[10px] text-slate-500">{method.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Trust */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-4 border-t border-slate-800">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-500" /> 256-bit SSL</span>
                    <span className="text-[10px] text-slate-600">🔒 PCI DSS Compliant</span>
                    <span className="text-[10px] text-slate-600">⚡ Powered by Razorpay</span>
                    <span className="text-[10px] text-slate-600">🏦 RBI Regulated</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {tab === 'billing' && (
          <motion.div key="billing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-[#0b1628] border border-slate-800 rounded-3xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-slate-800">
                <Receipt className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-slate-100">Invoice History</h3>
              </div>
              <div className="divide-y divide-slate-800/60">
                {INVOICES.map((inv, i) => (
                  <motion.div key={inv.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 hover:bg-slate-800/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Receipt className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200">{inv.id}</p>
                      <p className="text-xs text-slate-500">{inv.date} · {inv.plan} Plan</p>
                    </div>
                    <span className="text-sm font-bold text-slate-200">₹{inv.amount.toLocaleString()}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                    <button className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Payment methods on file */}
            <div className="bg-[#0b1628] border border-slate-800 rounded-3xl overflow-hidden mt-5">
              <div className="flex items-center gap-3 p-5 border-b border-slate-800">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-slate-100">Saved Payment Methods</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-4 p-4 bg-slate-900/60 border border-slate-700 rounded-2xl">
                  <span className="text-2xl">💳</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-200">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-500">Visa · Expires 08/27</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Default</span>
                </div>
                <button className="w-full py-3 rounded-2xl border border-dashed border-slate-700 text-slate-500 hover:border-blue-500/50 hover:text-blue-400 text-xs font-bold transition-colors flex items-center justify-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> Add New Payment Method
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout modal */}
      {checkoutOpen && selectedPlan && selectedMethod && (
        <CheckoutModal
          plan={selectedPlan}
          method={selectedMethod}
          onClose={() => { setCheckoutOpen(false); setSelectedMethod(null); }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
