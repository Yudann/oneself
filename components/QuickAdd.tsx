"use client";

import React, { useState } from 'react';
import { useStore } from '../lib/store-provider';
import { Category, Intensity, Mood } from '../lib/types';
import { CATEGORIES, INTENSITIES, MOODS } from '../lib/constants';
import { Plus, X } from 'lucide-react';

export const QuickAdd: React.FC = () => {
  const { addActivity } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Personal' as Category,
    intensity: 'medium' as Intensity,
    mood: 'Neutral' as Mood,
    duration: 30,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addActivity({ ...form, tags: [] });
    setForm({ ...form, name: '' });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-40 group"
      >
        <Plus size={28} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-zinc-900/60 dark:bg-black/80 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 serif italic">New Log</h2>
                <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-[0.2em] mt-1">Life Balance Engine</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all text-zinc-400 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest">What did you do?</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="E.g. Meditation..."
                  className="w-full text-xl md:text-2xl border-b-2 border-zinc-100 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 bg-transparent transition-all py-2 outline-none font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-200 dark:placeholder:text-zinc-800 serif italic"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest">Category</label>
                  <select 
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none transition-all appearance-none"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value as Category})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest">Duration (min)</label>
                  <input
                    type="number"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl p-4 text-xs font-bold text-zinc-700 dark:text-zinc-300 outline-none tabular-nums"
                    value={form.duration}
                    onChange={e => setForm({...form, duration: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest">Intensity</label>
                <div className="flex gap-2">
                  {INTENSITIES.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({...form, intensity: i})}
                      className={`
                        flex-1 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all
                        ${form.intensity === i 
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xl scale-[1.02]' 
                          : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}
                      `}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 px-1 tracking-widest">Mood</label>
                <div className="flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30 p-4 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setForm({...form, mood: m})}
                      className={`
                        w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all
                        ${form.mood === m 
                          ? 'bg-white dark:bg-zinc-700 shadow-xl scale-125 rotate-6' 
                          : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}
                      `}
                      title={m}
                    >
                      {m === 'Great' && '😆'}
                      {m === 'Good' && '😊'}
                      {m === 'Neutral' && '😐'}
                      {m === 'Tired' && '😴'}
                      {m === 'Low' && '😔'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-5 rounded-[2rem] font-bold text-sm tracking-widest uppercase hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-2xl active:scale-95"
              >
                Log to life
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
