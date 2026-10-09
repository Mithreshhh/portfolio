'use client';

import React from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { Video, Quote, Star, ShieldCheck } from 'lucide-react';

export const ProofApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Proof & Testimonials Vault</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            VERIFIED FEEDBACK
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Client testimonials, verified project outcomes, and peer recommendations.
        </p>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ownerProfile.testimonials.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-rose-500/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-rose-400">
                <Quote className="w-6 h-6" />
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                &quot;{t.quote}&quot;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-100">{t.author}</div>
                <div className="text-[11px] font-mono text-slate-400">{t.title}</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-indigo-300 border border-slate-700">
                {t.project}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Demonstration Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold">
          <Video className="w-4 h-4" />
          <span>PROJECT DEMONSTRATIONS & WALKTHROUGHS</span>
        </div>
        <p className="text-xs text-slate-300">
          Video case studies showcasing full-stack workflows for Voltworx and MLRITM are available on request during strategy calls.
        </p>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Client Handoff Records</span>
        </div>
      </div>
    </div>
  );
};
