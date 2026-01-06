import React, { useState, useMemo } from 'react';
import { ArrowLeft, Send, Sparkles, MoreHorizontal, Calendar, Clock, Feather, Heart, Frown, Smile, Meh, Zap, Brain } from 'lucide-react';
import { Thought, UserProfile, ThoughtType, ThoughtMood } from '../../lib/types';
import Link from 'next/link';

// Simple heuristic for "AI" inference (MVP)
const inferThoughtMetadata = (content: string): { type: ThoughtType, mood: ThoughtMood } => {
    const lower = content.toLowerCase();
    
    let type: ThoughtType = 'reflection';
    let mood: ThoughtMood = 'neutral';

    if (lower.includes('grateful') || lower.includes('thank') || lower.includes('happy') || lower.includes('blessed')) {
        type = 'gratitude';
        mood = 'happy';
    } else if (lower.includes('sad') || lower.includes('tired') || lower.includes('overwhelmed') || lower.includes('hate') || lower.includes('angry')) {
        type = 'venting';
        mood = 'sad'; // or anxious
    } else if (lower.includes('should') || lower.includes('must') || lower.includes('remember') || lower.includes('goal')) {
        type = 'reminder';
        mood = 'neutral';
    } else if (lower.includes('can') || lower.includes('will') || lower.includes('strong') || lower.includes('better')) {
        type = 'motivation';
        mood = 'calm';
    }

    if (lower.includes('anxiety') || lower.includes('nervous') || lower.includes('scared')) mood = 'anxious';
    if (lower.includes('peace') || lower.includes('calm') || lower.includes('relax')) mood = 'calm';

    return { type, mood };
};

interface ThoughtsLayoutProps {
  thoughts: Thought[];
  userProfile?: UserProfile;
  onAddThought: (thought: any) => void;
  // onDeleteThought etc could be added
}

export const ThoughtsLayout: React.FC<ThoughtsLayoutProps> = ({
  thoughts,
  userProfile,
  onAddThought
}) => {
  const [newThought, setNewThought] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newThought.trim()) return;

      setIsPosting(true);
      
      // Simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 800));

      const { type, mood } = inferThoughtMetadata(newThought);

      onAddThought({
          content: newThought,
          type,
          mood,
          isDraft: false
      });

      setNewThought('');
      setIsPosting(false);
  };

  const sortedThoughts = useMemo(() => {
      return [...thoughts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [thoughts]);

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const dateStr = new Date().toLocaleDateString('id-ID', dateOptions);

  const getTypeColor = (type: ThoughtType) => {
      switch (type) {
          case 'reflection': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30';
          case 'gratitude': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30';
          case 'venting': return 'text-rose-500 bg-rose-50 dark:bg-rose-950/30';
          case 'motivation': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/30';
          case 'reminder': return 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800';
          default: return 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800';
      }
  };

  const getMoodIcon = (mood?: ThoughtMood) => {
      switch (mood) {
          case 'happy': return <Smile size={14} />;
          case 'sad': return <Frown size={14} />;
          case 'anxious': return <Zap size={14} />;
          case 'calm': return <Feather size={14} />;
          default: return <Meh size={14} />;
      }
  };

  return (
    <div className="relative min-h-screen px-6 max-w-2xl mx-auto pt-10 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <Link href="/" className="absolute top-10 left-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors z-[80]">
        <ArrowLeft size={20} />
      </Link>
      
      <div className="h-10" />

      <main className="mb-32 px-1 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
         <header className="flex items-center justify-between">
            <div>
                 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{dateStr}</div>
                 <h2 className="text-3xl md:text-4xl font-bold serif italic text-zinc-900 dark:text-zinc-100">
                     Halo, {userProfile?.name?.split(' ')[0] || 'Friend'}.
                 </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <Brain size={20} />
            </div>
        </header>

        {/* Compose Area */}
        <section className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <form onSubmit={handleSubmit} className="relative bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 shadow-xl transition-all hover:shadow-2xl">
                <textarea
                    value={newThought}
                    onChange={(e) => setNewThought(e.target.value)}
                    placeholder="What's on your mind today? You don't have to explain it."
                    className="w-full bg-transparent border-none outline-none resize-none text-lg text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 placeholder:serif placeholder:italic min-h-[120px]"
                />
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        {/* Potential simplistic mood selector could go here if manual override needed */}
                    </div>
                    <button 
                        type="submit" 
                        disabled={!newThought.trim() || isPosting}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${newThought.trim() ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg hover:scale-105' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
                    >
                        {isPosting ? 'Saving...' : (
                            <>
                                Post <Send size={12} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>

        {/* Timeline */}
        <section className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 px-4">Timeline Privasi</h3>
            
            {sortedThoughts.length === 0 ? (
                 <div className="py-24 text-center glass rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed opacity-30 italic serif text-lg">
                    Ruang ini hening. Tulislah untuk dirimu sendiri.
                 </div>
            ) : (
                <div className="space-y-4">
                    {sortedThoughts.map((thought) => (
                        <div key={thought.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${getTypeColor(thought.type)}`}>
                                    {getMoodIcon(thought.mood)}
                                    {thought.type}
                                </div>
                                <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                                    {new Date(thought.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed serif text-[1.05rem]">
                                {thought.content}
                            </p>
                            <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold text-zinc-300">
                                    {new Date(thought.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                {/* Optional: Delete button */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
      </main>

      {/* Navigation (Manual for now since we are in a sub-page, but typically this would be global) */}
      {/* We reuse the bottom nav style or link back to dashboard? 
          User asked for specialized bottom bar: Dashboard, Focus, Habits, Thoughts, Profile 
          But currently 'oneself' seems to be a dashboard-centric app. 
          I will stick to the pattern of Money/Habit tracker which has internal nav or just relies on the main dashboard.
          The user explicitly asked to "Add as APP SENDIRI inside Oneself".
          So for now, I won't reimplement the GLOBAL bottom bar in this sub-page unless I refactor the whole app layout.
          However, I will make sure it feels like a standalone app.
      */}
    </div>
  );
};
