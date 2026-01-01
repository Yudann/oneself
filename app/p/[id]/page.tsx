
'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-provider';
import { BlockRenderer } from '@/components/BlockRenderer';
import { Activity, BlockType } from '@/lib/types';
import { Heading1, Type, CheckSquare, Quote, MessageSquare, Smile, Minus, BarChart3, Target, Layout, Sparkles } from 'lucide-react';
import { Menu } from 'lucide-react'; 

export default function DynamicPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    state, 
    updatePage, 
    addBlockToPage, 
    updateBlock, 
    deleteBlock, 
    addActivity, 
    deleteActivity, 
    updateActivity,
    setFocusItem, 
    moveFocusItem, 
    toggleFocusItemCompletion, 
    removeFocusItem
  } = useStore();

  const pageId = params.id as string;
  
  const currentPage = useMemo(() => {
    return state.pages.find(p => p.id === pageId);
  }, [state.pages, pageId]);

  const activityActions = { addActivity, deleteActivity, updateActivity };
  const focusActions = { setFocusItem, moveFocusItem, toggleFocusItemCompletion, removeFocusItem };

  if (!currentPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-400">
        <p className="text-lg serif italic">Page not found.</p>
        <button onClick={() => router.push('/')} className="mt-4 text-xs font-bold uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Return Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-8 pb-32 animate-in fade-in duration-500 transition-colors">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <input type="text" value={currentPage.icon} onChange={(e) => updatePage(currentPage.id, { icon: e.target.value })} className="text-4xl w-14 bg-transparent border-none outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-900 rounded-xl px-2 transition-all text-center" placeholder="📄" />
          <input type="text" value={currentPage.title} onChange={(e) => updatePage(currentPage.id, { title: e.target.value })} className="flex-1 text-3xl md:text-5xl font-bold serif text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none focus:ring-2 focus:ring-zinc-100 dark:focus:ring-zinc-900 rounded-xl px-2 transition-all" placeholder="Page Title" />
        </div>
        <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
      </header>

      <div className="space-y-4 min-h-[400px]">
        {currentPage.blocks.length > 0 ? (
          currentPage.blocks.map(block => (
            <BlockRenderer key={block.id} block={block} isEditable={true} activities={state.activities} focusItems={state.focusItems} onUpdateBlock={(updates) => updateBlock(currentPage.id, block.id, updates)} onDeleteBlock={() => deleteBlock(currentPage.id, block.id)} activityActions={activityActions} focusActions={focusActions} />
          ))
        ) : (
          <div className="py-20 text-center space-y-4 opacity-30 dark:opacity-10">
            <p className="serif text-xl italic">Silence is where everything begins.</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">Add your first block below</p>
          </div>
        )}
      </div>

      <div className="mt-20 pt-12 border-t border-zinc-100 dark:border-zinc-800 space-y-10">
        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-4 ml-2">Personal Expression</h5>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'heading', icon: Heading1, label: 'Header', config: { level: 1 } },
              { type: 'text', icon: Type, label: 'Paragraph' },
              { type: 'todo_list', icon: CheckSquare, label: 'Todo List', config: { items: [] } },
              { type: 'quote', icon: Quote, label: 'Quote' },
              { type: 'callout', icon: MessageSquare, label: 'Callout', config: { icon: '💡' } },
              { type: 'mood_log', icon: Smile, label: 'Mood Logger' },
              { type: 'divider', icon: Minus, label: 'Divider' }
            ].map(tool => (
              <button key={tool.type + (tool.config?.level || '')} onClick={() => {
                addBlockToPage(currentPage.id, tool.type as BlockType);
              }} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-zinc-800 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:scale-105 active:scale-95 shadow-sm">
                <tool.icon size={12} /> {tool.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 mb-4 ml-2">System Insight</h5>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'heatmap', icon: BarChart3, label: 'Energy Heatmap' },
              { type: 'focus_board', icon: Target, label: 'Focus Grid' },
              { type: 'activity_log', icon: Layout, label: 'Archive' },
              { type: 'insight', icon: Sparkles, label: 'Reflections' }
            ].map(tool => (
              <button key={tool.type} onClick={() => addBlockToPage(currentPage.id, tool.type as BlockType)} className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-100 dark:hover:border-emerald-900/40 transition-all hover:scale-105 active:scale-95">
                <tool.icon size={12} /> {tool.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
