'use client';

import React from 'react';
import { useOS } from './OSContext';
import { ownerProfile } from '@/lib/ownerProfile';
import { Calendar, ArrowUpRight } from 'lucide-react';

export const FoldedCornerCTA: React.FC = () => {
  const { openApp } = useOS();

  return (
    <div className="fixed bottom-0 right-0 z-[5300] select-none pointer-events-auto">
      {/* Desktop Triangular Folded Corner */}
      <div className="hidden sm:block relative w-44 h-44 overflow-hidden group">
        <a
          href={ownerProfile.conversion.secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-4 flex flex-col justify-end items-end text-right clip-path-fold shadow-2xl transition-transform duration-300 group-hover:scale-105"
          style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
        >
          <div className="flex items-center space-x-1 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200">
            <span>Want This For Yourself?</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
          <span className="text-xs font-extrabold tracking-tight">Book a Strategy Call</span>
        </a>
      </div>

      {/* Mobile Full-Width Floating CTA Badge */}
      <div className="sm:hidden fixed bottom-16 left-3 right-3 p-3 rounded-xl bg-indigo-900/90 border border-indigo-500/40 text-white flex items-center justify-between shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-indigo-300 uppercase">Work With Mithresh</span>
          <span className="text-xs font-bold">Book a Strategy Call</span>
        </div>
        <button
          onClick={() => openApp('contact')}
          className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs flex items-center space-x-1 active:scale-95 transition-all min-h-[44px]"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
};
