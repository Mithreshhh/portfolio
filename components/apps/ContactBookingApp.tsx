'use client';

import React, { useState } from 'react';
import { ownerProfile } from '@/lib/ownerProfile';
import { Calendar, MessageSquare, Copy, Check, Send } from 'lucide-react';

export const ContactBookingApp: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Full-Stack Web App',
    budget: '$1k - $5k',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ownerProfile.conversion.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 select-text">
      <div className="pb-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <span>Contact & Strategy Booking</span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            CONVERSION CENTER
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Direct messaging, strategy call booking, and quick contact routes for Mithresh Uttarwar.
        </p>
      </div>

      {/* Quick Action Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href={ownerProfile.conversion.secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-indigo-900/40 border border-indigo-500/40 hover:bg-indigo-900/70 transition-all flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Schedule Call</h4>
            <span className="text-[10px] font-mono text-indigo-300">Book Strategy Meeting</span>
          </div>
        </a>

        <button
          onClick={handleCopyEmail}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all flex items-center space-x-3 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">{copied ? 'Email Copied!' : 'Copy Direct Email'}</h4>
            <span className="text-[10px] font-mono text-slate-400 truncate block max-w-[140px]">
              {ownerProfile.conversion.email}
            </span>
          </div>
        </button>

        <a
          href={ownerProfile.conversion.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-950/70 transition-all flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">SOS / WhatsApp</h4>
            <span className="text-[10px] font-mono text-emerald-300">Rapid Response</span>
          </div>
        </a>
      </div>

      {/* Project Brief Inquiry Form */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <span>Submit Project Brief</span>
        </h3>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Project Brief Received!</span>
            </div>
            <p className="text-slate-300 font-sans">
              Thank you for reaching out. Mithresh will review your details and respond via email within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="sarah@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Project Category</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option>Full-Stack Web App</option>
                  <option>Next.js / CMS Platform</option>
                  <option>AI Workflow / Automation</option>
                  <option>Technical Advisory & CTO</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-mono text-[10px] uppercase">Estimated Budget</label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option>$1k - $5k</option>
                  <option>$5k - $15k</option>
                  <option>$15k+</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[10px] uppercase">Project Context & Success Goals</label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe what you want to build and your target launch date..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Project Brief</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
