import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...i) { return twMerge(clsx(i)); }

export const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Blue',
    desc: 'Default dark blue',
    emoji: '🌑',
    preset: 'bg-[#020617]',
    filter: '',
    accent: '#3b82f6',
    preview: ['#020617', '#0b1628', '#1e3a5f'],
  },
  {
    id: 'amoled',
    name: 'AMOLED Black',
    desc: 'Pure black display',
    emoji: '⚫',
    preset: 'bg-black',
    filter: 'brightness(0.82) contrast(1.18)',
    accent: '#3b82f6',
    preview: ['#000000', '#050505', '#0d0d0d'],
  },
  {
    id: 'ocean',
    name: 'Ocean Teal',
    desc: 'Cool aqua tones',
    emoji: '🌊',
    preset: 'bg-[#020617]',
    filter: 'hue-rotate(22deg) saturate(1.15)',
    accent: '#0ea5e9',
    preview: ['#021017', '#041c2a', '#0a3547'],
  },
  {
    id: 'aurora',
    name: 'Aurora Purple',
    desc: 'Deep violet sky',
    emoji: '🌌',
    preset: 'bg-[#020617]',
    filter: 'hue-rotate(-52deg) saturate(1.2)',
    accent: '#8b5cf6',
    preview: ['#0a0217', '#160b2a', '#241545'],
  },
  {
    id: 'forest',
    name: 'Forest Green',
    desc: 'Nature dark mode',
    emoji: '🌿',
    preset: 'bg-[#020617]',
    filter: 'hue-rotate(95deg) saturate(1.1) brightness(0.92)',
    accent: '#10b981',
    preview: ['#021208', '#041f0e', '#0a3318'],
  },
  {
    id: 'sunset',
    name: 'Sunset Red',
    desc: 'Warm amber-red',
    emoji: '🌅',
    preset: 'bg-[#020617]',
    filter: 'hue-rotate(-128deg) saturate(1.25) brightness(0.88)',
    accent: '#f97316',
    preview: ['#170602', '#2a0d03', '#3d1504'],
  },
  {
    id: 'mono',
    name: 'Monochrome',
    desc: 'Clean greyscale',
    emoji: '◐',
    preset: 'bg-[#020617]',
    filter: 'grayscale(0.85) brightness(0.9)',
    accent: '#94a3b8',
    preview: ['#0d0d0f', '#181818', '#242424'],
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    desc: 'Elegant pink',
    emoji: '🌸',
    preset: 'bg-[#020617]',
    filter: 'hue-rotate(-160deg) saturate(1.3) brightness(0.85)',
    accent: '#f43f5e',
    preview: ['#180211', '#2a061e', '#3d0b2d'],
  },
];

export default function ThemeSwitcher({ open, onClose, currentTheme, onApply }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[190]" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[191] w-72 bg-[#0d1b33] border-l border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-slate-100">App Themes</span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Theme Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Choose Your Vibe</p>
              {THEMES.map(theme => (
                <button key={theme.id} onClick={() => { onApply(theme); onClose(); }}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-2xl border transition-all group text-left',
                    currentTheme.id === theme.id
                      ? 'border-blue-500/50 bg-blue-600/10'
                      : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'
                  )}>
                  {/* Color swatch */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex flex-col">
                    {theme.preview.map((c, i) => (
                      <div key={i} className="flex-1" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{theme.emoji}</span>
                      <p className="text-sm font-semibold text-slate-200">{theme.name}</p>
                    </div>
                    <p className="text-[11px] text-slate-500">{theme.desc}</p>
                  </div>
                  {currentTheme.id === theme.id && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <p className="text-[10px] text-slate-600 text-center">Theme preference is saved locally</p>
                <div className="flex items-center justify-center mt-1 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: currentTheme.accent }} />
                  <p className="text-[11px] font-bold" style={{ color: currentTheme.accent }}>{currentTheme.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
