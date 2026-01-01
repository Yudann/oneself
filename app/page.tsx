
'use client';

import React, { useMemo } from 'react';
import { useStore } from '@/lib/store-provider';
import { LifePillarsWrap } from '@/components/LifePillarsWrap';
import { Heatmap } from '@/components/Heatmap';
import { InsightCard } from '@/components/InsightCard';
import { DatabaseTable } from '@/components/DatabaseTable';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { state, setPage, deleteActivity, updateActivity } = useStore();

  const dashboardInsights = useMemo(() => {
    const last7Days = state.activities.filter(a => (new Date().getTime() - new Date(a.date).getTime()) < (7 * 24 * 60 * 60 * 1000));
    const workMins = last7Days.filter(a => a.category === 'Work' || a.category === 'Focus').reduce((s, a) => s + a.duration, 0);
    const restMins = last7Days.filter(a => a.category === 'Rest').reduce((s, a) => s + a.duration, 0);
    const healthMins = last7Days.filter(a => a.category === 'Health').reduce((s, a) => s + a.duration, 0);
    const socialMins = last7Days.filter(a => a.category === 'Social').reduce((s, a) => s + a.duration, 0);

    const insights = [];
    let recommendation = { title: "Small Step", text: "Log your first activity to see your rhythm." };

    if (state.activities.length === 0) {
      insights.push({ title: "Welcome Home", text: "Ambil nafas dalam-dalam. Hari ini kita mulai dengan perlahan.", type: "neutral" });
    } else if (workMins > (restMins + socialMins + healthMins) * 1.5) {
      insights.push({ title: "Mode Fokus Tinggi", text: "Kamu sangat produktif di Karir belakangan ini. Tapi ingat, mesin pun butuh waktu untuk dingin.", type: "suggestion" });
      recommendation = { title: "Rest Recommendation", text: "Coba 'Digital Detox' selama 1 jam sore ini. Tanpa layar, hanya kamu dan segelas teh." };
    } else if (socialMins === 0 && last7Days.length > 3) {
      insights.push({ title: "Ruang Sosial", text: "Sepertinya kamu sedang asyik sendiri. Jangan lupa sapa orang tersayang, walau hanya lewat pesan singkat.", type: "suggestion" });
      recommendation = { title: "Relationship Goal", text: "Kirim pesan 'apa kabar' ke satu teman atau anggota keluarga hari ini." };
    } else {
      insights.push({ title: "Ritme Seimbang", text: "Energi kamu terdistribusi dengan baik minggu ini. Pertahankan kesadaran ini.", type: "positive" });
      recommendation = { title: "Growth Focus", text: "Lanjutkan kebiasaan baikmu. Bagaimana kalau membaca 5 halaman buku malam ini?" };
    }

    return { insights, recommendation };
  }, [state.activities]);

  return (
    <div className="max-w-5xl mx-auto py-12 md:py-20 px-6 md:px-10 space-y-16 animate-in fade-in duration-700">
      {/* Header section with human tone */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2.2rem] flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-2xl transition-transform hover:scale-105" style={{ backgroundColor: state.userProfile.avatarColor }}>{state.userProfile.name.charAt(0)}</div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold serif text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">Tenang, {state.userProfile.name.split(' ')[0]}.</h1>
            <p className="text-zinc-500 dark:text-zinc-500 text-lg md:text-xl italic serif leading-relaxed">Kamu tidak harus menjadi segalanya hari ini.</p>
          </div>
        </div>
        <div className="hidden lg:block text-right">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 mb-1 text-xs">Weekly Pulse</div>
          <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 tabular-nums">Week {Math.ceil(new Date().getDate() / 7)} of {new Date().toLocaleString('default', { month: 'long' })}</div>
        </div>
      </header>

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

      {/* MIDDLE SECTION: Insights & Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 px-1">Refleksi Sejenak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardInsights.insights.map((insight, idx) => (
              <InsightCard key={idx} title={insight.title} description={insight.text} type={insight.type as any} />
            ))}
            {/* Fallback insight if empty */}
            {dashboardInsights.insights.length < 2 && (
              <InsightCard title="Daily Rhythm" description="Focus is a muscle. Consistency is its fuel." type="neutral" />
            )}
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 dark:bg-zinc-100 p-8 rounded-[2.5rem] text-white dark:text-zinc-900 shadow-xl space-y-4 transition-all hover:translate-y-[-4px] h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Fokus Minggu Ini</span>
            </div>
            <h3 className="text-xl serif italic font-medium leading-snug">{dashboardInsights.recommendation.title}</h3>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm leading-relaxed serif italic text-lg">"{dashboardInsights.recommendation.text}"</p>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: Archive Table */}
      <section className="space-y-4 pt-6">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-1">Arsip Terkini</h2>
            <h3 className="text-2xl serif italic text-zinc-800 dark:text-zinc-200">Timeline</h3>
          </div>
          <Link href="/calendar" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-2 group">Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></Link>
        </div>
        <div className="bg-white dark:bg-zinc-900/20 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <DatabaseTable activities={state.activities.slice(0, 5)} onDelete={deleteActivity} onUpdate={updateActivity} />
        </div>
      </section>
    </div>
  );
}
