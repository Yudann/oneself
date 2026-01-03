import React, { useState, useMemo } from 'react';
import { Calendar, List, BarChart3, Settings, Plus, CheckCircle2, Circle, Star, ArrowLeft, Flame, Trophy, Minus, Edit2, Check } from 'lucide-react';
import { Habit, HabitLog, UserProfile } from '../../lib/types';
import { PILLARS } from '../../lib/constants';
import Link from 'next/link';
import { HabitHeatmap } from './HabitHeatmap';

interface HabitTrackerLayoutProps {
  habits: Habit[];
  logs: HabitLog[];
  userPreferences: any; 
  userProfile?: UserProfile;
  onAddHabit: (habit: any) => void;
  onUpdateHabit: (id: string, updates: any) => void;
  onDeleteHabit: (id: string) => void;
  onToggleLog: (habitId: string, date: string) => void;
  onUpdateLog: (habitId: string, date: string, count: number) => void;
  onUpdatePreferences: (updates: any) => void;
}

export const HabitTrackerLayout: React.FC<HabitTrackerLayoutProps> = ({ 
  habits, logs, onAddHabit, onUpdateHabit, onDeleteHabit, onToggleLog, onUpdateLog, userPreferences, onUpdatePreferences, userProfile
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'habits' | 'insights' | 'settings'>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = new Date().toISOString().split('T')[0];

  const mostConsistentHabitId = useMemo(() => {
      const counts: Record<string, number> = {};
      logs.forEach(l => {
          counts[l.habitId] = (counts[l.habitId] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [logs]);

  const favoriteHabit = habits.find(h => h.id === mostConsistentHabitId);

  const pillarAccuracy = useMemo(() => {
      const stats: Record<string, { total: number, done: number }> = {};
      habits.forEach(h => {
          if (!stats[h.pillar]) stats[h.pillar] = { total: 0, done: 0 };
          stats[h.pillar].total++;
          const habitLogs = logs.filter(l => l.habitId === h.id && l.count >= h.goal);
          stats[h.pillar].done += habitLogs.length;
      });
      return stats;
  }, [habits, logs]);

  const getStreak = (habitId: string) => {
     let streak = 0;
     const habit = habits.find(h => h.id === habitId);
     const habitLogs = logs
        .filter(l => l.habitId === habitId && habit && l.count >= habit.goal)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
     
     if (habitLogs.length === 0) return 0;
     
     const todayLog = habitLogs.find(l => l.date === today);
     const yesterday = new Date();
     yesterday.setDate(yesterday.getDate() - 1);
     const yesterdayStr = yesterday.toISOString().split('T')[0];
     const yesterdayLog = habitLogs.find(l => l.date === yesterdayStr);

     if (!todayLog && !yesterdayLog) return 0; 
     
     let currentDate = new Date();
     if (!todayLog) currentDate.setDate(currentDate.getDate() - 1);

     while (true) {
         const dateStr = currentDate.toISOString().split('T')[0];
         if (habitLogs.some(l => l.date === dateStr)) {
             streak++;
             currentDate.setDate(currentDate.getDate() - 1);
         } else {
             break;
         }
     }
     return streak;
  };

  const renderToday = () => {
    const activeHabits = habits.filter(h => !h.archived);
    const completedCount = activeHabits.filter(h => {
        const log = logs.find(l => l.habitId === h.id && l.date === today);
        return log && log.count >= h.goal;
    }).length;
    const totalHabits = activeHabits.length;
    const progress = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString('id-ID', dateOptions);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header className="flex items-center justify-between">
            <div>
                 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{dateStr}</div>
                 <h2 className="text-3xl md:text-4xl font-bold serif italic text-zinc-900 dark:text-zinc-100">
                     Halo, {userProfile?.name?.split(' ')[0] || 'Friend'}.
                 </h2>
            </div>
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${progress === 100 ? 'border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-zinc-200 dark:border-zinc-700 text-zinc-400'}`}>
                {progress}%
            </div>
        </header>

        {/* Hero Progress Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-8 shadow-2xl transition-transform hover:scale-[1.01] active:scale-[0.99]">
             <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
             <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold serif italic opacity-90">Daily Focus</h3>
                        <p className="text-sm opacity-60 mt-1">Konsistensi adalah kunci.</p>
                    </div>
                    {progress === 100 && <Trophy size={24} className="text-yellow-400 animate-bounce" />}
                 </div>
                 
                 <div className="flex items-end gap-2">
                     <span className="text-5xl font-bold serif italic tabular-nums">{completedCount}</span>
                     <span className="text-xl opacity-50 mb-1">/ {totalHabits} habits</span>
                 </div>
                 
                 <div className="w-full bg-white/20 dark:bg-black/10 h-2 rounded-full overflow-hidden">
                     <div className="h-full bg-white dark:bg-zinc-900 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                 </div>
             </div>
        </div>

        <HabitHeatmap logs={logs} />

        <div className="grid grid-cols-1 gap-4 pb-20">
            {activeHabits.length > 0 ? activeHabits.map(habit => {
                const log = logs.find(l => l.habitId === habit.id && l.date === today);
                const currentCount = log?.count || 0;
                const isDone = currentCount >= habit.goal;
                const streak = getStreak(habit.id);

                return (
                    <div 
                        key={habit.id} 
                        className={`glass p-6 rounded-[2.5rem] flex items-center justify-between transition-all group relative overflow-hidden ${isDone ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40' : 'hover:bg-white/50 dark:hover:bg-zinc-800/50'}`}
                    >
                        <div className="flex items-center gap-5 z-10">
                            <div 
                                onClick={() => onToggleLog(habit.id, today)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-pointer transition-all shadow-sm ${isDone ? 'bg-emerald-500 text-white rotate-6 scale-110' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 grayscale group-hover:grayscale-0'}`}
                            >
                                {PILLARS[habit.pillar as keyof typeof PILLARS]?.icon || '✨'}
                            </div>
                            <div>
                                <h3 className={`text-lg md:text-xl font-bold serif italic transition-all ${isDone ? 'text-emerald-800 dark:text-emerald-400 opacity-60' : 'text-zinc-800 dark:text-zinc-200'}`}>{habit.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{habit.pillar}</span>
                                    {streak > 1 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 animate-pulse">
                                            <Flame size={12} fill="currentColor" /> {streak} day streak
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Numeric Tracker or Toggle */}
                        <div className="flex items-center gap-3 z-10">
                            {habit.goal > 1 ? (
                                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 border border-zinc-200 dark:border-zinc-700">
                                    <button 
                                        onClick={() => onUpdateLog(habit.id, today, Math.max(0, currentCount - 1))}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <div className="px-3 min-w-[3rem] text-center font-bold text-sm tabular-nums">
                                        <span className={isDone ? 'text-emerald-500' : ''}>{currentCount}</span>
                                        <span className="text-[10px] opacity-30 mx-1">/</span>
                                        <span className="text-[10px] opacity-50">{habit.goal}</span>
                                    </div>
                                    <button 
                                        onClick={() => onUpdateLog(habit.id, today, currentCount + 1)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-emerald-500 transition-colors"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => onToggleLog(habit.id, today)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${isDone ? 'text-emerald-500 scale-125' : 'text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-400'}`}
                                >
                                    {isDone ? <CheckCircle2 size={36} fill="currentColor" className="text-emerald-100 dark:text-emerald-900" /> : <Circle size={36} strokeWidth={1} />}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }) : (
                <div onClick={() => setActiveTab('habits')} className="py-20 text-center glass rounded-[3rem] opacity-30 italic serif text-2xl cursor-pointer hover:opacity-50 transition-opacity flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                        <Plus size={24} />
                    </div>
                    <div>
                        Belum ada habit aktif.<br/>Tambahkan di tab Habits.
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  };

  const renderManage = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-4xl md:text-5xl font-bold serif italic text-zinc-900 dark:text-zinc-100">Daftar Habit</h2>
                    <p className="text-zinc-500 italic serif text-xl opacity-60">Kelola rutinitasmu.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="w-14 h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                    <Plus size={24} />
                </button>
            </header>

            <div className="space-y-4 pb-20">
                {habits.length > 0 ? habits.map(habit => (
                    <div key={habit.id} className="glass p-6 rounded-[2.5rem] flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xl">
                                {PILLARS[habit.pillar as keyof typeof PILLARS]?.icon || '✨'}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold serif text-zinc-800 dark:text-zinc-200">{habit.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{habit.pillar}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-200" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Goal: {habit.goal}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => setEditingHabit(habit)}
                                className="p-3 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => {
                                    if(confirm("Archive this habit?")) onDeleteHabit(habit.id);
                                }} 
                                className="p-3 text-zinc-300 hover:text-rose-500 transition-colors"
                            >
                                <Plus size={18} className="rotate-45" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center glass rounded-[3rem] opacity-30 italic serif text-2xl">
                        Mulai langkah pertamamu.
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderInsights = () => {
    const totalLogs = logs.length;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-bold serif italic text-zinc-900 dark:text-zinc-100">Statistik</h2>
                <p className="text-zinc-500 italic serif text-xl opacity-60">Cermin perjalananmu.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                <div className="glass p-10 rounded-[3rem] space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Total Check-ins</h4>
                        <Star size={16} className="text-amber-500" />
                    </div>
                    <div className="text-6xl font-bold serif italic text-zinc-900 dark:text-zinc-100">{totalLogs}</div>
                    <p className="text-sm text-zinc-500 serif italic">Kegiatan tercatat.</p>
                </div>

                <div className="bg-zinc-900 dark:bg-zinc-100 p-10 rounded-[3rem] text-white dark:text-zinc-900 space-y-4 shadow-2xl">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Top Performer</h4>
                    <div className="text-3xl font-bold serif italic leading-tight">
                        {favoriteHabit ? `"${favoriteHabit.name}" adalah prioritas utamamu.` : "Tentukan fokusmu."}
                    </div>
                    {favoriteHabit && <p className="text-xs opacity-60">Paling sering kamu lakukan.</p>}
                </div>

                <div className="md:col-span-2 glass p-10 rounded-[3rem] space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Pillar Consistency</h4>
                    <div className="space-y-6">
                        {Object.entries(pillarAccuracy).map(([pillar, data]) => (
                            <div key={pillar} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold serif italic text-zinc-700 dark:text-zinc-300 capitalize">{pillar}</span>
                                    <span className="text-[10px] font-bold text-zinc-400">{data.done} check-ins</span>
                                </div>
                                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000" 
                                        style={{ width: `${Math.min(100, (data.done / (totalLogs || 1)) * 200)}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderSettings = () => {
    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-bold serif italic text-zinc-900 dark:text-zinc-100">Pengaturan</h2>
                <p className="text-zinc-500 italic serif text-xl opacity-60">Sesuaikan kenyamananmu.</p>
            </header>

            <div className="space-y-6 pb-20">
                <div className="glass p-8 rounded-[2.5rem] space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Tampilan</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Tema Aplikasi</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1">
                            {['light', 'dark'].map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => onUpdatePreferences({ theme: theme as any })}
                                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${userPreferences?.theme === theme ? 'bg-white dark:bg-zinc-700 shadow-md text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-[2.5rem] space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Preferensi</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Awal Minggu</span>
                        <select 
                            value={userPreferences?.weekStart || 'monday'}
                            onChange={(e) => onUpdatePreferences({ weekStart: e.target.value })}
                            className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="monday">Senin</option>
                            <option value="sunday">Minggu</option>
                        </select>
                    </div>
                     <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Heatmap Dashboard</span>
                        <button 
                            onClick={() => onUpdatePreferences({ dashboardShowHeatmap: !userPreferences?.dashboardShowHeatmap })}
                            className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${userPreferences?.dashboardShowHeatmap ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${userPreferences?.dashboardShowHeatmap ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="p-8 text-center space-y-2 opacity-40">
                    <p className="text-xs font-bold uppercase tracking-widest">Oneself Habit Tracker</p>
                    <p className="serif italic">v1.2.5 • Consistency over perfection.</p>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="relative min-h-screen px-6 max-w-2xl mx-auto pt-10">
      <Link href="/" className="absolute top-10 left-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors z-[80]">
        <ArrowLeft size={20} />
      </Link>
      
      <div className="h-10" />

      <main className="mb-24">
        {activeTab === 'today' && renderToday()}
        {activeTab === 'habits' && renderManage()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'settings' && renderSettings()}
      </main>

      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-[90]">
        <div className="glass shadow-2xl rounded-full p-2 flex justify-between items-center border border-white/20 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-xl">
            {[
                { id: 'today', icon: Calendar, label: 'Today' },
                { id: 'habits', icon: List, label: 'Habits' },
                { id: 'insights', icon: BarChart3, label: 'Stats' },
                { id: 'settings', icon: Settings, label: 'Config' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center flex-1 py-3 rounded-full transition-all gap-1 ${activeTab === tab.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl scale-110' : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
                >
                    <tab.icon size={18} />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
                </button>
            ))}
        </div>
      </nav>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingHabit) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xl" onClick={() => { setIsAddModalOpen(false); setEditingHabit(null); }} />
              <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[3.5rem] p-10 relative z-10 animate-in zoom-in-95 duration-500 shadow-2xl border border-white/10">
                  <header className="mb-10 text-center">
                    <h3 className="text-3xl font-bold serif italic">{editingHabit ? 'Ubah Habit' : 'Habit Baru'}</h3>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2">{editingHabit ? 'Sesuaikan rutinitasmu' : 'Niatkan langkahmu'}</p>
                  </header>
                  <form className="space-y-8" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const habitData = {
                          name: formData.get('name'),
                          pillar: formData.get('pillar'),
                          frequency: 'daily',
                          goal: parseInt(formData.get('goal') as string) || 1,
                          archived: false
                      };
                      if (editingHabit) {
                          onUpdateHabit(editingHabit.id, habitData);
                      } else {
                          onAddHabit(habitData);
                      }
                      setIsAddModalOpen(false);
                      setEditingHabit(null);
                  }}>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest px-2">Nama Habit</label>
                        <input name="name" defaultValue={editingHabit?.name} autoFocus placeholder="Minum air putih..." className="w-full text-2xl serif italic bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[2rem] outline-none border-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-zinc-100" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest px-2">Pillar</label>
                            <select name="pillar" defaultValue={editingHabit?.pillar} className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[2rem] text-sm font-bold outline-none border-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-zinc-100">
                                {Object.keys(PILLARS).map(p => (
                                    <option key={p} value={p}>{PILLARS[p as keyof typeof PILLARS].label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest px-2">Daily Goal</label>
                            <input name="goal" type="number" min="1" defaultValue={editingHabit?.goal || 1} className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[2rem] text-sm font-bold outline-none border-none focus:ring-2 focus:ring-emerald-500/20 transition-all dark:text-zinc-100" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                          {editingHabit ? 'Perbarui Niat' : 'Simpan Niat'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
