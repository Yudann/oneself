
import React from 'react';

interface InsightCardProps {
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'suggestion';
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, description, type }) => {
  const styles = {
    positive: 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40',
    neutral: 'bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800',
    suggestion: 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-900/40'
  };

  return (
    <div className={`p-6 rounded-[2rem] border ${styles[type]} shadow-sm transition-colors`}>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 opacity-60">{title}</h4>
      <p className="text-lg leading-relaxed serif italic">{description}</p>
    </div>
  );
};
