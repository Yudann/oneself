
'use client';

import React, { useMemo } from 'react';
import { useStore } from '@/lib/store-provider';
import { InsightCard } from '@/components/InsightCard';

export default function InsightsPage() {
  const { state } = useStore();

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
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-12 transition-colors">
      <header><h1 className="text-3xl md:text-4xl font-bold serif text-zinc-900 dark:text-zinc-100 mb-2">Gentle Insights</h1><p className="text-zinc-500 dark:text-zinc-500 italic serif">Soft reflections on your week.</p></header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard title={dashboardInsights.insights[0]?.title || "Flow"} description={dashboardInsights.insights[0]?.text || "Mulai hari dengan tenang."} type="neutral" />
        <InsightCard title="Daily Focus" description="Consistency is forming in your habits." type="positive" />
      </div>
      <div className="p-8 md:p-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[3rem] text-center space-y-6 shadow-2xl transition-colors">
        <h3 className="text-2xl md:text-3xl serif italic leading-snug">"Balance is not something you find, it's something you create."</h3>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium tracking-widest uppercase">— Jana Kingsford</p>
      </div>
    </div>
  );
}
