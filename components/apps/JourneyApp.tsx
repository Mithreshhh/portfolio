import React from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { CheckCircle2 } from 'lucide-react';

export const JourneyApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Journey & Career Timeline</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            CHRONOLOGICAL LOG
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Milestones, skill upgrades, and pivotal leadership achievements in Mithresh&apos;s engineering journey.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
        {ownerProfile.journey.map((item, idx) => (
          <div key={idx} className="relative pl-6 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 group-hover:scale-125 group-hover:bg-indigo-400 transition-all" />

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {item.year}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{item.role}</span>
              </div>

              <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.story}</p>

              <div className="pt-2 flex items-center space-x-2 text-[10px] font-mono text-emerald-400 border-t border-slate-800">
                <CheckCircle2 className="w-3 h-3" />
                <span>UPGRADE: {item.upgrade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
