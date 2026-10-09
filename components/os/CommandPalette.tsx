'use client';

import React, { useState, useEffect } from 'react';
import { useOS } from './OSContext';
import { ownerProfile } from '@/lib/ownerProfile';
import { Search, X } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, openApp, setTheme } = useOS();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const items = [
    { type: 'App', title: 'Projects Drive', action: () => openApp('projects') },
    { type: 'App', title: 'Impact & Results', action: () => openApp('results') },
    { type: 'App', title: 'Systems Workflow', action: () => openApp('systems') },
    { type: 'App', title: 'Proof Vault', action: () => openApp('proof') },
    { type: 'App', title: 'Journey Timeline', action: () => openApp('journey') },
    { type: 'App', title: 'Achievements', action: () => openApp('achievements') },
    { type: 'App', title: 'Connect & Socials', action: () => openApp('socials') },
    { type: 'App', title: 'Learn Library', action: () => openApp('learn') },
    { type: 'App', title: 'AI Voice Agent', action: () => openApp('aiagent') },
    { type: 'App', title: 'Founder.txt', action: () => openApp('founder') },
    { type: 'App', title: 'Whiteboard Sticky Notes', action: () => openApp('whiteboard') },
    { type: 'App', title: 'MithNet Browser', action: () => openApp('browser') },
    { type: 'App', title: 'Contact & Booking', action: () => openApp('contact') },
    { type: 'App', title: 'Case Explorer', action: () => openApp('casefiles') },
    ...ownerProfile.projects.map((p) => ({
      type: 'Project',
      title: p.name + ' — ' + p.category,
      action: () => openApp('projects')
    })),
    { type: 'Theme', title: 'Switch to Day Theme', action: () => setTheme('day') },
    { type: 'Theme', title: 'Switch to Night Theme', action: () => setTheme('night') },
    { type: 'Theme', title: 'Switch to Workstation Dark Theme', action: () => setTheme('dark') }
  ];

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) || i.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[6000] flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-md select-none">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-indigo-500/40 text-slate-100 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 space-x-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, apps, themes, or commands..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching commands or applications found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.action();
                  setCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-indigo-600/20 text-left transition-colors text-xs group"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 border border-slate-700 text-indigo-300">
                    {item.type}
                  </span>
                  <span className="font-medium text-slate-200 group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-indigo-400">
                  Select ↵
                </span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <span>Navigate with search & click</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
