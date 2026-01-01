
import React from 'react';
import { Activity } from '../lib/types';
import { PILLARS } from '../lib/constants';

interface LifePillarsWrapProps {
  activities: Activity[];
}

export const LifePillarsWrap: React.FC<LifePillarsWrapProps> = ({ activities }) => {
  // Get data for last 7 days for weekly wrap
  const last7Days = activities.filter(a => {
    const date = new Date(a.date);
    const now = new Date();
    return (now.getTime() - date.getTime()) < (7 * 24 * 60 * 60 * 1000);
  });

  const pillarStats = Object.entries(PILLARS).map(([key, pillar]) => {
    const minutes = last7Days
      .filter(a => pillar.categories.includes(a.category))
      .reduce((sum, a) => sum + a.duration, 0);
    return { ...pillar, minutes };
  });

  const totalMinutes = pillarStats.reduce((sum, p) => sum + p.minutes, 0) || 1;

  return (
    <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Visual Donut */}
        <div className="relative w-44 h-44 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-zinc-100 dark:text-zinc-800" />
            {pillarStats.reduce((acc, pillar, idx) => {
              const percentage = (pillar.minutes / totalMinutes) * 100;
              const offset = acc.currentOffset;
              acc.elements.push(
                <circle
                  key={idx}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="transparent"
                  stroke={pillar.color}
                  strokeWidth="3.2"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-1000 ease-out"
                />
              );
              acc.currentOffset += percentage;
              return acc;
            }, { elements: [] as any[], currentOffset: 0 }).elements}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold serif text-zinc-900 dark:text-zinc-100">{(totalMinutes / 60).toFixed(1)}h</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">7 days logged</span>
          </div>
        </div>

        {/* Pillars List */}
        <div className="flex-1 w-full space-y-4">
          {pillarStats.map((p, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span className="text-sm">{p.icon}</span> {p.label}
                </span>
                <span className="text-zinc-800 dark:text-zinc-200">{Math.round((p.minutes / totalMinutes) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ backgroundColor: p.color, width: `${(p.minutes / totalMinutes) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
