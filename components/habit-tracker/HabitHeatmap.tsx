import React, { useMemo } from 'react';
import { HabitLog } from '../../lib/types';

interface HabitHeatmapProps {
  logs: HabitLog[];
  days?: number;
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ logs, days = 70 }) => {
  const today = new Date();
  
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    logs.forEach(l => {
      const dateStr = l.date;
      map[dateStr] = (map[dateStr] || 0) + 1;
    });
    return map;
  }, [logs]);

  const squares = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const value = data[dateStr] || 0;
    
    let color = 'bg-zinc-100 dark:bg-zinc-800/50';
    if (value >= 5) color = 'bg-emerald-500';
    else if (value >= 3) color = 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]';
    else if (value >= 2) color = 'bg-emerald-300';
    else if (value >= 1) color = 'bg-emerald-200 dark:bg-emerald-500/40';

    return { dateStr, value, color };
  });

  return (
    <div className="glass p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col transition-all hover:bg-white/60 dark:hover:bg-zinc-800/40 translate-z-0">
      <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Habit Consistency</h3>
          <div className="flex gap-1">
              {[0, 1, 2, 3].map(v => (
                  <div key={v} className={`w-1.5 h-1.5 rounded-full ${v === 0 ? 'bg-zinc-100 dark:bg-zinc-800' : v === 1 ? 'bg-emerald-200' : v === 2 ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
              ))}
          </div>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {squares.map((s, i) => (
          <div
            key={i}
            title={`${s.dateStr}: ${s.value} habits completed`}
            className={`w-[11.5px] h-[11.5px] rounded-[3px] ${s.color} transition-all cursor-default flex-shrink-0 hover:scale-125 hover:z-10`}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4 px-1 text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] font-medium italic serif">
        <span>{squares[0].dateStr.split('-').slice(1).reverse().join('/')}</span>
        <span>Today</span>
      </div>
    </div>
  );
};
