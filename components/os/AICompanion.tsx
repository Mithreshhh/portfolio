'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ownerProfile } from '@/lib/ownerProfile';
import { X, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';

export const AICompanion: React.FC = () => {
  const [state, setState] = useState<'idle' | 'happy' | 'sad' | 'excited'>('happy');
  const [showPing, setShowPing] = useState(true);
  const [muted, setMuted] = useState(true);

  // Position state (bottom-left area)
  const [pos, setPos] = useState({ x: 24, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const maxX = Math.max(100, window.innerWidth - 180);
    const maxY = Math.max(100, window.innerHeight - 150);
    setPos({
      x: Math.min(Math.max(10, e.clientX - dragStartRef.current.x), maxX),
      y: Math.min(Math.max(60, e.clientY - dragStartRef.current.y), maxY)
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const resetPos = () => {
    setPos({ x: 24, y: 120 });
    setState('happy');
  };

  return (
    <div
      style={{ left: `${pos.x}px`, bottom: `${pos.y}px` }}
      className="fixed z-[5450] flex flex-col items-start space-y-2 select-none group"
    >
      {/* Privacy-Safe Booking Ping Notification Card */}
      {showPing && (
        <div className="relative max-w-xs p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-slate-100 text-xs shadow-2xl backdrop-blur-xl animate-bounce-subtle">
          <button
            onClick={() => setShowPing(false)}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded"
            title="Dismiss notification"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center space-x-2 pb-1 mb-1 border-b border-indigo-500/20 text-[10px] font-mono text-indigo-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>BOOKING ACTIVITY</span>
          </div>

          <p className="leading-snug text-[11px] text-slate-200">
            Someone just booked a call with{' '}
            <span className="font-bold text-indigo-300">{ownerProfile.identity.fullName}</span>. Looks like they do not want their business falling behind.
          </p>

          <div className="mt-2 text-[9px] font-mono text-slate-400 flex items-center justify-between">
            <span>Verified System Ping</span>
            <button
              onClick={() => setShowPing(false)}
              className="text-indigo-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* AI Companion Sprite Container */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          setState((prev) => (prev === 'happy' ? 'excited' : prev === 'excited' ? 'idle' : 'happy'));
        }}
        className="relative flex items-center space-x-2 cursor-grab active:cursor-grabbing p-1.5 rounded-2xl bg-slate-900/60 border border-indigo-500/30 backdrop-blur-md hover:scale-105 transition-all shadow-xl"
      >
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-1">
          <Image
            src="/images/ai_companion.png"
            alt="AI Companion Mascot"
            fill
            className="object-contain p-0.5"
          />
        </div>

        {/* Companion Quick Controls */}
        <div className="flex flex-col text-[10px] font-mono pr-1">
          <div className="flex items-center space-x-1 font-bold text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>MITH-AI</span>
          </div>
          <span className="text-slate-400 capitalize">{state} State</span>

          <div className="flex items-center space-x-2 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMuted((prev) => !prev);
              }}
              className="text-slate-400 hover:text-white"
              title={muted ? 'Unmute Chirp' : 'Mute Chirp'}
            >
              {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-indigo-400" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetPos();
              }}
              className="text-slate-400 hover:text-white"
              title="Reset Position"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
