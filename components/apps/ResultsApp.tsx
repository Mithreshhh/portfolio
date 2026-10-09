'use client';

import React from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const ResultsApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      {/* Header */}
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Impact & Verified Results</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            PROOF VAULT
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Measured outcomes, client deployments, and operational impact delivered by {ownerProfile.identity.fullName}.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ownerProfile.metrics.map((m, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 flex flex-col space-y-1">
            <span className="text-2xl font-extrabold text-indigo-400 font-mono">{m.value}</span>
            <span className="text-xs text-slate-200 font-medium leading-tight">{m.label}</span>
            <div className="flex items-center space-x-1 pt-1 text-[9px] font-mono text-emerald-400">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span className="capitalize">{m.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Client Case Results */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
          Flagship Client Interventions
        </h3>

        <div className="space-y-3">
          {ownerProfile.clientCases.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-300 font-mono">{c.client}</span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {c.metric}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-100">Challenge:</strong> {c.challenge}
              </p>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-100">Delivered:</strong> {c.delivered}
              </p>
              <div className="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-indigo-400" />
                <span>{c.disclosure}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
