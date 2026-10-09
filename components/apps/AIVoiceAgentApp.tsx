'use client';

import React, { useState } from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { Bot, Mic, MicOff, Send, ShieldAlert } from 'lucide-react';

export const AIVoiceAgentApp: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [chatLog, setChatLog] = useState([
    { sender: 'AI', text: `Hello! I am Mithresh's Portfolio AI Agent. You can ask me about Mithresh's tech stack, Voltworx CTO work, or SIH 2025 development.` }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setChatLog((prev) => [...prev, { sender: 'User', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = `Mithresh Uttarwar is a CTO and Full-Stack Developer specializing in Next.js, React, Node.js, and AI automation tools.`;
      if (userMsg.toLowerCase().includes('voltworx')) {
        reply = `Voltworx is a live flagship SaaS application built by Mithresh as CTO using Next.js 15, React, and Tailwind CSS. You can visit it live at volt-worx.com!`;
      } else if (userMsg.toLowerCase().includes('sih') || userMsg.toLowerCase().includes('hackathon')) {
        reply = `Mithresh is the Lead Developer for SIH 2025 (Smart India Hackathon) building scalable React and Node.js solutions. He also won 1st place at the Geethanjali Ideathon!`;
      } else if (userMsg.toLowerCase().includes('contact') || userMsg.toLowerCase().includes('hire') || userMsg.toLowerCase().includes('email')) {
        reply = `You can email Mithresh directly at mithreshuttarwarmmvi@gmail.com or book a strategy call via the Contact App!`;
      }
      setChatLog((prev) => [...prev, { sender: 'AI', text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-6 select-text flex flex-col h-full">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Talk to AI Voice Agent</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
            DEMO AGENT
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Interactive AI Voice & Chat Assistant for {ownerProfile.identity.fullName}.
        </p>
      </div>

      {/* Voice Control Indicator */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-pink-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 flex items-center justify-center ${isListening ? 'animate-ping' : ''}`}>
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Mithresh AI Assistant</h3>
            <span className="text-[11px] font-mono text-emerald-400">STATUS: ONLINE & ACTIVE</span>
          </div>
        </div>

        <button
          onClick={() => setIsListening(!isListening)}
          className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center space-x-2 transition-all ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isListening ? 'Listening...' : 'Start Voice Chat'}</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 min-h-[220px] max-h-[280px] overflow-y-auto p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 custom-scrollbar">
        {chatLog.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[9px] font-mono text-slate-500 px-1">{msg.sender}</span>
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'User'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI about Mithresh's projects, stack, or availability..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-lg active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </div>

      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-500">
        <ShieldAlert className="w-3 h-3 text-pink-400" />
        <span>Privacy Note: Conversations remain local and client-side only.</span>
      </div>
    </div>
  );
};
