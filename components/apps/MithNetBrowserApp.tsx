'use client';

import React, { useState } from 'react';
import { Globe, ArrowLeft, ArrowRight, RotateCw, ExternalLink, Bookmark } from 'lucide-react';

const BOOKMARKS = [
  { name: 'Voltworx SaaS', url: 'https://www.volt-worx.com/' },
  { name: 'MLRITM College Web', url: 'https://mlritm-web.vercel.app/' },
  { name: 'Mithresh GitHub', url: 'https://github.com/Mithreshhh' }
];

export const MithNetBrowserApp: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState(BOOKMARKS[0].url);
  const [urlInput, setUrlInput] = useState(BOOKMARKS[0].url);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      let target = urlInput.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }
      setCurrentUrl(target);
    }
  };

  return (
    <div className="space-y-4 select-text flex flex-col h-full">
      {/* Browser Controls Bar */}
      <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button className="p-1 rounded text-slate-400 hover:text-white">
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="p-1 rounded text-slate-400 hover:text-white">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleNavigate} className="flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </form>

          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center space-x-1"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Bookmarks */}
        <div className="flex items-center space-x-2 text-xs font-mono pt-1 border-t border-slate-800">
          <Bookmark className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400 text-[10px]">BOOKMARKS:</span>
          {BOOKMARKS.map((bm, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentUrl(bm.url);
                setUrlInput(bm.url);
              }}
              className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sky-300 text-[10px] transition-colors"
            >
              {bm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Frame / Fallback Preview Container */}
      <div className="flex-1 min-h-[380px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center p-6 text-center">
        <iframe
          src={currentUrl}
          className="w-full h-full border-0 absolute inset-0 bg-white"
          title="MithNet Browser Frame"
          sandbox="allow-scripts allow-same-origin"
        />

        <div className="relative z-10 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 max-w-md space-y-3 backdrop-blur-md shadow-2xl">
          <Globe className="w-8 h-8 text-sky-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Viewing {currentUrl}</h3>
          <p className="text-xs text-slate-300">
            If the live site blocks iframe embedding due to X-Frame-Options, click below to open directly in a new browser tab.
          </p>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all"
          >
            <span>Open {currentUrl}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
