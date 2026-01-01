
import React from 'react';
import { Block, Activity, FocusItem } from '../lib/types';
import { DatabaseTable } from './DatabaseTable';
import { Heatmap } from './Heatmap';
import { KanbanBoard } from './KanbanBoard';
import { InsightCard } from './InsightCard';
import { CalendarView } from './CalendarView';
import { Trash2, GripVertical, CheckSquare, Square, Quote as QuoteIcon, AlertCircle, Minus } from 'lucide-react';

interface BlockRendererProps {
  block: Block;
  isEditable: boolean;
  activities: Activity[];
  focusItems: FocusItem[];
  onUpdateBlock: (updates: Partial<Block>) => void;
  onDeleteBlock: () => void;
  activityActions: any;
  focusActions: any;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditable,
  activities,
  focusItems,
  onUpdateBlock,
  onDeleteBlock,
  activityActions,
  focusActions
}) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
        const level = block.config?.level || 1;
        const fontSize = level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl';
        return (
          <input
            className={`w-full bg-transparent border-none outline-none font-bold serif ${fontSize} text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-200 dark:placeholder:text-zinc-800`}
            placeholder={`Heading ${level}`}
            value={block.content}
            onChange={(e) => onUpdateBlock({ content: e.target.value })}
            disabled={!isEditable}
          />
        );

      case 'todo_list':
        const items = block.config?.items || [];
        const toggleTodo = (id: string) => {
          const newItems = items.map((it: any) => it.id === id ? { ...it, done: !it.done } : it);
          onUpdateBlock({ config: { ...block.config, items: newItems } });
        };
        const updateTodo = (id: string, text: string) => {
          const newItems = items.map((it: any) => it.id === id ? { ...it, text } : it);
          onUpdateBlock({ config: { ...block.config, items: newItems } });
        };
        const addTodo = () => {
          const newItems = [...items, { id: Math.random().toString(), text: '', done: false }];
          onUpdateBlock({ config: { ...block.config, items: newItems } });
        };

        return (
          <div className="space-y-1.5 py-1">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-start gap-3 group/todo">
                <button 
                  onClick={() => toggleTodo(item.id)}
                  className={`mt-1 transition-colors ${item.done ? 'text-emerald-500' : 'text-zinc-300 dark:text-zinc-700 hover:text-zinc-500'}`}
                >
                  {item.done ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <input
                  className={`flex-1 bg-transparent border-none outline-none text-sm transition-all ${item.done ? 'line-through text-zinc-400 dark:text-zinc-600' : 'text-zinc-700 dark:text-zinc-200'}`}
                  value={item.text}
                  placeholder="Task..."
                  onChange={(e) => updateTodo(item.id, e.target.value)}
                  disabled={!isEditable}
                />
              </div>
            ))}
            {isEditable && (
              <button 
                onClick={addTodo}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 pl-8 pt-1 transition-colors"
              >
                + New Item
              </button>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="border-l-4 border-zinc-200 dark:border-zinc-800 pl-6 py-2 italic serif text-xl text-zinc-600 dark:text-zinc-400">
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none leading-relaxed placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
              placeholder="A word that grounds you..."
              value={block.content}
              onChange={(e) => onUpdateBlock({ content: e.target.value })}
              rows={Math.max(1, block.content.split('\n').length)}
              disabled={!isEditable}
            />
          </div>
        );

      case 'divider':
        return <div className="h-px bg-zinc-100 dark:bg-zinc-800/60 w-full my-4" />;

      case 'callout':
        return (
          <div className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="text-xl shrink-0 mt-0.5">
              <input 
                className="w-8 bg-transparent border-none outline-none text-center"
                value={block.config?.icon || '💡'} 
                onChange={(e) => onUpdateBlock({ config: { ...block.config, icon: e.target.value } })}
              />
            </div>
            <textarea
              className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              placeholder="Important note or highlight..."
              value={block.content}
              onChange={(e) => onUpdateBlock({ content: e.target.value })}
              rows={Math.max(1, block.content.split('\n').length)}
              disabled={!isEditable}
            />
          </div>
        );

      case 'mood_log':
        const selectedMood = block.config?.mood;
        const moodEmojis = { Great: '😆', Good: '😊', Neutral: '😐', Tired: '😴', Low: '😔' };
        return (
          <div className="flex flex-wrap items-center gap-4 md:gap-6 p-4 bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 pl-2">Current State</span>
            <div className="flex gap-3">
              {Object.entries(moodEmojis).map(([m, emoji]) => (
                <button
                  key={m}
                  onClick={() => onUpdateBlock({ config: { ...block.config, mood: m } })}
                  className={`text-2xl transition-all ${selectedMood === m ? 'scale-125 drop-shadow-md' : 'grayscale opacity-30 dark:opacity-20 hover:opacity-100 hover:grayscale-0'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            className="w-full bg-transparent border-none outline-none resize-none text-zinc-800 dark:text-zinc-200 serif text-lg leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
            placeholder="Click to start typing..."
            value={block.content}
            onChange={(e) => onUpdateBlock({ content: e.target.value })}
            rows={Math.max(1, block.content.split('\n').length)}
            disabled={!isEditable}
          />
        );

      case 'activity_log':
        return <DatabaseTable activities={activities} onDelete={activityActions.deleteActivity} onUpdate={activityActions.updateActivity} />;
      case 'heatmap':
        return <Heatmap activities={activities} />;
      case 'focus_board':
        return (
          <div className="h-[600px] border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden">
            <KanbanBoard activities={activities} focusItems={focusItems} onMove={focusActions.moveFocusItem} onSetFocus={focusActions.setFocusItem} onToggleComplete={focusActions.toggleFocusItemCompletion} onRemove={focusActions.removeFocusItem} />
          </div>
        );
      case 'insight':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InsightCard title="Daily Focus" description="Consistency is forming in your habits." type="positive" />
            <InsightCard title="Balance" description="Remember to step away from the screen." type="suggestion" />
          </div>
        );
      case 'calendar':
        return <CalendarView activities={activities} onAddActivity={activityActions.addActivity} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative group/block py-2 animate-in fade-in duration-300">
      {isEditable && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity flex flex-col items-center gap-1">
          <div className="p-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400">
            <GripVertical size={16} />
          </div>
          <button onClick={onDeleteBlock} className="p-1 text-zinc-300 dark:text-zinc-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-all">
            <Trash2 size={16} />
          </button>
        </div>
      )}
      <div className="w-full">{renderBlockContent()}</div>
    </div>
  );
};
