import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Mail, Phone, MapPin, Plus, Search, Building2, Leaf,
  DollarSign, Sun, ChevronRight, Star, MoreVertical, X, CheckCircle,
  MessageCircle
} from 'lucide-react';
import { CUSTOMERS, PLANTS } from '../data/mockData';
import BulkWAMessenger from './BulkWAMessenger';
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const TIER_CONFIG = {
  Basic:      { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  Standard:   { color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20' },
  Premium:    { color: 'text-yellow-400',bg: 'bg-yellow-500/10 border-yellow-500/20' },
  Enterprise: { color: 'text-purple-400',bg: 'bg-purple-500/10 border-purple-500/20' },
};

function CustomerRow({ cust, i }) {
  const status = cust.status;
  const plants = PLANTS.filter(p => p.customer === cust.name || p.id === cust.id);
  return (
    <motion.tr initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay:i*0.05}}
      className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center font-bold text-sm text-blue-300 border border-blue-500/20 flex-shrink-0">
            {cust.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-100 text-sm truncate">{cust.name}</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{cust.city}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="space-y-0.5">
          <p className="text-xs text-slate-300 flex items-center gap-1"><Mail className="w-3 h-3 text-slate-600"/>{cust.email}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3 text-slate-600"/>{cust.phone}</p>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full border', TIER_CONFIG[cust.tier].bg, TIER_CONFIG[cust.tier].color)}>
          {cust.tier}
        </span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-sm font-bold text-slate-200">{cust.totalCapacity} kW</p>
        <p className="text-[10px] text-slate-500">{cust.plants} plant{cust.plants>1?'s':''}</p>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-sm font-bold text-emerald-400">₹{cust.monthlySavings.toLocaleString()}</p>
        <p className="text-[10px] text-slate-500">/ month</p>
      </td>
      <td className="px-4 py-3">
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full',
          status==='active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : status==='fault' ? 'bg-red-500/10 text-red-400 border border-red-500/20'
          : 'bg-slate-700 text-slate-400 border border-slate-600')}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3">
        <button className="text-slate-500 hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800">
          <ChevronRight className="w-4 h-4"/>
        </button>
      </td>
    </motion.tr>
  );
}

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showWA, setShowWA] = useState(false);

  const filtered = CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label:'Total Customers', v: CUSTOMERS.length, icon: Users, color:'blue' },
    { label:'Active', v: CUSTOMERS.filter(c=>c.status==='active').length, icon: CheckCircle, color:'emerald' },
    { label:'Total Capacity', v:`${CUSTOMERS.reduce((s,c)=>s+c.totalCapacity,0)} kW`, icon: Sun, color:'yellow' },
    { label:'Monthly Savings', v:`₹${(CUSTOMERS.reduce((s,c)=>s+c.monthlySavings,0)/1000).toFixed(0)}K`, icon: DollarSign, color:'green' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Customers</h1>
          <p className="text-xs text-slate-500 mt-0.5">{CUSTOMERS.length} registered customers</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bulk WhatsApp */}
          <button onClick={() => setShowWA(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
            <MessageCircle className="w-4 h-4"/> Bulk WhatsApp
          </button>
          <button onClick={()=>setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4"/> Add Customer
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s,i)=>(
          <div key={i} className={cn('bg-[#0b1628] border rounded-2xl p-4', `border-${s.color}-500/20`)}>
            <s.icon className={cn('w-4 h-4 mb-2', `text-${s.color}-400`)}/>
            <p className="text-xl font-bold text-slate-100">{s.v}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full bg-[#0b1628] border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"/>
      </div>

      {/* Table */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="text-left px-4 py-3 font-semibold tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 font-semibold tracking-wide hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold tracking-wide hidden sm:table-cell">Tier</th>
                <th className="text-left px-4 py-3 font-semibold tracking-wide hidden lg:table-cell">Capacity</th>
                <th className="text-left px-4 py-3 font-semibold tracking-wide hidden lg:table-cell">Savings</th>
                <th className="text-left px-4 py-3 font-semibold tracking-wide">Status</th>
                <th className="px-4 py-3"/>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c,i) => <CustomerRow key={c.id} cust={c} i={i}/>)}
            </tbody>
          </table>
          {filtered.length===0 && (
            <div className="text-center py-12 text-slate-600">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30"/>
              <p>No customers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAdd && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}}
          className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={()=>setShowAdd(false)}>
          <motion.div initial={{y:80}} animate={{y:0}}
            className="bg-[#0b1628] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-6"
            onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-100">Add New Customer</h2>
              <button onClick={()=>setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500"><X className="w-4 h-4"/></button>
            </div>
            <div className="space-y-4">
              {[
                {label:'Full Name', type:'text', ph:'Customer name'},
                {label:'Email', type:'email', ph:'email@example.com'},
                {label:'Phone', type:'tel', ph:'+91 XXXXX XXXXX'},
                {label:'City', type:'text', ph:'City, State'},
              ].map(f => (
                <div key={f.label}>
                  <label htmlFor={`cust-${f.label.toLowerCase().replace(/\s+/g,'-')}`} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">{f.label}</label>
                  <input id={`cust-${f.label.toLowerCase().replace(/\s+/g,'-')}`} type={f.type} placeholder={f.ph} className="input-dark"/>
                </div>
              ))}
              <div>
                <label htmlFor="cust-tier" className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Tier</label>
                <select id="cust-tier" className="input-dark">
                  {['Basic','Standard','Premium','Enterprise'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowAdd(false)} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 text-sm font-bold">Cancel</button>
                <button onClick={()=>setShowAdd(false)} className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold active:scale-95 transition-all">Add Customer</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Bulk WhatsApp Messenger */}
      <BulkWAMessenger open={showWA} onClose={() => setShowWA(false)} />
    </div>
  );
}
