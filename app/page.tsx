'use client';

import React, { useMemo } from 'react';
import { useStore } from '@/lib/store-provider';
import { LifePillarsWrap } from '@/components/LifePillarsWrap';
import { Heatmap } from '@/components/Heatmap';
import { InsightCard } from '@/components/InsightCard';
import { DatabaseTable } from '@/components/DatabaseTable';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { HabitDashboardWidget } from '@/components/habit-tracker/HabitDashboardWidget';
import { MoneyDashboardWidget } from '@/components/money-tracker/MoneyDashboardWidget';
import { useRouter } from 'next/navigation';
import { DashboardReport } from '@/components/DashboardReport';

export default function DashboardPage() {
  const { state, setPage, deleteActivity, updateActivity } = useStore();
  const router = useRouter();

  const dashboardInsights = useMemo(() => {
    // Including habits in insights analysis
    const last7DaysAct = state.activities.filter(a => (new Date().getTime() - new Date(a.date).getTime()) < (7 * 24 * 60 * 60 * 1000));
    const last7DaysLogs = state.habitLogs.filter(l => (new Date().getTime() - new Date(l.date).getTime()) < (7 * 24 * 60 * 60 * 1000));
    
    const workMins = last7DaysAct.filter(a => a.category === 'Work' || a.category === 'Focus').reduce((s, a) => s + a.duration, 0);
    const restMins = last7DaysAct.filter(a => a.category === 'Rest').reduce((s, a) => s + a.duration, 0);

    const insights = [];
    let recommendation = { title: "Small Step", text: "Log your first activity to see your rhythm." };

    if (state.activities.length === 0 && state.habits.length === 0) {
      insights.push({ title: "Welcome Home", text: "Ambil nafas dalam-dalam. Hari ini kita mulai dengan perlahan.", type: "neutral" });
    } else if (last7DaysLogs.length > 10) {
      insights.push({ title: "Momentum!", text: "Konsistensi habit kamu sedang di puncaknya. Momentum ini adalah asetmu.", type: "positive" });
      recommendation = { title: "Expand Horizon", text: "Bagaimana jika mencoba habit baru atau menaikkan level yang sudah ada?" };
    } else if (workMins > (restMins * 2)) {
      insights.push({ title: "Mode Fokus Tinggi", text: "Kamu sangat produktif di Karir belakangan ini. Tapi ingat, mesin pun butuh waktu untuk dingin.", type: "suggestion" });
      recommendation = { title: "Rest Recommendation", text: "Coba 'Digital Detox' selama 1 jam sore ini. Tanpa layar, hanya kamu dan segelas teh." };
    } else {
      insights.push({ title: "Ritme Seimbang", text: "Energi kamu terdistribusi dengan baik minggu ini. Pertahankan kesadaran ini.", type: "positive" });
      recommendation = { title: "Growth Focus", text: "Lanjutkan kebiasaan baikmu. Bagaimana kalau membaca 5 halaman buku malam ini?" };
    }

    return { insights, recommendation };
  }, [state.activities, state.habitLogs]);

  return (
    <div className="max-w-5xl mx-auto py-12 md:py-20 px-6 md:px-10 space-y-16 animate-in fade-in duration-700">
      {/* Header section with human tone */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2.2rem] flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-2xl transition-transform hover:scale-105" style={{ backgroundColor: state.userProfile.avatarColor }}>{state.userProfile.name.charAt(0)}</div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold serif text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Tenang, {state.userProfile.name.split(' ')[0]}.</h1>
            <p className="text-zinc-500 dark:text-zinc-500 text-lg md:text-xl italic serif leading-relaxed">Analisis ritme hidupmu hari ini.</p>
          </div>
        </div>
        <div className="hidden lg:block text-right">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 mb-1 text-xs px-2">Weekly Pulse</div>
          <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tabular-nums bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-full">Week {Math.ceil(new Date().getDate() / 7)} of {new Date().toLocaleString('default', { month: 'long' })}</div>
        </div>
      </header>

      {/* NEW: Integrated Harmony Report */}
      <DashboardReport 
        activities={state.activities} 
        habits={state.habits} 
        logs={state.habitLogs} 
      />

      {/* TOP SECTION: Pillars & Heatmap side-by-side */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1">Keseimbangan Hidup</h2>
          <div className="h-full">
            <LifePillarsWrap activities={state.activities} />
          </div>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1">Konsistensi Energi</h2>
          <div className="h-full">
            <Heatmap activities={state.activities} />
          </div>
        </div>
      </section>

      {/* MIDDLE SECTION: Insights, Habits & Money */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1">Refleksi Sejenak</h2>
            <div className="flex flex-col gap-4">
                {dashboardInsights.insights.map((insight, idx) => (
                    <InsightCard key={idx} title={insight.title} description={insight.text} type={insight.type as any} />
                ))}
                {dashboardInsights.insights.length < 2 && (
                    <InsightCard title="Daily Rhythm" description="Satu langkah kecil lebih baik daripada seribu rencana." type="neutral" />
                )}
            </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
           <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1">Habit tracker</h2>
           <HabitDashboardWidget 
              habits={state.habits} 
              logs={state.habitLogs} 
              onNavigate={() => router.push('/habits')} 
           />
        </div>
        <div className="lg:col-span-4 space-y-4">
           <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1">Money Tracker</h2>
           <MoneyDashboardWidget 
              transactions={state.transactions} 
              onNavigate={() => router.push('/money')} 
           />
        </div>
      </section>

      {/* BOTTOM SECTION: Archive Table */}
      <section className="space-y-4 pt-6">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-1">Timeline Terkini</h2>
            <h3 className="text-2xl serif italic text-zinc-800 dark:text-zinc-200">Arsip Historis</h3>
          </div>
          <Link href="/calendar" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group">Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="bg-white dark:bg-zinc-900/20 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
          <DatabaseTable activities={state.activities.slice(0, 8)} onDelete={deleteActivity} onUpdate={updateActivity} />
        </div>
      </section>
    </div>
  );
}
