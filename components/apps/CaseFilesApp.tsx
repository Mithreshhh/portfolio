'use client';

import React, { useState } from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { FolderSearch, Folder, FileCode, ChevronRight } from 'lucide-react';

const FOLDERS = [
  {
    name: 'SaaS Platforms',
    files: [
      { name: 'Voltworx_Architecture.case', type: 'case', desc: 'CTO production platform build using Next.js 15 and React.' },
      { name: 'Voltworx_Performance_Audit.pdf', type: 'pdf', desc: 'Lighthouse score 98/100 performance audit.' }
    ]
  },
  {
    name: 'Institutional Web',
    files: [
      { name: 'MLRITM_College_Portal.case', type: 'case', desc: 'Payload CMS + Next.js web application.' },
      { name: 'IIC_Platform_Overview.doc', type: 'doc', desc: 'Institutional Innovation Council platform notes.' }
    ]
  },
  {
    name: 'Hackathons & Contests',
    files: [
      { name: 'SIH_2025_National_Submission.case', type: 'case', desc: 'Smart India Hackathon 2025 lead developer submission.' },
      { name: 'Geethanjali_Ideathon_1stPlace.award', type: 'award', desc: 'First place winning solution documentation.' }
    ]
  },
  {
    name: 'Developer Tools',
    files: [
      { name: 'DSA_Helper_Chrome_Extension.ext', type: 'ext', desc: 'Chrome API extension detecting algorithm problem contexts.' }
    ]
  }
];

export const CaseFilesApp: React.FC = () => {
  const [activeFolderIndex, setActiveFolderIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(FOLDERS[0].files[0]);

  const activeFolder = FOLDERS[activeFolderIndex];

  return (
    <div className="space-y-4 select-text">
      <div className="pb-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
          <FolderSearch className="w-4 h-4 text-violet-400" />
          <span>Case Files</span>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-violet-300 font-bold">{activeFolder.name}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">FINDER EXPLORER</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">
        {/* Sidebar Folders */}
        <div className="space-y-1 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
          <span className="px-2 py-1 text-[9px] font-mono text-slate-500 block uppercase">CATEGORIES</span>
          {FOLDERS.map((f, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveFolderIndex(i);
                setSelectedFile(f.files[0]);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                activeFolderIndex === i
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Folder className="w-4 h-4 text-violet-400" />
              <span className="truncate">{f.name}</span>
            </button>
          ))}
        </div>

        {/* Files List */}
        <div className="space-y-1 bg-slate-950/60 p-2 rounded-2xl border border-slate-800">
          <span className="px-2 py-1 text-[9px] font-mono text-slate-500 block uppercase">FILES IN {activeFolder.name.toUpperCase()}</span>
          {activeFolder.files.map((file, i) => (
            <button
              key={i}
              onClick={() => setSelectedFile(file)}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                selectedFile.name === file.name
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>

        {/* File Preview Details */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
          <span className="text-[10px] text-violet-400 font-bold block uppercase border-b border-slate-800 pb-2">
            INSPECTOR PREVIEW
          </span>
          <div className="space-y-1">
            <span className="text-slate-200 font-bold block">{selectedFile.name}</span>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">{selectedFile.desc}</p>
          </div>
          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500">
            Author: {ownerProfile.identity.fullName}<br />
            Status: Verified Output
          </div>
        </div>
      </div>
    </div>
  );
};
