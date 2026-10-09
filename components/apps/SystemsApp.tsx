'use client';

import React from 'react';
import { Cpu, Lock, Zap, Workflow, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    step: "01",
    title: "Find the Leverage Point",
    desc: "Audit existing infrastructure, bottlenecks, and user friction to isolate high-impact leverage points.",
    artifact: "Architecture Audit & Scope Matrix",
    icon: Cpu
  },
  {
    step: "02",
    title: "Lock the Core System Architecture",
    desc: "Design modular data schemas, component patterns, and resilient tech stacks using Next.js, React, and Node.js.",
    artifact: "System Blueprint & Tech Specification",
    icon: Lock
  },
  {
    step: "03",
    title: "Build the Sharp Edge",
    desc: "Develop high-performing user interfaces with instant load times, rich micro-interactions, and high contrast design.",
    artifact: "Production Frontend Application",
    icon: Zap
  },
  {
    step: "04",
    title: "Integrate & Automate Workflows",
    desc: "Connect REST/GraphQL APIs, backend services, n8n automations, and third-party integrations.",
    artifact: "Integrated Pipeline & API Layers",
    icon: Workflow
  },
  {
    step: "05",
    title: "Prove & Hand Off",
    desc: "Run comprehensive type checks, automated builds, responsive tests, and client onboarding handoff.",
    artifact: "Verified Production Build & Docs",
    icon: ShieldCheck
  }
];

export const SystemsApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Systems Operating Loop</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            ENGINEERING WORKFLOW
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          The 5-step systematic framework Mithresh uses to design, build, and deliver high-impact software products.
        </p>
      </div>

      <div className="space-y-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                    <span>{s.title}</span>
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">{s.desc}</p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 shrink-0">
                <span className="text-slate-500 block text-[9px]">DELIVERABLE ARTIFACT</span>
                {s.artifact}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
