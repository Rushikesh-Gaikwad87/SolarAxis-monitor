import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Sun, Zap, Leaf, TrendingUp, TrendingDown, DollarSign,
  BarChart3, ShieldCheck, AlertTriangle, Activity, CloudSun,
  Thermometer, Wind, Droplets, Eye, ArrowUpRight, ArrowDownRight,
  RefreshCw, Bell, MapPin
} from 'lucide-react';
import { PLANTS, ALERTS, GEN_CHART_DATA, MONTHLY_DATA } from '../data/mockData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...i) { return twMerge(clsx(i)); }

const COLORS = ['#3b82f6','#10b981','#f59e0b','#6366f1','#ef4444','#0ea5e9'];

// Live time update
function useLiveTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return time;
}

export default function Dashboard() {
  const time = useLiveTime();
  const totalCapacity = PLANTS.reduce((s, p) => s + p.capacity, 0);
  const todayGen = PLANTS.reduce((s, p) => s + p.todayGen, 0).toFixed(1);
  const co2Saved = PLANTS.reduce((s, p) => s + p.co2, 0).toFixed(1);
  const totalSavings = PLANTS.reduce((s, p) => s + p.savings, 0);
  const onlinePlants = PLANTS.filter(p => p.status === 'online').length;
  const activeAlerts = ALERTS.filter(a => !a.resolved).length;

  const stats = [
    { label: 'Live Power', value: `${todayGen} kW`, sub: 'Across all plants', icon: Sun, color: 'yellow', trend: '+12%', up: true },
    { label: 'Today Generation', value: `${todayGen} kWh`, sub: 'vs 615 kWh yesterday', icon: Zap, color: 'blue', trend: '+5.3%', up: true },
    { label: 'Monthly Savings', value: `₹${(totalSavings/1000).toFixed(0)}K`, sub: 'This month', icon: DollarSign, color: 'emerald', trend: '+8.1%', up: true },
    { label: 'CO₂ Saved', value: `${co2Saved} T`, sub: 'This month', icon: Leaf, color: 'green', trend: '+6.2%', up: true },
    { label: 'Online Plants', value: `${onlinePlants}/${PLANTS.length}`, sub: 'Fleet uptime: 99.1%', icon: Activity, color: 'indigo', trend: 'Stable', up: null },
    { label: 'Active Alerts', value: activeAlerts, sub: `${ALERTS.filter(a=>a.severity==='critical'&&!a.resolved).length} critical`, icon: AlertTriangle, color: 'red', trend: '-2 today', up: false },
  ];

  // Status breakdown for mini donut
  const statusData = [
    { name: 'Online', value: PLANTS.filter(p=>p.status==='online').length },
    { name: 'Offline', value: PLANTS.filter(p=>p.status==='offline').length },
    { name: 'Fault', value: PLANTS.filter(p=>p.status==='fault').length },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Good {time.getHours() < 12 ? '☀️ Morning' : time.getHours() < 17 ? '🌤 Afternoon' : '🌙 Evening'}, Admin
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{time.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })} · {time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE DATA
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full">
            <Sun className="w-3.5 h-3.5" /> Peak Hours Active
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
            className="bg-[#0b1628] border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
            <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', `bg-${s.color}-500/10`)}>
              <s.icon className={cn('w-4 h-4', `text-${s.color}-400`)} />
            </div>
            <p className="text-[11px] text-slate-500 mb-0.5">{s.label}</p>
            <p className="text-xl font-bold text-slate-100">{s.value}</p>
            <div className={cn('flex items-center gap-1 mt-1 text-[10px] font-semibold',
              s.up === true ? 'text-emerald-400' : s.up === false ? 'text-red-400' : 'text-slate-500')}>
              {s.up === true ? <ArrowUpRight className="w-3 h-3"/> : s.up === false ? <ArrowDownRight className="w-3 h-3"/> : null}
              {s.trend}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Generation Chart — explicit height to prevent Recharts width/height=-1 */}
        <div className="xl:col-span-2 bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h3 className="font-bold text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" /> Generation Analytics (Today)
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block"/>Actual</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-400 border-dashed inline-block" style={{borderTop:'2px dashed #818cf8'}}/>Forecast</span>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={GEN_CHART_DATA} margin={{ top:0, right:0, bottom:0, left:-20 }}>
                <defs>
                  <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:'#0f1f35', border:'1px solid #1e293b', borderRadius:12, fontSize:12 }} />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gActual)" />
                <Area type="monotone" dataKey="forecast" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Health + Donut */}
        <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5 flex flex-col gap-5">
          {/* Status Donut — explicit dimensions on ResponsiveContainer */}
          <div>
            <p className="text-sm font-bold mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400"/>Fleet Status</p>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0" style={{ width: 96, height: 96 }}>
                <ResponsiveContainer width={96} height={96}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={24} outerRadius={38} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                      {statusData.map((_, i) => <Cell key={i} fill={['#10b981','#64748b','#ef4444'][i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs">
                {statusData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:['#10b981','#64748b','#ef4444'][i]}}/>
                    <span className="text-slate-400">{s.name}</span>
                    <span className="font-bold ml-auto pl-3">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Bars */}
          <div className="space-y-3">
            {[
              { label:'Solar Array', val:98, c:'#10b981' },
              { label:'Inverters', val:OnlinePlants_pct(onlinePlants), c:'#3b82f6' },
              { label:'Grid Link', val:100, c:'#6366f1' },
              { label:'Comm Link', val:97, c:'#0ea5e9' },
            ].map(h => (
              <div key={h.label}>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>{h.label}</span><span style={{color:h.c}}>{h.val}%</span></div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{width:0}} animate={{width:`${h.val}%`}} transition={{duration:1.2, ease:'easeOut'}}
                    className="h-full rounded-full" style={{background:h.c, boxShadow:`0 0 8px ${h.c}55`}} />
                </div>
              </div>
            ))}
          </div>

          {/* Weather Widget */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3">
            <p className="text-[10px] text-slate-600 mb-2 flex items-center gap-1"><CloudSun className="w-3 h-3"/>WEATHER — Pune</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="text-sm font-bold">32°C</p>
                  <p className="text-[10px] text-slate-500">Clear Sky</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><Wind className="w-3 h-3"/>12 km/h</span>
                <span className="flex items-center gap-1"><Droplets className="w-3 h-3"/>45% RH</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3"/>UV: 8 High</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Bar + Recent Alerts + Top Plants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Bar — explicit height */}
        <div className="lg:col-span-2 bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-400"/>Monthly Generation (kWh)</h3>
          <div style={{ height: 176 }}>
            <ResponsiveContainer width="100%" height={176}>
              <BarChart data={MONTHLY_DATA} margin={{ top:0, right:0, bottom:0, left:-20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:'#0f1f35', border:'1px solid #1e293b', borderRadius:12, fontSize:12 }}/>
                <Bar dataKey="gen" radius={[4,4,0,0]}>
                  {MONTHLY_DATA.map((_, i) => <Cell key={i} fill={i === new Date().getMonth() ? '#3b82f6' : '#1e3a5f'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-red-400"/>Recent Alerts</h3>
          <div className="space-y-2">
            {ALERTS.filter(a=>!a.resolved).slice(0,4).map(alert => (
              <div key={alert.id} className={cn('flex items-start gap-2 p-2.5 rounded-xl border text-xs',
                alert.severity==='critical' ? 'border-red-500/20 bg-red-500/5' : alert.severity==='warning' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-blue-500/20 bg-blue-500/5'
              )}>
                <AlertTriangle className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5',
                  alert.severity==='critical'?'text-red-400':alert.severity==='warning'?'text-yellow-400':'text-blue-400')} />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-200 truncate">{alert.plant}</p>
                  <p className="text-slate-500 truncate mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Plants */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400"/>Plant Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800/60 text-slate-500">
                {['Plant','Location','Capacity','Today','Performance','Status'].map(h=>(
                  <th key={h} className="text-left py-2 px-3 font-semibold tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLANTS.map(p => (
                <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{p.name.split('–')[0]}</td>
                  <td className="py-2.5 px-3 text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{p.location}</td>
                  <td className="py-2.5 px-3 text-slate-300">{p.capacity} kW</td>
                  <td className="py-2.5 px-3 font-semibold text-blue-400">{p.todayGen} kWh</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-[60px]">
                        <div className="h-full rounded-full" style={{width:`${p.performance}%`, background: p.performance>85?'#10b981':p.performance>50?'#f59e0b':'#ef4444'}}/>
                      </div>
                      <span className="text-slate-400">{p.performance}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={cn('px-2 py-0.5 rounded-full font-bold',
                      p.status==='online'?'bg-emerald-500/10 text-emerald-400':p.status==='offline'?'bg-slate-500/10 text-slate-400':'bg-red-500/10 text-red-400')}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OnlinePlants_pct(n) { return Math.round((n / PLANTS.length) * 100); }
