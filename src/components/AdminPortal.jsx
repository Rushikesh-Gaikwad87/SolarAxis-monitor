import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Users, Building2, Sun, DollarSign, AlertTriangle,
  LogOut, ChevronRight, ChevronDown, ChevronUp, X, Search, Plus,
  ShieldCheck, Monitor, Activity, TrendingUp, Mail, Phone, MapPin,
  CheckCircle, XCircle, Clock, BarChart3, Zap, Leaf, RefreshCw,
  Eye, Download, Ban, Star, FileText, Bell, Settings
} from 'lucide-react';
import { VENDORS, CUSTOMERS, PLANTS, ALERTS, MONTHLY_DATA } from '../data/mockData';
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

// ── AUDIT LOG DATA ────────────────────────────────────────────────────────────
const AUDIT_LOG = [
  { id: 1, actor: 'Admin', action: 'Suspended vendor VoltEdge Power', time: '10:42 AM', type: 'warning' },
  { id: 2, actor: 'SunTech Solutions', action: 'Added customer: Rajesh Patel', time: '09:15 AM', type: 'info' },
  { id: 3, actor: 'Admin', action: 'Login from 103.21.45.12 (Pune)', time: '08:30 AM', type: 'success' },
  { id: 4, actor: 'GreenGrid Energy', action: 'Added plant: City Mall Phase 2 (100kW)', time: 'Yesterday', type: 'info' },
  { id: 5, actor: 'Admin', action: 'Reset API key for BrightWave Solar', time: 'Yesterday', type: 'warning' },
  { id: 6, actor: 'VoltEdge Power', action: 'Login attempt failed – wrong password', time: '2 days ago', type: 'error' },
  { id: 7, actor: 'SunTech Solutions', action: 'Exported monthly report (April 2026)', time: '2 days ago', type: 'info' },
];

const PLAN_COLORS = { Enterprise: 'text-purple-400 bg-purple-500/10 border-purple-500/20', Premium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', Standard: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
const STATUS_COLORS = { active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', trial: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', suspended: 'text-red-400 bg-red-500/10 border-red-500/20' };

function Badge({ label, cls }) { return <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', cls)}>{label}</span>; }

// ── PLATFORM OVERVIEW TAB ─────────────────────────────────────────────────────
function OverviewTab() {
  const totalCap = VENDORS.reduce((s, v) => s + v.capacity, 0);
  const totalRev = VENDORS.reduce((s, v) => s + v.monthlyRevenue, 0);
  const totalGen = PLANTS.reduce((s, p) => s + p.todayGen, 0).toFixed(1);
  const co2 = PLANTS.reduce((s, p) => s + p.co2, 0).toFixed(1);
  const kpis = [
    { label: 'Total Vendors',   value: VENDORS.length,                                     sub: `${VENDORS.filter(v=>v.status==='active').length} active`,       icon: Building2,     color: 'blue'   },
    { label: 'Total Customers', value: CUSTOMERS.length,                                    sub: 'Across all vendors',                                            icon: Users,          color: 'indigo' },
    { label: 'Installed MW',    value: `${(totalCap/1000).toFixed(2)} MW`,                 sub: `${PLANTS.length} plants`,                                        icon: Sun,            color: 'yellow' },
    { label: 'Today Generation',value: `${totalGen} kWh`,                                  sub: 'Live across fleet',                                              icon: Zap,            color: 'emerald'},
    { label: 'Platform MRR',    value: `₹${(totalRev/1000).toFixed(0)}K`,                  sub: 'Monthly recurring',                                              icon: DollarSign,     color: 'green'  },
    { label: 'CO₂ Saved',       value: `${co2} T`,                                         sub: 'This month',                                                     icon: Leaf,           color: 'teal'   },
    { label: 'Active Alerts',   value: ALERTS.filter(a=>!a.resolved).length,               sub: `${ALERTS.filter(a=>a.severity==='critical'&&!a.resolved).length} critical`, icon: AlertTriangle, color: 'red'  },
    { label: 'Uptime',          value: '99.1%',                                             sub: 'Platform SLA',                                                   icon: Activity,       color: 'purple' },
  ];

  const revenueData = VENDORS.map(v => ({ name: v.initials, rev: v.monthlyRevenue, color: v.color }));
  const statusData  = [
    { name: 'Online',  value: PLANTS.filter(p=>p.status==='online').length,  fill: '#10b981' },
    { name: 'Offline', value: PLANTS.filter(p=>p.status==='offline').length, fill: '#64748b' },
    { name: 'Fault',   value: PLANTS.filter(p=>p.status==='fault').length,   fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k,i) => (
          <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-[#0b1628] border border-slate-800 rounded-2xl p-3 hover:border-slate-700 transition-all">
            <div className={cn('w-7 h-7 rounded-xl flex items-center justify-center mb-2', `bg-${k.color}-500/10`)}>
              <k.icon className={cn('w-3.5 h-3.5', `text-${k.color}-400`)} />
            </div>
            <p className="text-lg font-bold text-slate-100">{k.value}</p>
            <p className="text-[10px] text-slate-500">{k.label}</p>
            <p className="text-[9px] text-slate-600 mt-0.5">{k.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Vendor Revenue Bar */}
        <div className="lg:col-span-2 bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-400"/>Vendor Monthly Revenue (₹)</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{top:0,right:0,bottom:0,left:-10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                <Tooltip contentStyle={{background:'#0f1f35',border:'1px solid #1e293b',borderRadius:10,fontSize:12}} formatter={v=>[`₹${v.toLocaleString()}`,'Revenue']}/>
                <Bar dataKey="rev" radius={[6,6,0,0]}>
                  {revenueData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fleet Status Donut */}
        <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400"/>Fleet Status</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={36} outerRadius={56} dataKey="value" strokeWidth={0}>
                    {statusData.map((d,i)=><Cell key={i} fill={d.fill}/>)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2 text-xs">
              {statusData.map(s=>(
                <div key={s.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:s.fill}}/>{s.name}</span>
                  <span className="font-bold text-slate-300">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Leaderboard */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Top Vendors by Revenue</p>
            {[...VENDORS].sort((a,b)=>b.monthlyRevenue-a.monthlyRevenue).map((v,i)=>(
              <div key={v.id} className="flex items-center gap-2 mb-2 text-xs">
                <span className="text-slate-600 w-4">#{i+1}</span>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{background:`${v.color}25`,color:v.color}}>{v.initials}</span>
                <span className="flex-1 text-slate-400 truncate">{v.name}</span>
                <span className="font-bold text-emerald-400">₹{(v.monthlyRevenue/1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400"/>Platform Generation Trend (kWh)</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_DATA} margin={{top:0,right:0,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
              <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false}/>
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:'#0f1f35',border:'1px solid #1e293b',borderRadius:10,fontSize:12}}/>
              <Area type="monotone" dataKey="gen" stroke="#3b82f6" strokeWidth={2} fill="url(#ag)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-red-400"/>Platform Alerts</h3>
        <div className="space-y-2">
          {ALERTS.filter(a=>!a.resolved).map(a=>(
            <div key={a.id} className={cn('flex items-start gap-3 p-3 rounded-xl border text-xs',
              a.severity==='critical'?'border-red-500/20 bg-red-500/5':a.severity==='warning'?'border-yellow-500/20 bg-yellow-500/5':'border-blue-500/20 bg-blue-500/5')}>
              <AlertTriangle className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5',a.severity==='critical'?'text-red-400':a.severity==='warning'?'text-yellow-400':'text-blue-400')}/>
              <div><p className="font-semibold text-slate-200">{a.plant}</p><p className="text-slate-500 mt-0.5">{a.message}</p></div>
              <span className="ml-auto text-slate-600 whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VENDOR DETAIL PANEL ───────────────────────────────────────────────────────
function VendorDetail({ vendor, onBack }) {
  const customers = CUSTOMERS.filter(c => c.vendorId === vendor.id);
  const plants    = PLANTS.filter(p => p.vendorId === vendor.id);
  const [selCust, setSelCust] = useState(null);

  return (
    <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={onBack} className="hover:text-blue-400 transition-colors">Vendors</button>
        <ChevronRight className="w-4 h-4"/>
        <span className="text-slate-200 font-semibold">{vendor.name}</span>
      </div>

      {/* Vendor Header */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{background:`${vendor.color}20`,color:vendor.color}}>{vendor.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-100">{vendor.name}</h2>
            <Badge label={vendor.status.toUpperCase()} cls={STATUS_COLORS[vendor.status]}/>
            <Badge label={vendor.plan} cls={PLAN_COLORS[vendor.plan]}/>
          </div>
          <p className="text-sm text-slate-400">{vendor.owner} · <span className="text-slate-600">{vendor.email}</span></p>
          <p className="text-xs text-slate-600 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/>{vendor.city}, {vendor.state} · Member since {vendor.joinDate}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center flex-shrink-0">
          {[
            {l:'Customers',v:vendor.customers,c:'text-blue-400'},
            {l:'Plants',v:vendor.plants,c:'text-emerald-400'},
            {l:'MRR',v:`₹${(vendor.monthlyRevenue/1000).toFixed(0)}K`,c:'text-yellow-400'},
          ].map(s=>(
            <div key={s.l}><p className={cn('text-xl font-bold',s.c)}>{s.v}</p><p className="text-[10px] text-slate-500">{s.l}</p></div>
          ))}
        </div>
      </div>

      {/* Customers of this Vendor */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400"/><h3 className="font-bold text-sm text-slate-100">Customers ({customers.length})</h3>
        </div>
        <div className="divide-y divide-slate-800/60">
          {customers.map(c=>{
            const custPlants = plants.filter(p=>p.customer===c.name);
            const isOpen = selCust===c.id;
            return (
              <div key={c.id}>
                <button onClick={()=>setSelCust(isOpen?null:c.id)} className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/20 transition-colors text-left">
                  <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center font-bold text-blue-300 text-sm flex-shrink-0">{c.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-100 text-sm">{c.name}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{c.city} · {c.email}</p>
                  </div>
                  <Badge label={c.tier} cls={PLAN_COLORS[c.tier]||'text-slate-400 bg-slate-500/10 border-slate-500/20'}/>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    c.status==='active'?'text-emerald-400 bg-emerald-500/10 border-emerald-500/20':c.status==='fault'?'text-red-400 bg-red-500/10 border-red-500/20':'text-slate-400 bg-slate-700 border-slate-600')}>
                    {c.status}
                  </span>
                  <p className="text-sm font-bold text-emerald-400 hidden sm:block">₹{c.monthlySavings.toLocaleString()}<span className="text-[10px] text-slate-600 font-normal">/mo</span></p>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0"/> : <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0"/>}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                      className="overflow-hidden border-t border-slate-800/50">
                      <div className="p-4 bg-slate-900/30 space-y-3">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Sun className="w-3 h-3 text-yellow-400"/>Plants ({custPlants.length})</p>
                        {custPlants.length === 0 && <p className="text-xs text-slate-600">No plants linked.</p>}
                        {custPlants.map(pl=>(
                          <div key={pl.id} className="flex items-center gap-3 bg-[#0b1628] border border-slate-800 rounded-xl p-3 text-xs">
                            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                              <Sun className="w-4 h-4 text-yellow-400"/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-200 truncate">{pl.name}</p>
                              <p className="text-slate-600 flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{pl.location} · {pl.capacity}kW · {pl.brand}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-400">{pl.todayGen} kWh</p>
                              <p className="text-slate-600">today</p>
                            </div>
                            <span className={cn('px-2 py-0.5 rounded-full font-bold',
                              pl.status==='online'?'bg-emerald-500/10 text-emerald-400':pl.status==='offline'?'bg-slate-700 text-slate-400':'bg-red-500/10 text-red-400')}>
                              {pl.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plants Summary */}
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-400"/><h3 className="font-bold text-sm text-slate-100">All Plants ({plants.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-800 text-slate-500">
              {['Plant','Location','Capacity','Brand','Today Gen','Performance','Status'].map(h=>(
                <th key={h} className="text-left px-4 py-2.5 font-semibold tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {plants.map(p=>(
                <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-slate-200">{p.name.split('–')[0].trim()}</td>
                  <td className="px-4 py-2.5 text-slate-500">{p.location}</td>
                  <td className="px-4 py-2.5 text-slate-300">{p.capacity} kW</td>
                  <td className="px-4 py-2.5 text-slate-400">{p.brand}</td>
                  <td className="px-4 py-2.5 font-bold text-blue-400">{p.todayGen} kWh</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${p.performance}%`,background:p.performance>85?'#10b981':p.performance>50?'#f59e0b':'#ef4444'}}/>
                      </div>
                      <span className="text-slate-400">{p.performance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={cn('px-2 py-0.5 rounded-full font-bold',
                      p.status==='online'?'bg-emerald-500/10 text-emerald-400':p.status==='offline'?'bg-slate-700 text-slate-400':'bg-red-500/10 text-red-400')}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// ── VENDORS TAB ───────────────────────────────────────────────────────────────
function VendorsTab() {
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]   = useState('all');

  if (selected) return <VendorDetail vendor={selected} onBack={()=>setSelected(null)}/>;

  const filtered = VENDORS.filter(v=>{
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.owner.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==='all' || v.status===filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vendors..."
            className="w-full bg-[#0b1628] border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"/>
        </div>
        <div className="flex gap-2">
          {['all','active','trial','suspended'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={cn('px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all',
                filter===f?'bg-blue-600 text-white':'bg-slate-800/60 text-slate-500 hover:text-slate-300')}>
              {f}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-95">
          <Plus className="w-4 h-4"/> Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((v,i)=>(
          <motion.div key={v.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
            className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base flex-shrink-0"
                style={{background:`${v.color}20`,color:v.color}}>{v.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-slate-100">{v.name}</h3>
                  <Badge label={v.status.toUpperCase()} cls={STATUS_COLORS[v.status]}/>
                  <Badge label={v.plan} cls={PLAN_COLORS[v.plan]}/>
                </div>
                <p className="text-xs text-slate-400">{v.owner}</p>
                <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5"/>{v.city}, {v.state}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4 text-center">
              {[
                {l:'Customers',v:v.customers,c:'text-blue-400'},
                {l:'Plants',v:v.plants,c:'text-emerald-400'},
                {l:'Capacity',v:`${v.capacity}kW`,c:'text-yellow-400'},
                {l:'MRR',v:`₹${(v.monthlyRevenue/1000).toFixed(0)}K`,c:'text-purple-400'},
              ].map(s=>(
                <div key={s.l} className="bg-slate-900/50 rounded-xl py-2">
                  <p className={cn('text-sm font-bold',s.c)}>{s.v}</p>
                  <p className="text-[9px] text-slate-600">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={()=>setSelected(v)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-500/20 transition-all">
                <Eye className="w-3.5 h-3.5"/> View Details
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 text-xs font-bold border border-slate-700 transition-all">
                <Download className="w-3.5 h-3.5"/>
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 transition-all">
                <Ban className="w-3.5 h-3.5"/>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── ALL CUSTOMERS TAB ─────────────────────────────────────────────────────────
function AllCustomersTab() {
  const [search, setSearch] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');

  const filtered = CUSTOMERS.filter(c=>{
    const matchS = c.name.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
    const matchV = vendorFilter==='all' || c.vendorId===vendorFilter;
    return matchS && matchV;
  });

  const TIER_CFG = { Basic:'text-slate-400 bg-slate-500/10 border-slate-500/20', Standard:'text-blue-400 bg-blue-500/10 border-blue-500/20', Premium:'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', Enterprise:'text-purple-400 bg-purple-500/10 border-purple-500/20' };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search customers..."
            className="w-full bg-[#0b1628] border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"/>
        </div>
        <select value={vendorFilter} onChange={e=>setVendorFilter(e.target.value)}
          className="bg-[#0b1628] border border-slate-800 rounded-2xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none">
          <option value="all">All Vendors</option>
          {VENDORS.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
      </div>

      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-800 text-slate-500">
              {['Customer','Vendor','Contact','Tier','Plants','Savings','Status'].map(h=>(
                <th key={h} className="text-left px-4 py-3 font-semibold tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((c,i)=>{
                const vendor = VENDORS.find(v=>v.id===c.vendorId);
                return (
                  <motion.tr key={c.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center font-bold text-blue-300 text-xs flex-shrink-0">{c.name.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-slate-100">{c.name}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{c.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {vendor && <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full" style={{background:`${vendor.color}20`,color:vendor.color}}><span className="w-1.5 h-1.5 rounded-full" style={{background:vendor.color}}/>{vendor.name}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500"><p className="flex items-center gap-1"><Mail className="w-3 h-3"/>{c.email}</p></td>
                    <td className="px-4 py-3"><Badge label={c.tier} cls={TIER_CFG[c.tier]}/></td>
                    <td className="px-4 py-3 text-slate-300 font-semibold">{c.plants}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">₹{c.monthlySavings.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={cn('font-bold px-2 py-0.5 rounded-full text-[10px]',
                        c.status==='active'?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20':c.status==='fault'?'bg-red-500/10 text-red-400 border border-red-500/20':'bg-slate-700 text-slate-400 border border-slate-600')}>
                        {c.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0 && <div className="text-center py-10 text-slate-600"><Users className="w-8 h-8 mx-auto mb-2 opacity-30"/><p>No customers found</p></div>}
        </div>
      </div>
    </div>
  );
}

// ── ALL PLANTS TAB ────────────────────────────────────────────────────────────
function AllPlantsTab() {
  const [search, setSearch] = useState('');
  const filtered = PLANTS.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.location.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search plants..."
          className="w-full bg-[#0b1628] border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"/>
      </div>
      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-slate-800 text-slate-500">
              {['Plant','Vendor','Customer','Location','Capacity','Brand','Today','Status'].map(h=>(
                <th key={h} className="text-left px-4 py-3 font-semibold tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p,i)=>{
                const vendor = VENDORS.find(v=>v.id===p.vendorId);
                return (
                  <motion.tr key={p.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}
                    className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-200">{p.name.split('–')[0].trim()}</td>
                    <td className="px-4 py-3">{vendor&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:`${vendor.color}20`,color:vendor.color}}>{vendor.name}</span>}</td>
                    <td className="px-4 py-3 text-slate-400">{p.customer}</td>
                    <td className="px-4 py-3 text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5"/>{p.location}</td>
                    <td className="px-4 py-3 text-slate-300">{p.capacity} kW</td>
                    <td className="px-4 py-3 text-slate-400">{p.brand}</td>
                    <td className="px-4 py-3 font-bold text-blue-400">{p.todayGen} kWh</td>
                    <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded-full font-bold',p.status==='online'?'bg-emerald-500/10 text-emerald-400':p.status==='offline'?'bg-slate-700 text-slate-400':'bg-red-500/10 text-red-400')}>{p.status}</span></td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── FINANCIALS TAB ────────────────────────────────────────────────────────────
function FinancialsTab() {
  const totalMRR  = VENDORS.reduce((s,v)=>s+v.monthlyRevenue,0);
  const totalARR  = totalMRR * 12;
  const revenueData = VENDORS.map(v=>({name:v.name.split(' ')[0],mrr:v.monthlyRevenue,total:v.totalRevenue,color:v.color}));
  const invoices = [
    {vendor:'SunTech Solutions',  amount:52800, due:'Apr 10', status:'paid'},
    {vendor:'GreenGrid Energy',   amount:89000, due:'Apr 12', status:'pending'},
    {vendor:'VoltEdge Power',     amount:3800,  due:'Apr 15', status:'overdue'},
    {vendor:'BrightWave Solar',   amount:24000, due:'Apr 18', status:'paid'},
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {l:'Platform MRR', v:`₹${(totalMRR/1000).toFixed(0)}K`, c:'text-emerald-400', ic:DollarSign},
          {l:'Platform ARR', v:`₹${(totalARR/100000).toFixed(1)}L`, c:'text-blue-400', ic:TrendingUp},
          {l:'Total Revenue', v:`₹${(VENDORS.reduce((s,v)=>s+v.totalRevenue,0)/100000).toFixed(1)}L`, c:'text-purple-400', ic:BarChart3},
          {l:'Paid Invoices', v:`${invoices.filter(i=>i.status==='paid').length}/${invoices.length}`, c:'text-yellow-400', ic:CheckCircle},
        ].map((k,i)=>(
          <div key={i} className="bg-[#0b1628] border border-slate-800 rounded-2xl p-4">
            <k.ic className={cn('w-5 h-5 mb-2',k.c)}/>
            <p className={cn('text-2xl font-bold',k.c)}>{k.v}</p>
            <p className="text-[11px] text-slate-500">{k.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-emerald-400"/>Revenue by Vendor</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{top:0,right:0,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
              <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={{background:'#0f1f35',border:'1px solid #1e293b',borderRadius:10,fontSize:12}} formatter={v=>[`₹${v.toLocaleString()}`]}/>
              <Bar dataKey="mrr" name="MRR" radius={[6,6,0,0]}>{revenueData.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2"><FileText className="w-4 h-4 text-yellow-400"/><h3 className="font-bold text-sm">Invoice Status</h3></div>
        <div className="divide-y divide-slate-800/60">
          {invoices.map((inv,i)=>(
            <div key={i} className="flex items-center gap-4 px-4 py-3 text-sm hover:bg-slate-800/20 transition-colors">
              <p className="flex-1 font-semibold text-slate-200">{inv.vendor}</p>
              <p className="font-bold text-slate-100">₹{inv.amount.toLocaleString()}</p>
              <p className="text-slate-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3"/>Due {inv.due}</p>
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
                inv.status==='paid'?'text-emerald-400 bg-emerald-500/10 border-emerald-500/20':inv.status==='overdue'?'text-red-400 bg-red-500/10 border-red-500/20':'text-yellow-400 bg-yellow-500/10 border-yellow-500/20')}>
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AUDIT LOG TAB ─────────────────────────────────────────────────────────────
function AuditLogTab() {
  const iconMap = {success:<CheckCircle className="w-3.5 h-3.5 text-emerald-400"/>, info:<Activity className="w-3.5 h-3.5 text-blue-400"/>, warning:<AlertTriangle className="w-3.5 h-3.5 text-yellow-400"/>, error:<XCircle className="w-3.5 h-3.5 text-red-400"/>};
  const bgMap  = {success:'border-emerald-500/20 bg-emerald-500/5', info:'border-blue-500/20 bg-blue-500/5', warning:'border-yellow-500/20 bg-yellow-500/5', error:'border-red-500/20 bg-red-500/5'};
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{AUDIT_LOG.length} events recorded</p>
        <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-xl">
          <Download className="w-3.5 h-3.5"/> Export Log
        </button>
      </div>
      {AUDIT_LOG.map((log,i)=>(
        <motion.div key={log.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
          className={cn('flex items-start gap-3 p-4 rounded-2xl border text-sm', bgMap[log.type])}>
          <div className="flex-shrink-0 mt-0.5">{iconMap[log.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-200">{log.action}</p>
            <p className="text-xs text-slate-500 mt-0.5">by <span className="text-slate-400 font-semibold">{log.actor}</span></p>
          </div>
          <span className="text-[10px] text-slate-600 whitespace-nowrap flex items-center gap-1 flex-shrink-0"><Clock className="w-3 h-3"/>{log.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ── ADMIN SIDEBAR ─────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { id:'overview',    label:'Overview',       icon: LayoutDashboard },
  { id:'vendors',     label:'Vendors',        icon: Building2       },
  { id:'customers',   label:'All Customers',  icon: Users           },
  { id:'plants',      label:'All Plants',     icon: Sun             },
  { id:'financials',  label:'Financials',     icon: DollarSign      },
  { id:'audit',       label:'Audit Log',      icon: FileText        },
];

// ── MAIN ADMIN PORTAL ─────────────────────────────────────────────────────────
export default function AdminPortal({ onLogout }) {
  const [tab, setTab] = useState('overview');

  const content = {
    overview:   <OverviewTab/>,
    vendors:    <VendorsTab/>,
    customers:  <AllCustomersTab/>,
    plants:     <AllPlantsTab/>,
    financials: <FinancialsTab/>,
    audit:      <AuditLogTab/>,
  };

  const PAGE_TITLES = { overview:'Platform Overview', vendors:'Vendor Management', customers:'All Customers', plants:'All Plants', financials:'Financials', audit:'Audit Log' };

  return (
    <div className="flex h-screen text-slate-100 overflow-hidden" style={{background:'#020617'}}>
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[#070d1e] border-r border-slate-800/80 p-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
            <ShieldCheck className="w-5 h-5 text-white"/>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight">Solar<span className="text-red-400">Axis</span></span>
            <p className="text-[9px] text-red-400 font-bold tracking-widest uppercase">Admin Console</p>
          </div>
        </div>

        {/* Platform health pill */}
        <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-3 py-2 mb-6 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"/>
          <span className="text-emerald-400 font-semibold">All Systems Operational</span>
        </div>

        <nav className="flex-1 space-y-1">
          {ADMIN_NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              className={cn('w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all text-sm group',
                tab===n.id?'bg-red-600/90 text-white shadow-lg shadow-red-600/20':'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200')}>
              <n.icon className={cn('w-[18px] h-[18px]',tab===n.id?'text-white':'text-slate-600 group-hover:text-red-400 transition-colors')}/>
              <span className="font-medium">{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Stats summary */}
        <div className="mt-4 bg-slate-800/30 border border-slate-800 rounded-2xl p-3 space-y-1.5 text-[11px] text-slate-500 mb-4">
          <div className="flex justify-between"><span>Total Vendors</span><span className="font-bold text-slate-300">{VENDORS.length}</span></div>
          <div className="flex justify-between"><span>Total Customers</span><span className="font-bold text-slate-300">{CUSTOMERS.length}</span></div>
          <div className="flex justify-between"><span>Platform MRR</span><span className="font-bold text-emerald-400">₹{(VENDORS.reduce((s,v)=>s+v.monthlyRevenue,0)/1000).toFixed(0)}K</span></div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-500/5 border border-red-500/10 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-300 font-bold text-sm">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200">Super Admin</p>
              <p className="text-[10px] text-slate-500">admin@solaraxis.io</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold">
            <LogOut className="w-4 h-4"/> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-slate-800/60 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-100">{PAGE_TITLES[tab]}</h1>
            <p className="text-xs text-slate-500 mt-0.5">SolarAxis Admin Console · Full Platform Access</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5"/> ADMIN SESSION
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Last sync: 1 min ago
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.15}}>
              {content[tab]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
