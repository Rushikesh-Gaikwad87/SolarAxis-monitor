import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, X, CheckCircle, AlertTriangle, WifiOff, Zap, TrendingDown,
  Wrench, CloudRain, Check
} from 'lucide-react';
import { ALERTS } from '../data/mockData';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

const TYPE_ICON = {
  fault: AlertTriangle, offline: WifiOff, zero_gen: Zap,
  low_gen: TrendingDown, amc: Wrench, weather: CloudRain
};
const SEV_COLOR = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export default function NotificationDrawer({ open, onClose }) {
  const [readIds, setReadIds] = useState([]);
  const [alerts, setAlerts] = useState(ALERTS);

  const markRead = (id) => setReadIds(p => [...p, id]);
  const markAllRead = () => setReadIds(alerts.map(a => a.id));
  const dismiss = (id) => setAlerts(p => p.filter(a => a.id !== id));

  const unreadCount = alerts.filter(a => !readIds.includes(a.id) && !a.resolved).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[180]" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="fixed top-14 right-4 lg:right-8 w-80 sm:w-96 z-[181] bg-[#0d1b33] border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-slate-100 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="text-[11px] text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/50">
                  {alerts.map(alert => {
                    const Icon = TYPE_ICON[alert.type] || AlertTriangle;
                    const isRead = readIds.includes(alert.id);
                    return (
                      <div key={alert.id}
                        className={cn('flex items-start gap-3 p-4 transition-colors',
                          isRead || alert.resolved ? 'opacity-50' : 'hover:bg-slate-800/20')}
                        onClick={() => markRead(alert.id)}
                      >
                        <div className={cn('p-2 rounded-xl flex-shrink-0 border', SEV_COLOR[alert.severity])}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 cursor-pointer">
                          <p className="text-xs font-semibold text-slate-200 leading-tight">{alert.plant}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{alert.message}</p>
                          <p className="text-[10px] text-slate-600 mt-1">{alert.time}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          {!isRead && !alert.resolved && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                          <button onClick={e => { e.stopPropagation(); dismiss(alert.id); }}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-slate-400 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-600 text-center">
                Alert rules: Offline &gt;1hr · Zero Gen · Low Gen · Faults
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
