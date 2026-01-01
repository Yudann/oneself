
import { Activity } from '../lib/types';
import { useMemo } from 'react';

interface InsightCardProps {
  title?: string;
  description?: string;
  type?: 'positive' | 'neutral' | 'suggestion';
  activities?: Activity[];
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, description, type, activities }) => {
  const dashboardInsight = useMemo(() => {
    if (!activities) return null;
    
    const last7Days = activities.filter(a => (new Date().getTime() - new Date(a.date).getTime()) < (7 * 24 * 60 * 60 * 1000));
    const workMins = last7Days.filter(a => a.category === 'Work' || a.category === 'Focus').reduce((s, a) => s + a.duration, 0);
    const restMins = last7Days.filter(a => a.category === 'Rest').reduce((s, a) => s + a.duration, 0);
    const healthMins = last7Days.filter(a => a.category === 'Health').reduce((s, a) => s + a.duration, 0);
    const socialMins = last7Days.filter(a => a.category === 'Social').reduce((s, a) => s + a.duration, 0);

    if (activities.length === 0) {
      return { title: "Welcome Home", text: "Ambil nafas dalam-dalam. Hari ini kita mulai dengan perlahan.", type: "neutral" as const };
    } else if (workMins > (restMins + socialMins + healthMins) * 1.5) {
      return { title: "High Focus Mode", text: "You've been very productive lately. Remember to take a breather.", type: "suggestion" as const };
    } else if (socialMins === 0 && last7Days.length > 3) {
      return { title: "Social Space", text: "Looks like you're in your own world. Don't forget to reach out to loved ones.", type: "suggestion" as const };
    } else {
      return { title: "Balanced Rhythm", text: "Your energy is well-distributed this week. Keep up the awareness.", type: "positive" as const };
    }
  }, [activities]);

  const displayTitle = title || dashboardInsight?.title || 'Insight';
  const displayDescription = description || dashboardInsight?.text || 'Mulai hari dengan tenang.';
  const displayType = type || dashboardInsight?.type || 'neutral';
  const styles = {
    positive: 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40',
    neutral: 'bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-300 border-zinc-100 dark:border-zinc-800',
    suggestion: 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-900/40'
  };

  return (
    <div className={`p-6 rounded-[2rem] border ${styles[displayType as keyof typeof styles]} shadow-sm transition-colors`}>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 opacity-60">{displayTitle}</h4>
      <p className="text-lg leading-relaxed serif italic">{displayDescription}</p>
    </div>
  );
};
