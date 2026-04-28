import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, MapPin, Zap, TrendingUp, Calendar, Wifi, WifiOff,
  AlertTriangle, ChevronRight, Eye, Plus, Search, Filter,
  BarChart3, ArrowUpRight, Thermometer, X, CheckCircle, Save
} from 'lucide-react';
import { PLANTS as INITIAL_PLANTS, CUSTOMERS } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const PLANT_GEN = [32,48,72,95,108,102,88,65,40,18];

const INVERTER_BRANDS = ['Sungrow','Huawei','Growatt','Goodwe','SMA','Solis','Fronius','Delta','ABB','Schneider','Polycab','Waaree','UTL','Other'];

function PlantCard({ plant, onClick }) {
  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
      className="bg-[#0b1628] border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all cursor-pointer group"
      onClick={() => onClick(plant)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Sun className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="font-bold text-slate-100 text-sm leading-tight">{plant.name.split('–')[0].trim()}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5" />{plant.location}
            </p>
          </div>
        </div>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
          plant.status==='online' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : plant.status==='fault' ? 'border-red-500/30 bg-red-500/10 text-red-400'
          : 'border-slate-700 bg-slate-800 text-slate-500')}>
          {plant.status==='online' ? '● Online' : plant.status==='fault' ? '⚠ Fault' : '○ Offline'}
        </span>
      </div>

      {/* Mini sparkline — explicit height on wrapper + ResponsiveContainer avoids -1 warning */}
      <div className="mb-4" style={{ height: 56 }}>
        <ResponsiveContainer width="100%" height={56}>
          <AreaChart data={PLANT_GEN.map((v,i)=>({t:i,v: plant.status==='online'?v*(plant.capacity/50):0}))} margin={{top:0,right:0,bottom:0,left:0}}>
            <defs><linearGradient id={`g${plant.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient></defs>
            <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={1.5} fill={`url(#g${plant.id})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-slate-900/50 rounded-xl p-2">
          <p className="text-[10px] text-slate-500">Capacity</p>
          <p className="text-xs font-bold text-slate-200">{plant.capacity} kW</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-2">
          <p className="text-[10px] text-slate-500">Today</p>
          <p className="text-xs font-bold text-blue-400">{plant.todayGen} kWh</p>
        </div>
        <div className="bg-slate-900/50 rounded-xl p-2">
          <p className="text-[10px] text-slate-500">Perf.</p>
          <p className="text-xs font-bold" style={{color:plant.performance>85?'#10b981':plant.performance>50?'#f59e0b':'#ef4444'}}>{plant.performance}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-600">
        <span className="flex items-center gap-1">{plant.brand}</span>
        <span className="flex items-center gap-1 text-slate-500 group-hover:text-blue-400 transition-colors">
          View Details <ChevronRight className="w-3 h-3"/>
        </span>
      </div>
    </motion.div>
  );
}

function PlantDetailModal({ plant, onClose }) {
  if (!plant) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={onClose}>
        <motion.div initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} exit={{y:100,opacity:0}}
          className="bg-[#0b1628] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
          onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-slate-100">{plant.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/>{plant.location}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4"/></button>
          </div>
          <div className="p-5 space-y-4">
            {/* Status banner */}
            <div className={cn('flex items-center gap-2 p-3 rounded-xl text-sm font-semibold',
              plant.status==='online'?'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              :plant.status==='fault'?'bg-red-500/10 border border-red-500/20 text-red-400'
              :'bg-slate-800 border border-slate-700 text-slate-400')}>
              {plant.status==='online'?<CheckCircle className="w-4 h-4"/>:<AlertTriangle className="w-4 h-4"/>}
              {plant.status==='online'?'System Running Normally':plant.status==='fault'?'Fault Detected – Maintenance Required':'Inverter Offline'}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {label:'Capacity',v:`${plant.capacity} kW`},{label:"Today's Gen",v:`${plant.todayGen} kWh`},
                {label:'Monthly Gen',v:`${plant.monthGen} kWh`},{label:'Total Gen',v:`${plant.totalGen} kWh`},
                {label:'Performance',v:`${plant.performance}%`},{label:'Monthly Savings',v:`₹${plant.savings.toLocaleString()}`},
                {label:'CO₂ Saved',v:`${plant.co2} T`},{label:'Install Date',v:plant.installDate},
              ].map(m => (
                <div key={m.label} className="bg-slate-900/50 rounded-xl p-3">
                  <p className="text-[10px] text-slate-500 mb-0.5">{m.label}</p>
                  <p className="font-bold text-slate-100 text-sm">{m.v}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">Customer</p>
              <p className="font-semibold text-slate-200">{plant.customer}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 mb-1">Inverter Brand</p>
              <p className="font-semibold text-slate-200">{plant.brand}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Add Plant Modal ────────────────────────────────────────────────────────────
function AddPlantModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    customer: CUSTOMERS[0]?.name || '',
    location: '',
    capacity: '',
    brand: 'Sungrow',
    status: 'online',
    installDate: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Plant name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.capacity || isNaN(form.capacity) || +form.capacity <= 0) e.capacity = 'Enter a valid capacity in kW';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate save
    const newPlant = {
      id: Date.now(),
      vendorId: 'v1',
      name: form.name.includes('–') ? form.name : `${form.name} – ${form.customer}`,
      location: form.location,
      capacity: parseFloat(form.capacity),
      brand: form.brand,
      status: form.status,
      todayGen: form.status === 'online' ? parseFloat((+form.capacity * 3.8).toFixed(1)) : 0,
      monthGen: form.status === 'online' ? Math.round(+form.capacity * 85) : 0,
      totalGen: Math.round(+form.capacity * 800),
      performance: form.status === 'online' ? Math.floor(Math.random() * 10 + 88) : 0,
      lastSync: 'Just now',
      customer: form.customer,
      installDate: form.installDate,
      savings: Math.round(+form.capacity * 850),
      co2: parseFloat((+form.capacity * 0.82).toFixed(1)),
      lat: 18.52, lng: 73.85,
    };
    setSaving(false);
    onAdd(newPlant);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={onClose}>
        <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
          className="bg-[#0b1628] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
          onClick={e=>e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-[#0b1628] z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                <Sun className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100">Add New Plant</h2>
                <p className="text-[11px] text-slate-500">Fill in plant details to register</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"><X className="w-4 h-4"/></button>
          </div>

          {/* Form fields */}
          <div className="p-5 space-y-4">

            {/* Plant Name */}
            <div>
              <label htmlFor="plant-name" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                Plant Name <span className="text-blue-400">*</span>
              </label>
              <input id="plant-name" value={form.name} onChange={e=>set('name',e.target.value)}
                type="text" placeholder="e.g. Sharma Farm – Rooftop"
                className={cn('w-full bg-[#0f172a] border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors',
                  errors.name ? 'border-red-500/50' : 'border-slate-800')} />
              {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Customer */}
            <div>
              <label htmlFor="plant-customer" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Customer</label>
              <select id="plant-customer" value={form.customer} onChange={e=>set('customer',e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none">
                {CUSTOMERS.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                <option value="Other">Other / New Customer</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="plant-location" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                Location <span className="text-blue-400">*</span>
              </label>
              <input id="plant-location" value={form.location} onChange={e=>set('location',e.target.value)}
                type="text" placeholder="e.g. Pune, MH"
                className={cn('w-full bg-[#0f172a] border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors',
                  errors.location ? 'border-red-500/50' : 'border-slate-800')} />
              {errors.location && <p className="text-[10px] text-red-400 mt-1">{errors.location}</p>}
            </div>

            {/* Capacity & Brand */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="plant-capacity" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                  Capacity (kW) <span className="text-blue-400">*</span>
                </label>
                <input id="plant-capacity" value={form.capacity} onChange={e=>set('capacity',e.target.value)}
                  type="number" min="0.5" step="0.5" placeholder="e.g. 10"
                  className={cn('w-full bg-[#0f172a] border rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors',
                    errors.capacity ? 'border-red-500/50' : 'border-slate-800')} />
                {errors.capacity && <p className="text-[10px] text-red-400 mt-1">{errors.capacity}</p>}
              </div>
              <div>
                <label htmlFor="plant-brand" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Inverter Brand</label>
                <select id="plant-brand" value={form.brand} onChange={e=>set('brand',e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none">
                  {INVERTER_BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Install Date & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="plant-install-date" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Install Date</label>
                <input id="plant-install-date" value={form.installDate} onChange={e=>set('installDate',e.target.value)}
                  type="date"
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors" />
              </div>
              <div>
                <label htmlFor="plant-status" className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">Status</label>
                <select id="plant-status" value={form.status} onChange={e=>set('status',e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="fault">Fault</option>
                </select>
              </div>
            </div>

            {/* Preview tile */}
            {form.name && form.capacity && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{form.name}</p>
                  <p className="text-[10px] text-slate-500">{form.location || 'No location'} · {form.capacity} kW · {form.brand}</p>
                </div>
                <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full',
                  form.status==='online'?'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20':
                  form.status==='fault'?'bg-red-500/10 text-red-400 border border-red-500/20':
                  'bg-slate-700 text-slate-500 border border-slate-600')}>
                  {form.status}
                </span>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 text-sm font-bold hover:border-slate-600 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : <><Save className="w-4 h-4" /> Add Plant</>}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PlantsPage() {
  const [plants, setPlants] = useState(INITIAL_PLANTS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showAddPlant, setShowAddPlant] = useState(false);

  const filtered = plants.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const totalCap = plants.reduce((s,p)=>s+p.capacity,0);
  const totalGen = plants.reduce((s,p)=>s+p.todayGen,0).toFixed(0);

  const handleAddPlant = (newPlant) => {
    setPlants(prev => [newPlant, ...prev]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Solar Plants</h1>
          <p className="text-xs text-slate-500 mt-0.5">{plants.length} plants · {totalCap} kW total · {totalGen} kWh today</p>
        </div>
        <button
          onClick={() => setShowAddPlant(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-2xl transition-all active:scale-95 self-start sm:self-auto shadow-lg shadow-blue-600/20">
          <Plus className="w-4 h-4"/> Add Plant
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search plants or locations..."
            className="w-full bg-[#0b1628] border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','online','offline','fault'].map(s => (
            <button key={s} onClick={()=>setFilter(s)}
              className={cn('px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all',
                filter===s ? 'bg-blue-600 text-white' : 'bg-[#0b1628] border border-slate-800 text-slate-400 hover:border-slate-700')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <Sun className="w-10 h-10 mx-auto mb-3 opacity-30"/>
          <p className="font-semibold">No plants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => <PlantCard key={p.id} plant={p} onClick={setSelectedPlant}/>)}
        </div>
      )}

      <PlantDetailModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />

      {showAddPlant && (
        <AddPlantModal
          onClose={() => setShowAddPlant(false)}
          onAdd={handleAddPlant}
        />
      )}
    </div>
  );
}
