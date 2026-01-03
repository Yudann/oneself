import React, { useMemo, useState } from 'react';
import { HabitLog } from '../../lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HabitHeatmapProps {
  logs: HabitLog[];
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ logs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Adjust startDayOfWeek to make Monday the first day (0: Mon, 6: Sun)
    // Formula: (startDayOfWeek + 6) % 7
    const adjustedStartDay = (startDayOfWeek + 6) % 7;

    const map: Record<string, number> = {};
    logs.forEach(l => {
      map[l.date] = (map[l.date] || 0) + 1;
    });

    const days = [];
    // Pad for start of month
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(null);
    }
    
    // Real days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        day: i,
        dateStr,
        value: map[dateStr] || 0
      });
    }

    return {
      days,
      monthName: currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    };
  }, [logs, currentDate]);

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getIntensityColor = (value: number) => {
    if (value === 0) return 'bg-zinc-100 dark:bg-zinc-800/50';
    if (value >= 5) return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    if (value >= 3) return 'bg-emerald-400';
    if (value >= 2) return 'bg-emerald-300';
    return 'bg-emerald-200 dark:bg-emerald-500/30';
  };

  const dayLabels = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

  return (
    <div className="glass p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col transition-all group">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] mb-1">Consistency</h3>
            <span className="serif italic text-lg font-bold text-zinc-800 dark:text-zinc-200">{monthData.monthName}</span>
          </div>
          <div className="flex gap-2">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
          </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 px-1">
        {dayLabels.map((l, i) => (
          <div key={i} className="text-[8px] font-bold text-zinc-300 dark:text-zinc-600 text-center uppercase">
            {l}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {monthData.days.map((d, i) => (
          <div
            key={i}
            title={d ? `${d.dateStr}: ${d.value} habits` : ''}
            className={`
              aspect-square rounded-lg transition-all duration-300 
              ${d ? getIntensityColor(d.value) : 'bg-transparent'}
              ${d ? 'hover:scale-110 cursor-default hover:z-10' : ''}
              flex items-center justify-center relative
            `}
          >
            {d && (
              <span className="text-[8px] absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-20 pointer-events-none font-bold">
                {d.day}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 px-1">
        <div className="flex gap-1 items-center">
            <span className="text-[8px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest mr-1">Intensity</span>
            {[0, 2, 5].map(v => (
                <div key={v} className={`w-2 h-2 rounded-full ${getIntensityColor(v)}`} />
            ))}
        </div>
        <div className="text-[9px] italic serif text-zinc-400 opacity-60">
            {logs.filter(l => l.date.startsWith(currentDate.toISOString().slice(0, 7))).length} logs this month
        </div>
      </div>
    </div>
  );
};
