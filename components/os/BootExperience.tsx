'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useOS } from './OSContext';
import { ownerProfile } from '@/lib/ownerProfile';
import { ArrowRight } from 'lucide-react';

export const BootExperience: React.FC = () => {
  const { bootCompleted, setBootCompleted } = useOS();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check local storage session flag
    if (typeof window !== 'undefined') {
      const hasBooted = sessionStorage.getItem('mithresh_os_booted');
      if (hasBooted) {
        setBootCompleted(true);
        return;
      }
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sessionStorage.setItem('mithresh_os_booted', 'true');
          setTimeout(() => setBootCompleted(true), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [setBootCompleted]);

  if (bootCompleted) return null;

  const handleSkip = () => {
    sessionStorage.setItem('mithresh_os_booted', 'true');
    setBootCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-[9000] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Avatar Mark */}
        <div className="relative w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-2xl animate-pulse">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-900">
            <Image
              src="/images/mithresh_avatar.png"
              alt={ownerProfile.identity.fullName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Title & Version */}
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight text-indigo-200">
            {ownerProfile.identity.osName}
          </h1>
          <p className="text-xs text-slate-400">
            {ownerProfile.identity.fullName} — Portfolio OS System Core
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Text */}
        <div className="text-[11px] text-slate-400 space-y-1">
          <div>Initialising Projects Drive, Proof Vault & Systems Loop...</div>
          <div className="text-emerald-400 font-bold">{progress}% Loaded</div>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-indigo-300 hover:text-white transition-all shadow-lg active:scale-95"
        >
          <span>Skip Boot Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
