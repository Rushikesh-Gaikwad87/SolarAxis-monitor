import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, User, Bell, Wifi, Shield, BarChart3, Globe, Palette,
  Key, Clock, DollarSign, Mail, Phone, MapPin, Save, Check, ChevronRight,
  Moon, Sun, Zap, RefreshCw, Download, Trash2, AlertTriangle
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../data/mockData';
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn('w-11 h-6 rounded-full transition-all relative flex-shrink-0', checked ? 'bg-blue-600' : 'bg-slate-700')}>
      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm', checked ? 'left-6' : 'left-1')} />
    </button>
  );
}

function Section({ title, icon: Icon, color, children }) {
  return (
    <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b border-slate-800">
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', `bg-${color}-500/10`)}>
          <Icon className={cn('w-4 h-4', `text-${color}-400`)} />
        </div>
        <h3 className="font-bold text-sm text-slate-100">{title}</h3>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

function FieldRow({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SystemConfigPage() {
  const [cfg, setCfg] = useState(SYSTEM_CONFIG);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const set = (k, v) => setCfg(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5 max-w-2xl mx-auto xl:max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">System Config</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your SolarAxis platform settings</p>
        </div>
        <button onClick={handleSave}
          className={cn('flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95',
            saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white')}>
          {saved ? <><Check className="w-4 h-4"/>Saved!</> : <><Save className="w-4 h-4"/>Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Company Info */}
        <Section title="Company Information" icon={User} color="blue">
          <div className="space-y-3">
            {[
              { label:'Company Name', k:'companyName', icon:User },
              { label:'Admin Email', k:'email', icon:Mail },
              { label:'Phone', k:'phone', icon:Phone },
              { label:'Address', k:'address', icon:MapPin },
            ].map(f => (
              <div key={f.k}>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                <div className="relative">
                  <f.icon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"/>
                  <input value={cfg[f.k]} onChange={e=>set(f.k,e.target.value)}
                    className="input-dark pl-9 text-sm"/>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* System Settings */}
        <Section title="System Settings" icon={Settings} color="indigo">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Timezone</label>
                <select value={cfg.timezone} onChange={e=>set('timezone',e.target.value)} className="input-dark text-sm">
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Language</label>
                <select value={cfg.language} onChange={e=>set('language',e.target.value)} className="input-dark text-sm">
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="gu">Gujarati</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Currency</label>
                <select value={cfg.currency} onChange={e=>set('currency',e.target.value)} className="input-dark text-sm">
                  <option>INR</option><option>USD</option><option>EUR</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Tariff (₹/kWh)</label>
                <input type="number" value={cfg.tariff} onChange={e=>set('tariff',+e.target.value)} className="input-dark text-sm"/>
              </div>
            </div>
          </div>
        </Section>

        {/* Alerts & Notifications */}
        <Section title="Alerts & Notifications" icon={Bell} color="red">
          <div className="space-y-4">
            <FieldRow label="Email Alerts" sub="Receive alerts via email">
              <Toggle checked={cfg.alertEmail} onChange={v=>set('alertEmail',v)}/>
            </FieldRow>
            <FieldRow label="SMS Alerts" sub="Receive alerts via SMS">
              <Toggle checked={cfg.alertSMS} onChange={v=>set('alertSMS',v)}/>
            </FieldRow>
            <FieldRow label="Push Notifications" sub="Browser push alerts">
              <Toggle checked={cfg.alertPush} onChange={v=>set('alertPush',v)}/>
            </FieldRow>
            <div className="border-t border-slate-800 pt-4">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Alert Email Address</label>
                <input value={cfg.email} onChange={e=>set('email',e.target.value)} className="input-dark text-sm" type="email"/>
              </div>
            </div>
          </div>
        </Section>

        {/* Data Sync */}
        <Section title="Data Sync & Reporting" icon={RefreshCw} color="emerald">
          <div className="space-y-4">
            <FieldRow label="Sync Interval" sub="How often to poll inverters">
              <select value={cfg.syncInterval} onChange={e=>set('syncInterval',+e.target.value)} className="input-dark text-sm w-32">
                <option value={5}>5 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>60 min</option>
              </select>
            </FieldRow>
            <FieldRow label="Auto Reports" sub="Send monthly PDF reports">
              <Toggle checked={cfg.autoReport} onChange={v=>set('autoReport',v)}/>
            </FieldRow>
            <FieldRow label="Report Day" sub="Day of month to send report">
              <select value={cfg.reportDay} onChange={e=>set('reportDay',+e.target.value)} className="input-dark text-sm w-24">
                {[1,5,10,15,28].map(d=><option key={d} value={d}>{d}{d===1?'st':d===2?'nd':d===3?'rd':'th'}</option>)}
              </select>
            </FieldRow>
            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold hover:border-blue-500/40 hover:text-blue-400 transition-colors">
                <Download className="w-3.5 h-3.5"/> Export Data
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold hover:border-slate-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5"/> Force Sync
              </button>
            </div>
          </div>
        </Section>

        {/* API Keys */}
        <Section title="API & Security" icon={Key} color="yellow">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">API Key</label>
              <div className="flex gap-2">
                <input value={cfg.apiKey} readOnly className="input-dark text-sm font-mono flex-1"/>
                <button className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-400 font-bold transition-colors">
                  Copy
                </button>
              </div>
            </div>
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <p className="text-[11px] text-yellow-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5"/>Keep your API key secret
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Never share this key publicly. Rotate it if compromised.</p>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/5 transition-colors flex items-center justify-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5"/> Regenerate API Key
            </button>
          </div>
        </Section>

        {/* App Info */}
        <Section title="App Information" icon={Shield} color="purple">
          <div className="space-y-3">
            {[
              { label:'App Name', v:'SolarAxis Monitor' },
              { label:'Version', v:'v2.4.0' },
              { label:'Build', v:'2026.04.05' },
              { label:'Environment', v:'Production' },
              { label:'Database', v:'Supabase PostgreSQL' },
              { label:'Protocol', v:'Modbus TCP / REST API' },
            ].map(r => (
              <div key={r.label} className="flex justify-between text-xs border-b border-slate-800/60 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{r.label}</span>
                <span className="font-semibold text-slate-300">{r.v}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
        <h3 className="font-bold text-sm text-red-400 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4"/> Danger Zone
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5"/> Clear All Alert History
          </button>
          <button className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5"/> Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
