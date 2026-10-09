'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

interface OSContextType {
  theme: 'day' | 'night' | 'dark';
  setTheme: (_theme: 'day' | 'night' | 'dark') => void;
  openWindows: WindowState[];
  activeWindowId: string | null;
  openApp: (_id: string, _title?: string, _icon?: string) => void;
  closeApp: (_id: string) => void;
  minimizeApp: (_id: string) => void;
  maximizeApp: (_id: string) => void;
  focusApp: (_id: string) => void;
  isAppOpen: (_id: string) => boolean;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (_open: boolean) => void;
  stickyNotes: StickyNote[];
  addStickyNote: (_text?: string) => void;
  deleteStickyNote: (_id: string) => void;
  updateStickyNote: (_id: string, _text: string) => void;
  bootCompleted: boolean;
  setBootCompleted: (_completed: boolean) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'day' | 'night' | 'dark'>('night');
  const [openWindows, setOpenWindows] = useState<WindowState[]>([
    { id: 'projects', title: 'Projects Drive', icon: 'FolderGit2', isMaximized: false, isMinimized: false, zIndex: 10 }
  ]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>('projects');
  const [nextZIndex, setNextZIndex] = useState(11);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [bootCompleted, setBootCompleted] = useState(false);

  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([
    { id: '1', text: '🚀 Launch Voltworx v2 update', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 border-amber-300', x: 120, y: 180 },
    { id: '2', text: '💡 Prepare SIH 2025 presentation slides', color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border-emerald-300', x: 140, y: 320 }
  ]);

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openApp = (id: string, title?: string, icon?: string) => {
    setOpenWindows((prev) => {
      const existing = prev.find((w) => w.id === id);
      if (existing) {
        return prev.map((w) =>
          w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
        );
      } else {
        const appTitles: Record<string, { title: string; icon: string }> = {
          projects: { title: 'Projects Drive', icon: 'FolderGit2' },
          results: { title: 'Impact & Results', icon: 'TrendingUp' },
          systems: { title: 'Systems Workflow', icon: 'Cpu' },
          proof: { title: 'Proof Vault', icon: 'Video' },
          journey: { title: 'Journey Timeline', icon: 'Milestone' },
          achievements: { title: 'Achievements', icon: 'Trophy' },
          socials: { title: 'Connect & Socials', icon: 'Share2' },
          learn: { title: 'Learn Library', icon: 'BookOpen' },
          aiagent: { title: 'AI Voice Agent', icon: 'Bot' },
          founder: { title: 'Founder.txt', icon: 'FileText' },
          whiteboard: { title: 'Whiteboard', icon: 'PenTool' },
          browser: { title: 'MithNet Browser', icon: 'Globe' },
          contact: { title: 'Contact & Booking', icon: 'Calendar' },
          casefiles: { title: 'Case Files Explorer', icon: 'FolderSearch' }
        };

        const appInfo = appTitles[id] || { title: title || id, icon: icon || 'App' };
        return [...prev, { id, title: appInfo.title, icon: appInfo.icon, isMaximized: false, isMinimized: false, zIndex: nextZIndex }];
      }
    });
    setNextZIndex((z) => z + 1);
    setActiveWindowId(id);
  };

  const closeApp = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = openWindows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        const highestZ = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(highestZ.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const minimizeApp = (id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const activeUnminimized = openWindows.filter((w) => w.id !== id && !w.isMinimized);
      if (activeUnminimized.length > 0) {
        const highestZ = [...activeUnminimized].sort((a, b) => b.zIndex - a.zIndex)[0];
        setActiveWindowId(highestZ.id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const maximizeApp = (id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const focusApp = (id: string) => {
    setOpenWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w))
    );
    setNextZIndex((z) => z + 1);
    setActiveWindowId(id);
  };

  const isAppOpen = (id: string) => openWindows.some((w) => w.id === id && !w.isMinimized);

  const addStickyNote = (text?: string) => {
    const colors = [
      'bg-amber-100 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 border-amber-300',
      'bg-sky-100 dark:bg-sky-900/40 text-sky-950 dark:text-sky-100 border-sky-300',
      'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border-emerald-300',
      'bg-rose-100 dark:bg-rose-900/40 text-rose-950 dark:text-rose-100 border-rose-300'
    ];
    const newNote: StickyNote = {
      id: Date.now().toString(),
      text: text || 'New Sticky Note...',
      color: colors[Math.floor(Math.random() * colors.length)],
      x: 100 + Math.random() * 80,
      y: 150 + Math.random() * 80
    };
    setStickyNotes((prev) => [...prev, newNote]);
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateStickyNote = (id: string, text: string) => {
    setStickyNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  };

  return (
    <OSContext.Provider
      value={{
        theme,
        setTheme,
        openWindows,
        activeWindowId,
        openApp,
        closeApp,
        minimizeApp,
        maximizeApp,
        focusApp,
        isAppOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        stickyNotes,
        addStickyNote,
        deleteStickyNote,
        updateStickyNote,
        bootCompleted,
        setBootCompleted
      }}
    >
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};
