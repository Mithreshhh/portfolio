'use client';

import React from 'react';
import { Play, ExternalLink } from 'lucide-react';

const VIDEOS = [
  {
    title: "Next.js 15 Full-Stack Masterclass & App Router",
    topic: "Frontend & Server Components",
    desc: "Architecting zero-bundle-size React components, server actions, and route handlers.",
    url: "https://www.youtube.com/results?search_query=nextjs+15+app+router"
  },
  {
    title: "Building Production Web Apps with React 18 & TypeScript",
    topic: "TypeScript Patterns",
    desc: "Strict type safety, custom hooks, state management, and performance tuning.",
    url: "https://www.youtube.com/results?search_query=react+18+typescript+patterns"
  },
  {
    title: "AI Workflows, Agentic Automation & n8n Integration",
    topic: "AI Engineering",
    desc: "Connecting LLMs, custom webhooks, and n8n workflows for automated business operations.",
    url: "https://www.youtube.com/results?search_query=n8n+ai+agent+automation"
  }
];

export const LearnApp: React.FC = () => {
  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Learn & Public Tech Library</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            KNOWLEDGE BASE
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Curated full-stack tutorials, AI agent architecture notes, and web engineering references.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {VIDEOS.map((v, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-purple-500/40 transition-all"
          >
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                {v.topic}
              </span>
              <h3 className="text-base font-bold text-slate-100">{v.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{v.desc}</p>
            </div>

            <a
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/30 text-purple-200 text-xs font-mono flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-1.5">
                <Play className="w-3.5 h-3.5 fill-purple-300" />
                <span>Explore Resource</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
