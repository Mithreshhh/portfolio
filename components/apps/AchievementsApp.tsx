'use client';

import React from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { Trophy } from 'lucide-react';

export const AchievementsApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Achievements Vault</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            TROPHY SYSTEM
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Competitions won, leadership milestones, and technical achievements unlocked by Mithresh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ownerProfile.achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-yellow-500/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
                {ach.badgeText}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="capitalize">{ach.category}</span>
                <span>{ach.date}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{ach.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
