
'use client';

import React from 'react';
import { useStore } from '@/lib/store-provider';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Sparkles } from 'lucide-react';

export default function FocusPage() {
  const { state, setFocusItem, moveFocusItem, toggleFocusItemCompletion, removeFocusItem } = useStore();

  return (
    <div className="w-full h-full lg:h-screen flex flex-col overflow-hidden bg-app transition-colors">
      <header className="px-4 md:px-8 py-4 md:py-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-0.5"><Sparkles size={14} className="text-emerald-500" /><span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Active Intention</span></div>
          <h1 className="text-xl md:text-2xl font-bold serif text-zinc-900 dark:text-zinc-100">Focus Board</h1>
        </div>
        <div className="bg-zinc-100/80 dark:bg-zinc-800/80 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 md:gap-3"><div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="uppercase tracking-wider tabular-nums">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
      </header>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard activities={state.activities} focusItems={state.focusItems} onMove={moveFocusItem} onSetFocus={(activityId, column) => setFocusItem({ activityId, column, date: new Date().toISOString().split('T')[0] })} onToggleComplete={toggleFocusItemCompletion} onRemove={removeFocusItem} />
      </div>
    </div>
  );
}
