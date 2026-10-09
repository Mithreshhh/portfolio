'use client';

import React, { useState } from 'react';
import { useOS } from './OSContext';
import { Plus, RefreshCw } from 'lucide-react';

const TRANSMISSIONS = [
  "Ship early, measure accurately, refactor relentlessly.",
  "Leverage modern full-stack systems to solve real problems.",
  "Clean code is working code that scales under real traffic.",
  "Build software that turns complex data into simple decisions.",
  "High polish is not an option—it is the signature of great craft."
];

export const DailyTransmission: React.FC = () => {
  const { addStickyNote, openApp, theme } = useOS();
  const [index, setIndex] = useState(0);

  const nextQuote = () => {
    setIndex((prev) => (prev + 1) % TRANSMISSIONS.length);
  };

  const cardTheme = {
    day: 'bg-white/70 border-slate-300/80 text-slate-800 shadow-xl backdrop-blur-xl',
    night: 'bg-slate-900/70 border-indigo-500/30 text-indigo-100 shadow-2xl backdrop-blur-xl',
    dark: 'bg-slate-950/80 border-emerald-500/30 text-emerald-300 shadow-2xl backdrop-blur-xl'
  }[theme];

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 max-w-sm w-full select-none ${cardTheme}`}>
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-500/20 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold tracking-wider uppercase text-[10px] opacity-80">DAILY TRANSMISSION</span>
        </div>
        <button
          onClick={nextQuote}
          className="p-1 rounded hover:bg-slate-800/40 text-slate-400 hover:text-white transition-colors"
          title="Next Transmission"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-2 text-xs sm:text-sm font-medium leading-relaxed italic">
        &quot;{TRANSMISSIONS[index]}&quot;
      </div>

      <div className="pt-3 mt-1 flex items-center justify-between border-t border-indigo-500/10 text-[11px]">
        <span className="font-mono text-[10px] opacity-60">MITHRESH OS // SYSTEM CORE</span>
        <button
          onClick={() => {
            addStickyNote();
            openApp('whiteboard');
          }}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-all shadow-md active:scale-95"
        >
          <Plus className="w-3 h-3" />
          <span>Quick Sticky</span>
        </button>
      </div>
    </div>
  );
};
