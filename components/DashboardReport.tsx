import React, { useMemo } from 'react';
import { Habit, HabitLog, Activity } from '../lib/types';
import { Trophy, Zap, Heart, Brain, Coffee } from 'lucide-react';

interface DashboardReportProps {
  activities: Activity[];
  habits: Habit[];
  logs: HabitLog[];
}

export const DashboardReport: React.FC<DashboardReportProps> = ({ activities, habits, logs }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Completion Rate Today
    const activeHabits = habits.filter(h => !h.archived);
    const completedToday = activeHabits.filter(h => logs.some(l => l.habitId === h.id && l.date === today)).length;
    const habitScore = activeHabits.length > 0 ? (completedToday / activeHabits.length) * 100 : 0;

    // 2. Effort Score (Activity volume)
    const effortSum = activities
        .filter(a => a.date.startsWith(today))
        .reduce((sum, a) => sum + (a.intensity === 'high' ? 30 : a.intensity === 'medium' ? 20 : 10), 0);
    const effortScore = Math.min(effortSum, 100);

    // 3. Harmony Score (Combination)
    const harmonyScore = Math.round((habitScore + effortScore) / 2);

    return { harmonyScore, habitScore, effortScore, completedToday, totalHabits: activeHabits.length };
  }, [activities, habits, logs]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        {/* Harmony Score - Large Card */}
        <div className="md:col-span-2 relative overflow-hidden bg-zinc-900 dark:bg-zinc-100 rounded-[3rem] p-10 text-white dark:text-zinc-900 shadow-2xl flex flex-col justify-between min-h-[320px]">
            <div className="absolute top-0 right-0 p-40 bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex justify-between items-start">
               <div>
                   <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-2">harmony report</h2>
                   <div className="serif italic text-4xl font-bold">Today's Pulse</div>
               </div>
               <div className="w-16 h-16 rounded-3xl bg-white/10 dark:bg-black/5 flex items-center justify-center backdrop-blur-md">
                   <Zap size={28} className="text-emerald-400" />
               </div>
            </div>

            <div className="relative z-10 flex items-end gap-10">
                <div className="flex flex-col">
                    <span className="text-8xl font-bold serif tabular-nums tracking-tighter">{stats.harmonyScore}<span className="text-2xl opacity-30 ml-2">%</span></span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">Consistency Index</span>
                </div>
                
                <div className="flex-1 space-y-4 max-w-[200px] mb-4 hidden sm:block">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
                            <span>Habits</span>
                            <span>{Math.round(stats.habitScore)}%</span>
                        </div>
                        <div className="h-1 bg-white/10 dark:bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.habitScore}%` }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider opacity-60">
                            <span>Effort</span>
                            <span>{Math.round(stats.effortScore)}%</span>
                        </div>
                        <div className="h-1 bg-white/10 dark:bg-black/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 transition-all duration-1000" style={{ width: `${stats.effortScore}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Stats - Sidebar of the report */}
        <div className="space-y-6">
            <div className="glass p-8 rounded-[2.5rem] flex flex-col justify-center h-full gap-4">
                <div className="flex items-center gap-4 text-zinc-400">
                    <Trophy size={20} className="text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Achievements</span>
                </div>
                <div className="serif italic text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                    {stats.habitScore === 100 ? "Level: Master of Focus" : stats.harmonyScore > 70 ? "Level: Mindful Warrior" : "Level: Quiet Explorer"}
                </div>
                <p className="text-xs text-zinc-500 serif italic opacity-60">
                    {stats.habitScore === 100 ? "Anda telah menaklukkan semua niat hari ini." : "Pertahankan ritme kecilmu."}
                </p>
            </div>
        </div>
    </div>
  );
};
