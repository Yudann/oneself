
import React, { useMemo } from 'react';
import { Activity } from '../lib/types';

interface HeatmapProps {
  activities: Activity[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ activities }) => {
  const days = 100;
  const today = new Date();
  
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach(a => {
      const dateStr = a.date.split('T')[0];
      map[dateStr] = (map[dateStr] || 0) + (a.intensity === 'high' ? 3 : a.intensity === 'medium' ? 2 : 1);
    });
    return map;
  }, [activities]);

  const squares = Array.from({ length: days }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const value = data[dateStr] || 0;
    
    let color = 'bg-zinc-100 dark:bg-zinc-800/50';
    if (value > 6) color = 'bg-emerald-500';
    else if (value > 4) color = 'bg-emerald-400';
    else if (value > 2) color = 'bg-emerald-300';
    else if (value > 0) color = 'bg-emerald-200 dark:bg-emerald-500/40';

    return { dateStr, value, color };
  });

  return (
    <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col h-full transition-colors min-h-[280px]">
      <h3 className="text-[10px] font-bold mb-6 text-zinc-400 dark:text-zinc-600 px-1 uppercase tracking-[0.2em]">Energy Consistency</h3>
      
      <div className="flex-1 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex flex-wrap gap-1.5 min-w-[240px]">
          {squares.map((s, i) => (
            <div
              key={i}
              title={`${s.dateStr}: ${s.value} units of effort`}
              className={`w-4 h-4 rounded-sm ${s.color} hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-600 transition-all cursor-default flex-shrink-0`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-auto px-1 text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold">
        <span>{squares[0].dateStr.split('-').slice(1).join('/')}</span>
        <span>Today</span>
      </div>
    </div>
  );
};
