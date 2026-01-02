import React from 'react';
import { Habit, HabitLog } from '../../lib/types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HabitDashboardWidgetProps {
  habits: Habit[];
  logs: HabitLog[];
  onNavigate: () => void;
}

export const HabitDashboardWidget: React.FC<HabitDashboardWidgetProps> = ({ habits, logs, onNavigate }) => {
  const today = new Date().toISOString().split('T')[0];
  const activeHabits = habits.filter(h => !h.archived);
  const completedToday = activeHabits.filter(h => logs.some(l => l.habitId === h.id && l.date === today)).length;
  const total = activeHabits.length;

  return (
    <div 
        onClick={onNavigate}
        className="glass p-8 rounded-[2.5rem] flex items-center justify-between cursor-pointer group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all border border-emerald-500/10 h-full"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-[1.8rem] flex items-center justify-center text-emerald-500 shadow-inner">
            <CheckCircle2 size={28} />
        </div>
        <div>
            <h3 className="text-2xl font-bold serif italic text-zinc-800 dark:text-zinc-100">Daily Habits</h3>
            <p className="text-zinc-500 text-sm font-medium">{completedToday} dari {total} habit selesai hari ini.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">Consistency</div>
            <div className="text-lg font-bold tabular-nums text-emerald-500">{total > 0 ? Math.round((completedToday / total) * 100) : 0}%</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all">
            <ArrowRight size={18} />
          </div>
      </div>
    </div>
  );
};
