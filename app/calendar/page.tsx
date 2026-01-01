
'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-provider';
import { DatabaseTable } from '@/components/DatabaseTable';
import { CalendarView } from '@/components/CalendarView';

export default function CalendarPage() {
  const { state, addActivity, deleteActivity, updateActivity } = useStore();
  const [dbView, setDbView] = useState<'table' | 'calendar'>('table');

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold serif text-zinc-900 dark:text-zinc-100 mb-2">Life Archive</h1>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm md:text-base italic serif">Every small action counts towards your story.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl self-start w-full md:w-auto">
          <button onClick={() => setDbView('table')} className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${dbView === 'table' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}>Table</button>
          <button onClick={() => setDbView('calendar')} className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${dbView === 'calendar' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600'}`}>Calendar</button>
        </div>
      </header>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {dbView === 'table' ? <DatabaseTable activities={state.activities} onDelete={deleteActivity} onUpdate={updateActivity} /> : <CalendarView activities={state.activities} onAddActivity={addActivity} />}
      </div>
    </div>
  );
}
