import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi, WifiOff, Activity, Zap, Thermometer, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Plus, Trash2, Settings,
  Clock, BarChart3, ChevronDown, ChevronUp, Radio, Signal,
  Database, Server, Shield, TrendingUp, TrendingDown, Minus,
  Search, Filter, Eye, Power, ChevronsRight, QrCode, Smartphone,
  Router, ScanLine, Wifi as WifiIcon, Lock
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

// ── MODBUS BRAND REGISTER MAPPINGS ────────────────────────────────────────────
const MODBUS_BRANDS = [
  { id: 'growatt',   name: 'Growatt',    color: '#f59e0b', icon: '🌱', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'sungrow',   name: 'Sungrow',    color: '#3b82f6', icon: '⚡', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'solis',     name: 'Solis',      color: '#06b6d4', icon: '☀️', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'goodwe',    name: 'GoodWe',     color: '#10b981', icon: '🌿', port: 502, slaveId: 247,protocol: 'Modbus TCP' },
  { id: 'huawei',    name: 'Huawei',     color: '#ef4444', icon: '📡', port: 6607,slaveId: 0,  protocol: 'Modbus TCP' },
  { id: 'sma',       name: 'SMA',        color: '#8b5cf6', icon: '🔆', port: 502, slaveId: 3,  protocol: 'Modbus TCP' },
  { id: 'fronius',   name: 'Fronius',    color: '#0284c7', icon: '💎', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'delta',     name: 'Delta',      color: '#f97316', icon: '🔷', port: 8899,slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'abb',       name: 'ABB / FIMER',color: '#ec4899', icon: '🔌', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'schneider', name: 'Schneider',  color: '#22c55e', icon: '⚙️', port: 502, slaveId: 255,protocol: 'Modbus TCP' },
  { id: 'polycab',   name: 'Polycab',    color: '#a855f7', icon: '💡', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'waaree',    name: 'Waaree',     color: '#f43f5e', icon: '🔴', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'solaria',   name: 'Solaria',    color: '#d97706', icon: '🌞', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'hitachi',   name: 'Hitachi',    color: '#64748b', icon: '🏭', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
  { id: 'tmeic',     name: 'TMEIC',      color: '#0ea5e9', icon: '🌐', port: 502, slaveId: 1,  protocol: 'Modbus TCP' },
];

// ── MODBUS REGISTER MAP (per brand) ──────────────────────────────────────────
// Register map: addrs match the driver JSON files in backend/drivers/
const REGISTER_MAP = {
  // ── From backend/drivers/growatt.json ─────────────────────────────────────
  growatt:   { power: 30003, acVoltage: 30007, dcVoltage: 30001, dcCurrent: 30002, frequency: 30009, temp: 30017, dailyGen: 30013, totalGen: 30015, status: 30025 },
  // ── From backend/drivers/sungrow.json ─────────────────────────────────────
  sungrow:   { power: 5031,  acVoltage: 5019,  dcVoltage: 5011,  dcCurrent: 5012,  frequency: 5036,  temp: 5041,  dailyGen: 5003,  totalGen: 5004,  status: 5038  },
  // ── From backend/drivers/solis.json ───────────────────────────────────────
  solis:     { power: 3005,  acVoltage: 3035,  dcVoltage: 3021,  dcCurrent: 3022,  frequency: 3042,  temp: 3041,  dailyGen: 3015,  totalGen: 3008,  status: 3071  },
  // ── From backend/drivers/polycab.json ─────────────────────────────────────
  polycab:   { power: 5031,  acVoltage: 5019,  dcVoltage: 5011,  dcCurrent: 5012,  frequency: 5036,  temp: 5041,  dailyGen: 5003,  totalGen: 5004,  status: 5038  },
  // ── From backend/drivers/waaree.json ──────────────────────────────────────
  waaree:    { power: 40003, acVoltage: 40007, dcVoltage: 40001, dcCurrent: 40002, frequency: 40009, temp: 40017, dailyGen: 40013, totalGen: 40015, status: 40025 },
  // ── From backend/drivers/solaria.json ─────────────────────────────────────
  solaria:   { power: 6003,  acVoltage: 6007,  dcVoltage: 6001,  dcCurrent: 6002,  frequency: 6009,  temp: 6017,  dailyGen: 6013,  totalGen: 6015,  status: 6025  },
  // ── Standard brands ───────────────────────────────────────────────────────
  goodwe:    { power: 35138, acVoltage: 35121, dcVoltage: 35103, dcCurrent: 35104, frequency: 35130, temp: 35141, dailyGen: 35191, totalGen: 35195, status: 35194 },
  huawei:    { power: 32080, acVoltage: 32069, dcVoltage: 32016, dcCurrent: 32017, frequency: 32085, temp: 32087, dailyGen: 32114, totalGen: 32106, status: 32089 },
  sma:       { power: 30775, acVoltage: 30783, dcVoltage: 30771, dcCurrent: 30769, frequency: 30803, temp: 30953, dailyGen: 30535, totalGen: 30531, status: 30201 },
  fronius:   { power: 40083, acVoltage: 40072, dcVoltage: 40060, dcCurrent: 40062, frequency: 40076, temp: 40103, dailyGen: 40094, totalGen: 40094, status: 40107 },
  delta:     { power: 4050,  acVoltage: 4041,  dcVoltage: 4031,  dcCurrent: 4032,  frequency: 4044,  temp: 4060,  dailyGen: 4015,  totalGen: 4013,  status: 4100  },
  abb:       { power: 5034,  acVoltage: 5022,  dcVoltage: 5012,  dcCurrent: 5014,  frequency: 5038,  temp: 5043,  dailyGen: 5010,  totalGen: 5008,  status: 5040  },
  schneider: { power: 3500,  acVoltage: 3510,  dcVoltage: 3502,  dcCurrent: 3504,  frequency: 3514,  temp: 3520,  dailyGen: 3530,  totalGen: 3534,  status: 3540  },
  hitachi:   { power: 4100,  acVoltage: 4090,  dcVoltage: 4080,  dcCurrent: 4082,  frequency: 4092,  temp: 4110,  dailyGen: 4050,  totalGen: 4048,  status: 4120  },
  tmeic:     { power: 6100,  acVoltage: 6090,  dcVoltage: 6080,  dcCurrent: 6082,  frequency: 6092,  temp: 6110,  dailyGen: 6050,  totalGen: 6048,  status: 6120  },
};

// ── SIMULATE MODBUS TELEMETRY ─────────────────────────────────────────────────
function simulateModbusFetch(config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional failures
      const rand = Math.random();
      if (rand < 0.05) return reject({ code: 'ETIMEDOUT', message: 'Timeout Error: Device did not respond within 5 seconds.' });
      if (rand < 0.08) return reject({ code: 'ECONNREFUSED', message: 'Device Not Reachable: Check IP Address and network.' });
      if (rand < 0.10) return reject({ code: 'EINVAL', message: 'Modbus Communication Failed: Wrong Slave ID or register map.' });

      const hour = new Date().getHours();
      const isDaylight = hour >= 6 && hour <= 18;
      const maxPower = parseFloat(config.capacity || 5);
      const solarFactor = isDaylight ? Math.max(0, Math.sin((hour - 6) * Math.PI / 12)) : 0;
      const power = +(maxPower * solarFactor * (0.7 + Math.random() * 0.3)).toFixed(2);

      const statusText = power > 0 ? 'Running' : (isDaylight ? 'Standby' : 'Offline');
      resolve({
        power_kw:      power,
        ac_voltage:    +(220 + Math.random() * 10).toFixed(1),
        dc_voltage:    +(350 + Math.random() * 50).toFixed(1),
        dc_current:    +(power / 0.35).toFixed(2),
        pv_voltage:    +(330 + Math.random() * 50).toFixed(1),
        pv_current:    +(power > 0 ? (power / 0.33).toFixed(2) : 0),
        frequency:     +(49.8 + Math.random() * 0.4).toFixed(2),
        temperature:   +(38 + Math.random() * 12).toFixed(1),
        daily_gen:     +(power * Math.max(0, hour - 6)).toFixed(1),
        total_gen:     +(power * 3600 + Math.random() * 10000).toFixed(0),
        status:        statusText,
        status_text:   statusText,
        fault_code:    null,
        last_update:   new Date().toLocaleTimeString('en-IN'),
        registers:     REGISTER_MAP[config.brandId] || {},
      });
    }, 1200 + Math.random() * 800);
  });
}

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'Running':  { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
    'Offline':  { color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',   dot: 'bg-slate-400'  },
    'Fault':    { color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',       dot: 'bg-red-400 animate-pulse' },
    'Standby':  { color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
    'No Data':  { color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  };
  const s = map[status] || map['No Data'];
  return (
    <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border', s.bg, s.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {status}
    </span>
  );
}

// ── TELEMETRY CARD ────────────────────────────────────────────────────────────
function TelemetryCard({ label, value, unit, icon: Icon, color, register }) {
  return (
    <div className="bg-[#0b1628] border border-slate-800/60 rounded-2xl p-4 hover:border-slate-700/60 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-xl', `bg-${color}-500/10`)}>
          <Icon className={cn('w-4 h-4', `text-${color}-400`)} />
        </div>
        {register && (
          <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-500 transition-colors">
            REG:{register}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className="text-lg font-bold text-slate-100">
        {value !== null ? value : '—'}
        {value !== null && <span className="text-xs font-normal text-slate-500 ml-1">{unit}</span>}
      </p>
    </div>
  );
}

// ── CONNECTION FORM ──────────────────────────────────────────────────────────
function ConnectionForm({ brand, onTest, testing, onSave }) {
  const defaults = MODBUS_BRANDS.find(b => b.id === brand?.id) || {};
  const [form, setForm] = useState({
    ip: '192.168.1.50',
    port: defaults.port || 502,
    slaveId: defaults.slaveId || 1,
    model: '',
    serialNo: '',
    capacity: '5',
  });

  const handleChange = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Connection Type Banner */}
      <div className="flex items-center gap-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
        <Radio className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-300">Local WiFi – Modbus TCP</p>
          <p className="text-xs text-slate-500">Direct LAN connection. No cloud API required.</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          PROTOCOL ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Inverter Model" required>
          <input
            className="input-dark"
            placeholder="e.g. SG5K-D"
            value={form.model}
            onChange={e => handleChange('model', e.target.value)}
          />
        </FormField>
        <FormField label="Serial Number" required>
          <input
            className="input-dark"
            placeholder="e.g. SN20251234"
            value={form.serialNo}
            onChange={e => handleChange('serialNo', e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Capacity (kW)" required>
          <input
            type="number"
            className="input-dark"
            placeholder="5"
            value={form.capacity}
            onChange={e => handleChange('capacity', e.target.value)}
          />
        </FormField>
        <FormField label="Dongle IP Address" required tooltip="Local Network IP of your WiFi dongle">
          <input
            className="input-dark font-mono"
            placeholder="192.168.1.50"
            value={form.ip}
            onChange={e => handleChange('ip', e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Modbus Port" tooltip="Default: 502">
          <input
            type="number"
            className="input-dark font-mono"
            value={form.port}
            onChange={e => handleChange('port', e.target.value)}
          />
        </FormField>
        <FormField label="Slave ID / Unit ID" tooltip={`Default for ${brand?.name || 'this brand'}: ${defaults.slaveId}`}>
          <input
            type="number"
            className="input-dark font-mono"
            value={form.slaveId}
            onChange={e => handleChange('slaveId', e.target.value)}
          />
        </FormField>
      </div>

      {/* Register Map Preview */}
      {brand && REGISTER_MAP[brand.id] && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
          <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            Register Map — {brand.name}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(REGISTER_MAP[brand.id]).slice(0, 6).map(([key, reg]) => (
              <div key={key} className="text-[10px] font-mono">
                <span className="text-slate-600">{key.replace('_', ' ')}: </span>
                <span className="text-blue-400">{reg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onTest({ ...form, brandId: brand?.id, brandName: brand?.name })}
          disabled={testing || !form.ip || !form.model}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
        >
          {testing ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Testing Modbus Connection...</>
          ) : (
            <><Signal className="w-4 h-4" /> Test Connection</>
          )}
        </button>
        <button
          onClick={() => onSave({ ...form, brandId: brand?.id, brandName: brand?.name })}
          className="px-5 py-3 rounded-2xl border border-slate-700 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 font-semibold text-sm transition-all"
        >
          Save & Add
        </button>
      </div>
    </motion.div>
  );
}

function FormField({ label, children, required, tooltip, id }) {
  // Derive a stable id from label if not provided explicitly
  const fieldId = id || `modbus-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  // Clone child to inject the id
  const child = React.Children.only(children);
  const childWithId = React.cloneElement(child, { id: child.props.id || fieldId });
  return (
    <div>
      <label htmlFor={fieldId} className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-blue-400">*</span>}
        {tooltip && <span className="text-slate-600 font-normal normal-case tracking-normal ml-1">({tooltip})</span>}
      </label>
      {childWithId}
    </div>
  );
}

// ── INVERTER CARD (List View) ─────────────────────────────────────────────────
function InverterCard({ inverter, onRefresh, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const brandInfo = MODBUS_BRANDS.find(b => b.id === inverter.brandId) || {};

  return (
    <motion.div
      layout
      className="bg-[#0b1628] border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700/60 transition-all"
    >
      {/* Header Row */}
      <div className="flex items-center gap-4 p-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-slate-700"
          style={{ background: `${brandInfo.color || '#3b82f6'}15` }}
        >
          {brandInfo.icon || '⚡'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-100 text-sm truncate">{inverter.model}</p>
          <p className="text-xs text-slate-500 font-mono">{inverter.serialNo} · {inverter.ip}:{inverter.port}</p>
        </div>
        <StatusBadge status={inverter.status} />
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-blue-400">{inverter.telemetry?.power_kw ?? '—'} kW</p>
          <p className="text-[10px] text-slate-600">{inverter.telemetry?.last_update || 'No Sync'}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onRefresh} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setExpanded(p => !p)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-all">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onDelete} className="p-2 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Telemetry */}
      <AnimatePresence>
        {expanded && inverter.telemetry && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-800 overflow-hidden"
          >
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <TelemetryCard label="Real-time Power"    value={inverter.telemetry.power_kw}    unit="kW"  icon={Zap}         color="yellow" register={REGISTER_MAP[inverter.brandId]?.power} />
              <TelemetryCard label="AC Voltage"         value={inverter.telemetry.ac_voltage}   unit="V"   icon={Activity}    color="blue"   register={REGISTER_MAP[inverter.brandId]?.acVoltage} />
              <TelemetryCard label="DC Voltage"         value={inverter.telemetry.dc_voltage}   unit="V"   icon={Power}       color="purple" register={REGISTER_MAP[inverter.brandId]?.dcVoltage} />
              <TelemetryCard label="DC Current"         value={inverter.telemetry.dc_current}   unit="A"   icon={ChevronsRight} color="cyan" register={REGISTER_MAP[inverter.brandId]?.dcCurrent} />
              <TelemetryCard label="Frequency"          value={inverter.telemetry.frequency}    unit="Hz"  icon={Signal}      color="green"  register={REGISTER_MAP[inverter.brandId]?.frequency} />
              <TelemetryCard label="Temperature"        value={inverter.telemetry.temperature}  unit="°C"  icon={Thermometer}  color="red"   register={REGISTER_MAP[inverter.brandId]?.temp} />
              <TelemetryCard label="Daily Generation"   value={inverter.telemetry.daily_gen}    unit="kWh" icon={BarChart3}   color="emerald" register={REGISTER_MAP[inverter.brandId]?.dailyGen} />
              <TelemetryCard label="Total Generation"   value={inverter.telemetry.total_gen}    unit="kWh" icon={Database}    color="indigo" register={REGISTER_MAP[inverter.brandId]?.totalGen} />
            </div>
            {/* Auto Sync Footer */}
            <div className="flex items-center gap-3 px-5 py-3 border-t border-slate-800 bg-slate-900/30">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[11px] text-slate-600">Auto-sync every 30 min via Modbus TCP ·</span>
              <span className="text-[11px] text-blue-400 font-mono">{inverter.ip}:{inverter.port} (ID:{inverter.slaveId})</span>
              <span className="ml-auto text-[11px] text-slate-600">Next sync in {inverter.nextSync || '30'} min</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── QR ROUTER SCAN MODAL ─────────────────────────────────────────────────────
const MOCK_ROUTERS = [
  { brand: 'Sungrow', model: 'SG-WiFi-Stick', ip: '192.168.1.50', port: 502, slaveId: 1, ssid: 'SolarWiFi_SG_2409', mac: 'A4:C3:F0:12:34:56', firmware: 'v2.1.4' },
  { brand: 'Growatt', model: 'ShineWiFi-X',   ip: '10.0.0.10',    port: 502, slaveId: 1, ssid: 'Growatt_SHINE_4801', mac: 'B8:27:EB:45:67:89', firmware: 'v1.3.2' },
  { brand: 'Huawei',  model: 'SmartDongle2000', ip: '192.168.200.1', port: 6607, slaveId: 0, ssid: 'Huawei_Solar_7702', mac: 'DC:A6:32:78:9A:BC', firmware: 'v3.0.1' },
];

function QRRouterScanModal({ open, onClose, onConnect }) {
  const [phase, setPhase] = useState('scan'); // scan | detected | connecting | done
  const [detected, setDetected] = useState(null);

  useEffect(() => {
    if (!open) return;
    setPhase('scan');
    setDetected(null);
    // After 2.5s simulate successful QR scan
    const t = setTimeout(() => {
      const router = MOCK_ROUTERS[Math.floor(Math.random() * MOCK_ROUTERS.length)];
      setDetected(router);
      setPhase('detected');
    }, 2500);
    return () => clearTimeout(t);
  }, [open]);

  const handleConnect = async () => {
    setPhase('connecting');
    await new Promise(r => setTimeout(r, 1800));
    setPhase('done');
    onConnect(detected);
    setTimeout(() => { onClose(); setPhase('scan'); }, 1200);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div className="bg-[#0b1628] border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-100 text-sm">Router QR Connect</h2>
                    <p className="text-[10px] text-slate-500">Scan the QR on your WiFi dongle</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <AnimatePresence mode="wait">

                  {/* Scanning phase */}
                  {phase === 'scan' && (
                    <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-5">
                      {/* Simulated camera viewfinder */}
                      <div className="relative w-52 h-52 rounded-2xl overflow-hidden bg-[#030812] border-2 border-blue-500/30">
                        {/* Corner markers */}
                        {[['top-2 left-2','border-t-2 border-l-2'],['top-2 right-2','border-t-2 border-r-2'],
                          ['bottom-2 left-2','border-b-2 border-l-2'],['bottom-2 right-2','border-b-2 border-r-2']
                        ].map(([pos, bord], i) => (
                          <div key={i} className={`absolute ${pos} w-6 h-6 ${bord} border-blue-400 rounded-sm`} />
                        ))}
                        {/* Simulated QR pattern */}
                        <div className="absolute inset-6 grid grid-cols-7 grid-rows-7 gap-0.5 opacity-20">
                          {Array.from({length: 49}).map((_,i) => (
                            <div key={i} className={`rounded-[1px] ${Math.random()>0.5?'bg-slate-300':'bg-transparent'}`} />
                          ))}
                        </div>
                        {/* Scanning line */}
                        <motion.div
                          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#60a5fa]"
                          animate={{ y: [10, 190, 10] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-300">Scanning for QR code…</p>
                        <p className="text-xs text-slate-500 mt-1">Point camera at the QR sticker on your inverter dongle</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-2">
                        <Signal className="w-3.5 h-3.5 animate-pulse" />
                        Searching for device signal…
                      </div>
                    </motion.div>
                  )}

                  {/* Detected phase */}
                  {phase === 'detected' && detected && (
                    <motion.div key="detected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="space-y-4">
                      <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-4">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="text-emerald-400 font-bold text-sm">QR Code Detected!</p>
                          <p className="text-slate-500 text-xs">{detected.ssid}</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                        {[
                          ['Brand',    detected.brand],
                          ['Model',    detected.model],
                          ['IP Address', detected.ip],
                          ['Port',     detected.port],
                          ['Slave ID', detected.slaveId],
                          ['MAC',      detected.mac],
                          ['Firmware', detected.firmware],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">{k}</span>
                            <span className="font-mono text-slate-200 font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={handleConnect}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20">
                        <Wifi className="w-4 h-4" /> Confirm &amp; Connect Router
                      </button>
                    </motion.div>
                  )}

                  {/* Connecting */}
                  {phase === 'connecting' && (
                    <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                        <Router className="w-7 h-7 text-blue-400 absolute inset-0 m-auto" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-200">Connecting to Router…</p>
                        <p className="text-xs text-slate-500 mt-1">Establishing Modbus TCP handshake via {detected?.ip}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Done */}
                  {phase === 'done' && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 py-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <p className="text-emerald-400 font-bold">Router Connected!</p>
                      <p className="text-xs text-slate-500">{detected?.model} added to inverter list</p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── MAIN MODULE ───────────────────────────────────────────────────────────────
export default function ModbusInverterConnect() {
  const [step, setStep] = useState('list'); // list | addBrand | addForm
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [inverterList, setInverterList] = useState([
    // Demo inverter
    {
      id: 1, brandId: 'sungrow', model: 'Sungrow SG10K-TL', serialNo: 'B2243100892',
      ip: '192.168.1.50', port: 502, slaveId: 1, capacity: '10',
      status: 'Running',
      telemetry: {
        power_kw: 7.4, ac_voltage: 226.8, dc_voltage: 378.5, dc_current: 19.6,
        frequency: 50.01, temperature: 41.2, daily_gen: 38.4, total_gen: 12840,
        status: 'Running', fault_code: null, last_update: '10:32:18 AM',
      },
      nextSync: 28,
    }
  ]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | { ok, data, error }
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'offline', message: 'Inverter SG5K-M1 offline for >1 hour', time: '09:12 AM', severity: 'critical' },
    { id: 2, type: 'zero_gen', message: 'Zero generation detected at 11:00 AM – Plant B', time: '11:00 AM', severity: 'critical' },
    { id: 3, type: 'low_gen', message: 'Low generation: Only 42% of expected output', time: '02:30 PM', severity: 'warning' },
  ]);

  // ── TEST CONNECTION ───────────────────────────────────────────────────────
  const handleTest = async (config) => {
    setTesting(true);
    setTestResult(null);
    try {
      const data = await simulateModbusFetch(config);
      setTestResult({ ok: true, data, config });
    } catch (err) {
      setTestResult({ ok: false, error: err.message, config });
    } finally {
      setTesting(false);
    }
  };

  // ── SAVE INVERTER ─────────────────────────────────────────────────────────
  const handleSave = async (config) => {
    setTesting(true);
    try {
      const data = await simulateModbusFetch(config);
      const newInverter = {
        id: Date.now(), brandId: config.brandId, model: config.model || config.brandName,
        serialNo: config.serialNo, ip: config.ip, port: config.port, slaveId: config.slaveId,
        capacity: config.capacity, status: data.status, telemetry: data, nextSync: 30,
      };
      setInverterList(p => [newInverter, ...p]);
      setStep('list');
      setTestResult(null);
    } catch (err) {
      alert('Failed to connect: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  // ── REFRESH SINGLE INVERTER ───────────────────────────────────────────────
  const handleRefresh = async (id) => {
    const inv = inverterList.find(i => i.id === id);
    if (!inv) return;
    try {
      const data = await simulateModbusFetch({ ...inv, brandId: inv.brandId });
      setInverterList(p => p.map(i => i.id === id ? { ...i, status: data.status, telemetry: data, nextSync: 30 } : i));
    } catch (e) {
      setInverterList(p => p.map(i => i.id === id ? { ...i, status: 'Offline' } : i));
    }
  };

  // ── DELETE INVERTER ───────────────────────────────────────────────────────
  const handleDelete = (id) => {
    setInverterList(p => p.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-blue-400" />
            </div>
            Local WiFi Inverter Connection
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Connect inverters directly via <span className="text-blue-400 font-mono">Modbus TCP</span> — no cloud API needed.
          </p>
        </div>
      {step === 'list' && (
          <div className="flex items-center gap-2">
          <button
            onClick={() => { setStep('addBrand'); setTestResult(null); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Inverter
          </button>
          <button
            onClick={() => setShowQR(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <QrCode className="w-4 h-4" /> Connect via QR
          </button>
          </div>
        )}
        {step !== 'list' && (
          <button
            onClick={() => { setStep('list'); setSelectedBrand(null); setTestResult(null); }}
            className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
          >
            ← Back to List
          </button>
        )}
      </div>

      {/* ── STEP 1: Brand Selection ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {step === 'addBrand' && (
          <motion.div key="brand" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-[#0b1628] border border-slate-800 rounded-3xl p-6">
              <p className="text-sm font-bold text-slate-400 mb-5 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                Step 1 — Select Inverter Brand
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {MODBUS_BRANDS.map(brand => (
                  <motion.button
                    key={brand.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelectedBrand(brand); setStep('addForm'); }}
                    className="bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 text-left transition-all group"
                  >
                    <div className="text-2xl mb-2">{brand.icon}</div>
                    <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{brand.name}</p>
                    <p className="text-[10px] text-slate-600 font-mono mt-0.5">Port: {brand.port}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Connection Form ─────────────────────────────────────── */}
        {step === 'addForm' && (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Form */}
              <div className="bg-[#0b1628] border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl border border-slate-700"
                    style={{ background: `${selectedBrand?.color || '#3b82f6'}15` }}
                  >
                    {selectedBrand?.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100">{selectedBrand?.name}</p>
                    <p className="text-xs text-slate-500">Modbus TCP · Default Port {selectedBrand?.port}</p>
                  </div>
                </div>
                <ConnectionForm
                  brand={selectedBrand}
                  testing={testing}
                  onTest={handleTest}
                  onSave={handleSave}
                />
              </div>

              {/* Right: Test Result */}
              <div className="bg-[#0b1628] border border-slate-800 rounded-3xl p-6">
                <p className="text-sm font-bold text-slate-400 mb-5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Live Connection Result
                </p>

                {!testResult && !testing && (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <Signal className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-600 text-sm">Click <span className="text-blue-400 font-bold">Test Connection</span> to verify Modbus TCP.</p>
                    <p className="text-slate-700 text-xs mt-2">The app will read registers from the dongle IP and display live data.</p>
                  </div>
                )}

                {testing && (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                      <Signal className="w-6 h-6 text-blue-400 absolute inset-0 m-auto" />
                    </div>
                    <p className="text-blue-400 font-semibold text-sm">Connecting to {testResult?.config?.ip}...</p>
                    <p className="text-slate-600 text-xs mt-1">Reading Modbus registers via TCP port {selectedBrand?.port}</p>
                  </div>
                )}

                {testResult?.ok && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-emerald-400 font-bold text-sm">Connection Successful</p>
                        <p className="text-slate-500 text-xs">Modbus TCP handshake complete · {testResult.config?.ip}:{testResult.config?.port}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <TelemetryCard label="Real-time Power"  value={testResult.data.power_kw}    unit="kW"  icon={Zap}          color="yellow"  />
                      <TelemetryCard label="AC Voltage"       value={testResult.data.ac_voltage}   unit="V"   icon={Activity}     color="blue"    />
                      <TelemetryCard label="DC Voltage"       value={testResult.data.dc_voltage}   unit="V"   icon={Power}        color="purple"  />
                      <TelemetryCard label="Frequency"        value={testResult.data.frequency}    unit="Hz"  icon={Signal}       color="green"   />
                      <TelemetryCard label="Temperature"      value={testResult.data.temperature}  unit="°C"  icon={Thermometer}  color="red"     />
                      <TelemetryCard label="Daily Generation" value={testResult.data.daily_gen}    unit="kWh" icon={BarChart3}    color="emerald" />
                    </div>
                    <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> Last read: {testResult.data.last_update}
                      </div>
                      <StatusBadge status={testResult.data.status} />
                    </div>
                  </motion.div>
                )}

                {testResult && !testResult.ok && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-4">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-bold text-sm mb-1">Connection Failed</p>
                        <p className="text-slate-400 text-xs">{testResult.error}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        ['Check IP Address', `Verify ${testResult.config?.ip} is correct`, 'text-yellow-400'],
                        ['Check Network', 'Device must be on same WiFi network', 'text-blue-400'],
                        ['Check Port', `Default Modbus port is ${selectedBrand?.port || 502}`, 'text-purple-400'],
                        ['Check Slave ID', `Try default Slave ID: ${selectedBrand?.slaveId || 1}`, 'text-emerald-400'],
                      ].map(([title, desc, color]) => (
                        <div key={title} className="flex items-start gap-3 text-xs">
                          <span className={cn('font-bold flex-shrink-0 mt-0.5', color)}>→</span>
                          <div>
                            <span className="text-slate-300 font-semibold">{title}: </span>
                            <span className="text-slate-500">{desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 0: Inverter List ───────────────────────────────────────── */}
        {step === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Inverters',  value: inverterList.length,                                                  color: 'blue',   icon: Server },
                { label: 'Online',           value: inverterList.filter(i => i.status === 'Running').length,             color: 'emerald',icon: CheckCircle },
                { label: 'Offline / Fault',  value: inverterList.filter(i => ['Offline','Fault'].includes(i.status)).length, color: 'red', icon: WifiOff },
                { label: 'Active Alerts',    value: alerts.length,                                                        color: 'orange', icon: AlertTriangle },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className={cn('bg-[#0b1628] border rounded-2xl p-4', `border-${color}-500/20`)}>
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', `bg-${color}-500/10`)}>
                    <Icon className={cn('w-4 h-4', `text-${color}-400`)} />
                  </div>
                  <p className={cn('text-2xl font-bold', `text-${color}-400`)}>{value}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Inverter Cards */}
            {inverterList.length === 0 ? (
              <div className="bg-[#0b1628] border border-dashed border-slate-800 rounded-3xl p-16 text-center">
                <Wifi className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-semibold">No inverters connected yet</p>
                <p className="text-slate-700 text-sm mt-1">Click <span className="text-blue-400">Add Inverter</span> to connect via Modbus TCP</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inverterList.map(inv => (
                  <InverterCard
                    key={inv.id}
                    inverter={inv}
                    onRefresh={() => handleRefresh(inv.id)}
                    onDelete={() => handleDelete(inv.id)}
                  />
                ))}
              </div>
            )}

            {/* Alerts Panel */}
            {alerts.length > 0 && (
              <div className="bg-[#0b1628] border border-red-500/20 rounded-3xl p-5">
                <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Active Modbus Alerts
                </h3>
                <div className="space-y-2">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-xl border text-xs',
                        alert.severity === 'critical'
                          ? 'bg-red-500/5 border-red-500/20 text-red-300'
                          : 'bg-orange-500/5 border-orange-500/20 text-orange-300'
                      )}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">{alert.message}</p>
                        <p className="text-slate-600 mt-0.5">{alert.time}</p>
                      </div>
                      <button
                        onClick={() => setAlerts(p => p.filter(a => a.id !== alert.id))}
                        className="text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Alert Rules */}
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
                  {[
                    { rule: 'No data > 1 hour', action: 'Inverter Offline Alert', icon: WifiOff },
                    { rule: 'Power = 0 (6AM–6PM)', action: 'Zero Generation Alert', icon: Zap },
                    { rule: 'Gen < expected output', action: 'Low Generation Alert', icon: TrendingDown },
                    { rule: 'Fault register != 0', action: 'Fault Code Alert', icon: AlertTriangle },
                  ].map(({ rule, action, icon: Icon }) => (
                    <div key={rule} className="flex items-start gap-2 text-[10px]">
                      <Icon className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-400 font-semibold">{action}</p>
                        <p className="text-slate-600">{rule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Auto Sync Info */}
            <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-4 flex items-start gap-4">
              <RefreshCw className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-300">Auto Sync Every 30 Minutes</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Data is automatically fetched from each inverter via Modbus TCP and stored in the cloud database.
                  Vendor and Customer dashboards are updated automatically.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Router Scan Modal */}
      <QRRouterScanModal
        open={showQR}
        onClose={() => setShowQR(false)}
        onConnect={(router) => {
          const newInverter = {
            id: Date.now(),
            brandId: (router.brand || 'sungrow').toLowerCase(),
            model: router.model,
            serialNo: router.mac.replace(/:/g,'').slice(-8),
            ip: router.ip,
            port: router.port,
            slaveId: router.slaveId,
            capacity: '5',
            status: 'Running',
            telemetry: {
              power_kw: 3.8, ac_voltage: 228.4, dc_voltage: 372.1, dc_current: 10.2,
              frequency: 50.02, temperature: 39.6, daily_gen: 18.2, total_gen: 4820,
              status: 'Running', fault_code: null, last_update: new Date().toLocaleTimeString('en-IN'),
            },
            nextSync: 30,
          };
          setInverterList(p => [newInverter, ...p]);
        }}
      />
    </div>
  );
}
