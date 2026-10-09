'use client';

import React from 'react';
import { useOS } from './OSContext';
import {
  FolderGit2,
  TrendingUp,
  Cpu,
  Video,
  Milestone,
  Trophy,
  Share2,
  BookOpen,
  Bot,
  FileText,
  PenTool,
  Globe,
  Calendar,
  FolderSearch
} from 'lucide-react';

export const DOCK_APPS = [
  { id: 'projects', label: 'Projects Drive', icon: FolderGit2, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  { id: 'results', label: 'Impact & Results', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'systems', label: 'Systems Workflow', icon: Cpu, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'proof', label: 'Proof Vault', icon: Video, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'journey', label: 'Journey Timeline', icon: Milestone, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  { id: 'socials', label: 'Connect & Socials', icon: Share2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { id: 'learn', label: 'Learn Library', icon: BookOpen, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'aiagent', label: 'AI Voice Agent', icon: Bot, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  { id: 'founder', label: 'Founder.txt', icon: FileText, color: 'text-slate-300 bg-slate-500/10 border-slate-500/30' },
  { id: 'whiteboard', label: 'Whiteboard Notes', icon: PenTool, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  { id: 'browser', label: 'MithNet Browser', icon: Globe, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { id: 'contact', label: 'Contact & Booking', icon: Calendar, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  { id: 'casefiles', label: 'Case Explorer', icon: FolderSearch, color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' }
];

export const Dock: React.FC = () => {
  const { openApp, focusApp, isAppOpen, activeWindowId, theme } = useOS();

  const dockBg = {
    day: 'bg-white/80 border-slate-300/80 shadow-2xl shadow-slate-300/50 backdrop-blur-2xl',
    night: 'bg-slate-950/80 border-indigo-500/25 shadow-2xl shadow-slate-950/80 backdrop-blur-2xl',
    dark: 'bg-slate-950/95 border-emerald-500/25 shadow-2xl shadow-slate-950 backdrop-blur-2xl'
  }[theme];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[5500] max-w-[95vw] px-2 sm:px-3 py-2 rounded-2xl border flex items-center space-x-1.5 sm:space-x-2.5 overflow-x-auto custom-scrollbar select-none transition-all duration-300">
      <div className={`flex items-center space-x-1.5 sm:space-x-2.5 ${dockBg} px-2 py-1.5 rounded-2xl border`}>
        {DOCK_APPS.map((app) => {
          const Icon = app.icon;
          const isOpen = isAppOpen(app.id);
          const isActive = activeWindowId === app.id;

          return (
            <button
              key={app.id}
              onClick={() => {
                if (isOpen) {
                  focusApp(app.id);
                } else {
                  openApp(app.id, app.label);
                }
              }}
              className={`group relative p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1.5 active:scale-95 focus:outline-none ${app.color} ${
                isActive ? 'ring-2 ring-indigo-400 scale-105' : 'hover:scale-105'
              }`}
              title={app.label}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />

              {/* Active Dot Indicator */}
              {isOpen && (
                <span
                  className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-400'
                  }`}
                />
              )}

              {/* Tooltip on Hover */}
              <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-100 text-[10px] font-mono rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
