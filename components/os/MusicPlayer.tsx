'use client';

import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { title: "Synthwave Workstation", artist: "Mithresh OS Audio", duration: "03:45" },
  { title: "Full-Stack Ambient Flow", artist: "Developer Beats", duration: "04:12" },
  { title: "Hackathon Cyber pulse", artist: "Voltworx Sound", duration: "02:50" }
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const track = TRACKS[currentTrackIndex];

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="fixed bottom-16 right-4 z-[5400] hidden lg:flex items-center space-x-3 px-3 py-2 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-slate-100 shadow-2xl backdrop-blur-xl select-none">
      <div className={`w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 ${isPlaying ? 'animate-spin-slow' : ''}`}>
        <Music className="w-4 h-4" />
      </div>

      <div className="flex flex-col text-xs font-mono max-w-[130px]">
        <span className="font-bold text-slate-200 truncate">{track.title}</span>
        <span className="text-[10px] text-slate-400 truncate">{track.artist}</span>
      </div>

      <div className="flex items-center space-x-1.5">
        <button
          onClick={handlePrev}
          className="p-1 text-slate-400 hover:text-white rounded"
          title="Previous Track"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all active:scale-95"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleNext}
          className="p-1 text-slate-400 hover:text-white rounded"
          title="Next Track"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-1 text-slate-400 hover:text-white border-l border-slate-800 pl-2"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
      </button>
    </div>
  );
};
