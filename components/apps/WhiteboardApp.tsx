'use client';

import React, { useState } from 'react';
import { useOS } from '../os/OSContext';
import { Plus, Trash2 } from 'lucide-react';

export const WhiteboardApp: React.FC = () => {
  const { stickyNotes, addStickyNote, deleteStickyNote, updateStickyNote } = useOS();
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    if (!newText.trim()) return;
    addStickyNote(newText.trim());
    setNewText('');
  };

  return (
    <div className="space-y-6 select-text">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/50">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Whiteboard & Sticky Notes</span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
              SCRATCHPAD
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personal scratchpad for ideas, task lists, and quick reminders.
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Type a new sticky note..."
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-lg active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stickyNotes.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-2xl border shadow-lg space-y-3 flex flex-col justify-between transition-transform hover:-translate-y-1 ${note.color}`}
          >
            <textarea
              value={note.text}
              onChange={(e) => updateStickyNote(note.id, e.target.value)}
              className="w-full bg-transparent resize-none font-sans text-xs font-semibold focus:outline-none leading-relaxed"
              rows={4}
            />

            <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[10px] font-mono">
              <span>LOCAL NOTE</span>
              <button
                onClick={() => deleteStickyNote(note.id)}
                className="p-1 text-slate-700 hover:text-rose-600 rounded transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
