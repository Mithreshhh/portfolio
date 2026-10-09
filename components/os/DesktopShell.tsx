'use client';

import React from 'react';
import Image from 'next/image';
import { useOS } from './OSContext';
import { ownerProfile } from '@/lib/ownerProfile';
import { SystemNav } from './SystemNav';
import { WindowManager } from './WindowManager';
import { Dock, DOCK_APPS } from './Dock';
import { DailyTransmission } from './DailyTransmission';
import { CommandPalette } from './CommandPalette';
import { MusicPlayer } from './MusicPlayer';
import { AICompanion } from './AICompanion';
import { FoldedCornerCTA } from './FoldedCornerCTA';
import { BootExperience } from './BootExperience';
import { ArrowRight, Sparkles } from 'lucide-react';

export const DesktopShell: React.FC = () => {
  const { theme, openApp, stickyNotes, deleteStickyNote } = useOS();

  const themeWallpaper = {
    day: 'bg-gradient-to-br from-rose-50 via-sky-50 to-amber-50 text-slate-900',
    night: 'bg-gradient-to-br from-slate-950 via-indigo-950 via-40% to-slate-900 text-slate-100',
    dark: 'bg-slate-950 text-emerald-400 font-mono'
  }[theme];

  return (
    <div className={`fixed inset-0 h-screen w-screen overflow-hidden select-none ${themeWallpaper}`}>
      {/* Boot Experience Intro */}
      <BootExperience />

      {/* Persistent System Top Nav Bar */}
      <SystemNav />

      {/* Environmental Ambient Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none z-0" />

      {/* Main Desktop Workspace Area */}
      <main className="relative inset-0 pt-14 pb-20 px-4 sm:px-8 h-full w-full overflow-y-auto custom-scrollbar z-10 flex flex-col justify-between">
        
        {/* Top Desktop Grid: Identity & Movable Daily Transmission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Identity & Positioning Block (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{ownerProfile.identity.roles.join(' • ')}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-indigo-400/40 shadow-2xl shrink-0">
                <Image
                  src="/images/mithresh_avatar.png"
                  alt={ownerProfile.identity.fullName}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
                  {ownerProfile.identity.fullName}
                </h1>
                <div className="text-xs sm:text-sm font-mono text-indigo-400 mt-1 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{ownerProfile.identity.roles[0]}</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              {ownerProfile.identity.headline} {ownerProfile.identity.intro}
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openApp('projects')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xl active:scale-95 transition-all"
              >
                <span>Enter the Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openApp('contact')}
                className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <span>Book Strategy Call</span>
              </button>
            </div>
          </div>

          {/* Daily Transmission & Status Widget (Right 5 Cols) */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <DailyTransmission />
          </div>
        </div>

        {/* Desktop Application Icons Grid */}
        <div className="my-8">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>SYSTEM APPLICATIONS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
            {DOCK_APPS.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => openApp(app.id, app.label)}
                  className="p-3 sm:p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-200 flex flex-col items-center justify-center text-center space-y-2 group shadow-md active:scale-95"
                >
                  <div className={`p-2.5 sm:p-3 rounded-xl border ${app.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate max-w-full">
                    {app.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Local Sticky Notes Desktop Overlay Layer */}
        {stickyNotes.length > 0 && (
          <div className="hidden lg:flex items-center space-x-3 my-4">
            {stickyNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-xl border text-xs shadow-lg max-w-xs font-sans relative group ${note.color}`}
              >
                <p className="pr-4">{note.text}</p>
                <button
                  onClick={() => deleteStickyNote(note.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-600 text-[10px] px-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Dynamic Multi-Window Layer */}
      <WindowManager />

      {/* Command Palette Modal (Cmd+K) */}
      <CommandPalette />

      {/* Ambient Music Control Surface */}
      <MusicPlayer />

      {/* AI Mascot Companion & Privacy-Safe Booking Notification */}
      <AICompanion />

      {/* Folded Corner CTA Prompt */}
      <FoldedCornerCTA />

      {/* Bottom Persistent Dock Launcher */}
      <Dock />
    </div>
  );
};
