import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'],  desc: 'Open Command Palette' },
  { keys: ['?'],          desc: 'Show Keyboard Shortcuts' },
  { keys: ['Escape'],     desc: 'Close any panel/modal' },
  { keys: ['T'],          desc: 'Open Theme Switcher' },
  { keys: ['1'],          desc: 'Go to Dashboard' },
  { keys: ['2'],          desc: 'Go to Solar Plants' },
  { keys: ['3'],          desc: 'Go to Inverter Connect' },
  { keys: ['4'],          desc: 'Go to Customers' },
  { keys: ['5'],          desc: 'Go to Smart Alerts' },
  { keys: ['6'],          desc: 'Go to System Config' },
  { keys: ['F'],          desc: 'Toggle Fullscreen Mode' },
  { keys: ['R'],          desc: 'Refresh / Force Sync' },
  { keys: ['N'],          desc: 'Open Notification Center' },
];

export default function KeyboardShortcuts({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[195]"
            onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[196] w-full max-w-sm px-4"
          >
            <div className="bg-[#0d1b33] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-slate-100">Keyboard Shortcuts</span>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-1.5 max-h-[60vh] overflow-y-auto">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                    <span className="text-xs text-slate-400">{s.desc}</span>
                    <div className="flex gap-1">
                      {s.keys.map(k => (
                        <kbd key={k} className="text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded-lg">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-600">Press <kbd className="bg-slate-800 px-1 rounded text-slate-500">?</kbd> anytime to show this</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
