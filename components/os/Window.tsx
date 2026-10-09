'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from './OSContext';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  isMaximized,
  isMinimized,
  zIndex,
  children
}) => {
  const { closeApp, minimizeApp, maximizeApp, focusApp, activeWindowId, theme } = useOS();
  const isActive = activeWindowId === id;

  // Window drag state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 80, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    // Initial staggered offset based on window id length
    const offset = (id.length * 15) % 120;
    setPosition({ x: Math.max(20, 80 + offset), y: Math.max(60, 70 + offset) });
  }, [id]);

  if (isMinimized) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMaximized) return;
    focusApp(id);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isMaximized) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    // Keep window inside viewport boundaries
    const maxX = Math.max(100, window.innerWidth - 300);
    const maxY = Math.max(100, window.innerHeight - 150);
    setPosition({
      x: Math.min(Math.max(10, newX), maxX),
      y: Math.min(Math.max(45, newY), maxY)
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release safety
      }
    }
  };

  const themeClasses = {
    day: 'bg-white/95 text-slate-900 border-slate-300 shadow-2xl shadow-slate-400/30',
    night: 'bg-slate-900/95 text-slate-100 border-indigo-500/30 shadow-2xl shadow-indigo-950/50',
    dark: 'bg-slate-950/95 text-emerald-300 border-emerald-500/30 shadow-2xl shadow-emerald-950/60'
  }[theme];

  const titleBarTheme = {
    day: isActive ? 'bg-slate-100 text-slate-900 border-b border-slate-200' : 'bg-slate-50 text-slate-500 border-b border-slate-200',
    night: isActive ? 'bg-slate-850/90 text-indigo-100 border-b border-indigo-500/20' : 'bg-slate-900/60 text-slate-400 border-b border-indigo-500/10',
    dark: isActive ? 'bg-slate-900 text-emerald-400 border-b border-emerald-500/20' : 'bg-slate-950 text-slate-500 border-b border-emerald-900/30'
  }[theme];

  return (
    <div
      role="dialog"
      aria-label={title}
      onClick={() => focusApp(id)}
      style={{
        zIndex,
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 40 : `${position.y}px`,
        width: isMaximized ? '100vw' : 'min(920px, 92vw)',
        height: isMaximized ? 'calc(100vh - 40px)' : 'min(640px, 80vh)',
        position: 'fixed'
      }}
      className={`flex flex-col rounded-xl border backdrop-blur-2xl transition-shadow duration-200 overflow-hidden ${themeClasses} ${
        isActive ? 'ring-2 ring-indigo-500/40' : 'opacity-95'
      }`}
    >
      {/* Title Bar */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`flex items-center justify-between px-4 py-2.5 select-none cursor-grab active:cursor-grabbing ${titleBarTheme}`}
      >
        {/* Left Mac-style Traffic Light Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeApp(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-rose-950 text-[9px] font-bold group"
            title="Close"
          >
            <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeApp(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-amber-400 hover:bg-amber-500 flex items-center justify-center text-amber-950 text-[9px] font-bold group"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeApp(id);
            }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-emerald-950 text-[9px] font-bold group"
            title="Maximize"
          >
            {isMaximized ? (
              <Minimize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Window Title */}
        <div className="text-xs font-semibold tracking-wide flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{title}</span>
        </div>

        {/* Right Status Badge */}
        <div className="text-[11px] font-mono opacity-60">
          {id.toUpperCase()}
        </div>
      </div>

      {/* Internal Scrollable Window Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {children}
      </div>
    </div>
  );
};
