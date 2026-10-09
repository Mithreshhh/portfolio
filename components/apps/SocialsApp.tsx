'use client';

import React from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { Github, Linkedin, Mail, Globe, Download, ArrowUpRight } from 'lucide-react';

export const SocialsApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Connect & Public Profiles</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            NETWORKS
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Official social accounts, repositories, and downloadable resume for Mithresh Uttarwar.
        </p>
      </div>

      {/* Resume Download Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/40 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-100">Official Resume PDF</h3>
          <p className="text-xs text-slate-300">Download the complete technical resume for Mithresh Uttarwar.</p>
        </div>
        <a
          href={ownerProfile.identity.resumeUrl}
          download="Mithresh_Uttarwar_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg active:scale-95 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </a>
      </div>

      {/* Social Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ownerProfile.socials.map((s, idx) => (
          <a
            key={idx}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 hover:bg-slate-900 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                {s.name === 'GitHub' && <Github className="w-5 h-5" />}
                {s.name === 'LinkedIn' && <Linkedin className="w-5 h-5" />}
                {s.name === 'Email' && <Mail className="w-5 h-5" />}
                {s.name === 'Voltworx' && <Globe className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">{s.name}</h4>
                <span className="text-xs font-mono text-slate-400">{s.handle}</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
};
