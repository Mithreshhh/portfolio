'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useOS } from './OSContext';
import { ownerProfile } from '@/lib/ownerProfile';
import { Search, Sun, Moon, Terminal, Signal, Briefcase } from 'lucide-react';

export const SystemNav: React.FC = () => {
  const { theme, setTheme, openApp, setCommandPaletteOpen } = useOS();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navTheme = {
    day: 'bg-white/80 border-b border-slate-200/80 text-slate-800 backdrop-blur-xl shadow-sm',
    night: 'bg-slate-950/80 border-b border-indigo-500/20 text-slate-100 backdrop-blur-xl shadow-lg',
    dark: 'bg-slate-950/95 border-b border-emerald-500/20 text-emerald-300 backdrop-blur-xl shadow-lg'
  }[theme];

  return (
    <header className={`fixed top-0 left-0 right-0 h-10 z-[5400] flex items-center justify-between px-3 sm:px-4 text-xs font-mono select-none ${navTheme}`}>
      {/* Left Identity & Brand Mark */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => openApp('projects')}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-indigo-400/40 bg-slate-900">
            <Image
              src="/images/mithresh_avatar.png"
              alt={ownerProfile.identity.fullName}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold tracking-tight text-sm">
            {ownerProfile.identity.osName}
          </span>
        </button>

        <span className="hidden sm:inline text-slate-500">|</span>

        {/* Quick Nav App Shortcuts */}
        <div className="hidden md:flex items-center space-x-3 text-[11px]">
          <button
            onClick={() => openApp('projects')}
            className="hover:text-indigo-400 transition-colors flex items-center space-x-1"
          >
            <Briefcase className="w-3 h-3" />
            <span>Work</span>
          </button>
          <button
            onClick={() => openApp('proof')}
            className="hover:text-indigo-400 transition-colors"
          >
            Proof
          </button>
          <button
            onClick={() => openApp('journey')}
            className="hover:text-indigo-400 transition-colors"
          >
            Journey
          </button>
          <button
            onClick={() => openApp('achievements')}
            className="hover:text-indigo-400 transition-colors"
          >
            Achievements
          </button>
        </div>
      </div>

      {/* Middle Search & Command Palette Trigger */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 text-[11px] text-slate-300 transition-all"
        >
          <Search className="w-3 h-3 text-indigo-400" />
          <span className="hidden sm:inline">Search OS...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] bg-slate-900 border border-slate-700 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls & System Status */}
      <div className="flex items-center space-x-3 text-[11px]">
        {/* Availability Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-[10px]">AVAILABLE FOR PROJECTS</span>
        </div>

        {/* Theme Switcher Toggle */}
        <div className="flex items-center bg-slate-900/60 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setTheme('day')}
            className={`p-1 rounded ${theme === 'day' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            title="Day Mode"
          >
            <Sun className="w-3 h-3" />
          </button>
          <button
            onClick={() => setTheme('night')}
            className={`p-1 rounded ${theme === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Night Mode"
          >
            <Moon className="w-3 h-3" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1 rounded ${theme === 'dark' ? 'bg-emerald-600 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            title="Workstation Dark Mode"
          >
            <Terminal className="w-3 h-3" />
          </button>
        </div>

        {/* Signal & Time */}
        <div className="flex items-center space-x-2 border-l border-slate-700/50 pl-3">
          <Signal className="w-3 h-3 text-emerald-400" />
          <div className="flex flex-col text-right leading-none">
            <span className="font-bold text-[11px] text-slate-200">{time}</span>
            <span className="text-[9px] text-slate-400 hidden sm:inline">{date} (IST)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
