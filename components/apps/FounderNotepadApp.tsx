'use client';

import React from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { FileText, Check } from 'lucide-react';

export const FounderNotepadApp: React.FC = () => {
  return (
    <div className="space-y-4 select-text font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span className="font-bold">Founder.txt</span>
          <span className="text-[10px] text-slate-500">Read-only text file</span>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-emerald-400">
          <Check className="w-3 h-3" />
          <span>AUTOSAVED</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 space-y-4 leading-relaxed font-mono">
        <div>
          <span className="text-indigo-400 font-bold"># WHO I AM</span>
          <p className="mt-1">
            My name is {ownerProfile.identity.fullName}. I am a CTO & Full-Stack Engineer based in {ownerProfile.identity.location}. I build production software, web applications, and intelligent systems.
          </p>
        </div>

        <div>
          <span className="text-indigo-400 font-bold"># WHAT I BUILD</span>
          <p className="mt-1">
            - Voltworx (CTO & Developer) — Flagship live SaaS product.<br />
            - MLRITM College Platform — Official institutional web portal on Next.js + Payload CMS.<br />
            - SIH 2025 Innovation Project — High-scale React/Node.js hackathon system.<br />
            - DSA Helper Chrome Extension — Real-time algorithm context detection tool.
          </p>
        </div>

        <div>
          <span className="text-indigo-400 font-bold"># MY PHILOSOPHY</span>
          <p className="mt-1">
            Build products that work seamlessly under load. Prioritize clean UI polish, fast bundle sizes, and robust engineering architecture before adding gimmicks.
          </p>
        </div>

        <div>
          <span className="text-indigo-400 font-bold"># COLLABORATION CRITERIA</span>
          <p className="mt-1">
            I work with founders, teams, and institutions looking to build high-polish web applications, automated workflows, or custom AI interfaces.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500">
          Contact: {ownerProfile.conversion.email} | GitHub: @Mithreshhh
        </div>
      </div>
    </div>
  );
};
