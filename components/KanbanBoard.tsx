
import React, { useState, useMemo } from 'react';
import { Activity, FocusItem } from '../lib/types';
import { CATEGORY_COLORS } from '../lib/constants';
import { AlertCircle, Plus, Info, GripVertical, CheckCircle2, Search, Clock, Zap, X, Trophy } from 'lucide-react';

interface KanbanBoardProps {
  activities: Activity[];
  focusItems: FocusItem[];
  onMove: (id: string, column: FocusItem['column']) => void;
  onSetFocus: (activityId: string, column: FocusItem['column']) => void;
  onToggleComplete: (id: string) => void;
  onRemove: (id: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  activities, 
  focusItems, 
  onMove, 
  onSetFocus, 
  onToggleComplete, 
  onRemove 
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const columns: { id: FocusItem['column']; title: string; color: string; description: string; iconColor: string }[] = [
    { 
      id: 'primary', 
      title: 'Deep Focus', 
      color: 'bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
      iconColor: 'text-emerald-500',
      description: 'The priority of your heart today.'
    },
    { 
      id: 'secondary', 
      title: 'Supporting', 
      color: 'bg-blue-50/50 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
      iconColor: 'text-blue-500',
      description: 'Important tasks that sustain you.'
    },
    { 
      id: 'rest', 
      title: 'Rest & Play', 
      color: 'bg-rose-50/50 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
      iconColor: 'text-rose-500',
      description: 'Moments to breathe and recharge.'
    },
  ];

  const boardItems = useMemo(() => {
    return focusItems
      .filter(f => f.date === selectedDate)
      .map(f => ({
        ...f,
        activity: activities.find(a => a.id === f.activityId)
      }))
      .filter(item => item.activity);
  }, [focusItems, activities, selectedDate]);

  const availableActivities = useMemo(() => {
    const focusActivityIds = new Set(boardItems.map(b => b.activityId));
    return activities
      .filter(a => !focusActivityIds.has(a.id))
      .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 15);
  }, [activities, boardItems, searchTerm]);

  const handleDragStart = (e: React.DragEvent, id: string, type: 'board' | 'list') => {
    e.dataTransfer.setData('itemId', id);
    e.dataTransfer.setData('sourceType', type);
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: FocusItem['column']) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('itemId');
    const sourceType = e.dataTransfer.getData('sourceType');
    
    if (sourceType === 'board') {
      onMove(id, columnId);
    } else {
      onSetFocus(id, columnId);
    }
    setDraggedItemId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const completedCount = boardItems.filter(i => i.completed).length;
  const totalCount = boardItems.length;
  const harmonyPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden transition-colors">
      {/* Activity Picker */}
      <div className="w-full md:w-80 bg-zinc-50/50 dark:bg-zinc-900/50 border-r border-zinc-100 dark:border-zinc-800 flex flex-col overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Harmony</span>
                <span className="text-[10px] font-bold text-emerald-600 tabular-nums">{Math.round(harmonyPercent)}%</span>
             </div>
             <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-emerald-400 dark:bg-emerald-500 transition-all duration-1000" style={{ width: `${harmonyPercent}%` }} />
             </div>
             <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic serif leading-snug">
               {totalCount === 0 ? "Choose an intention." : harmonyPercent === 100 ? "You have done enough." : "Balance is emerging."}
             </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700" size={14} />
            <input 
              type="text" 
              placeholder="Search archive..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-900 dark:text-zinc-100 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          {availableActivities.map(activity => (
            <div
              key={activity.id}
              draggable
              onDragStart={(e) => handleDragStart(e, activity.id, 'list')}
              onDragEnd={() => setDraggedItemId(null)}
              className={`bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-grab group transition-all ${draggedItemId === activity.id ? 'opacity-20' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border border-black/5 dark:border-white/5" style={{ backgroundColor: CATEGORY_COLORS[activity.category] }}>{activity.category}</span>
                <GripVertical size={14} className="text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-400 transition-colors" />
              </div>
              <h5 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-tight">{activity.name}</h5>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">
                <Clock size={10} /> {activity.duration}m
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Board Area */}
      <div className="flex-1 flex overflow-x-auto bg-zinc-50/20 dark:bg-zinc-950/20 p-8 gap-8 items-start no-scrollbar">
        {columns.map(col => {
          const items = boardItems.filter(i => i.column === col.id);
          return (
            <div 
              key={col.id} 
              onDragOver={handleDragOver} 
              onDrop={(e) => handleDrop(e, col.id)} 
              className={`flex flex-col min-w-[350px] h-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/10 rounded-[3rem] p-4 transition-all ${draggedItemId ? 'border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-100/30 dark:bg-zinc-800/20 shadow-inner' : 'shadow-sm'}`}
            >
              <div className={`flex items-center justify-between p-4 mb-4 rounded-[2rem] border shadow-sm ${col.color}`}>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[11px] uppercase tracking-[0.15em]">{col.title}</span>
                  <span className="bg-white/40 dark:bg-black/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums border border-black/5 dark:border-white/5">{items.length}</span>
                </div>
                <Zap size={14} className={col.iconColor} />
              </div>
              
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                {items.length > 0 ? (
                  items.map(item => (
                    <div 
                      key={item.id} 
                      draggable={!item.completed} 
                      onDragStart={(e) => handleDragStart(e, item.id, 'board')} 
                      onDragEnd={() => setDraggedItemId(null)} 
                      className={`group relative bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        item.completed 
                          ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-100/50 dark:border-emerald-900/20 opacity-60' 
                          : 'border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 shadow-zinc-200/50'
                      }`}
                    >
                      <button 
                        onClick={() => onRemove(item.id)} 
                        className="absolute right-4 top-4 p-2 text-zinc-300 dark:text-zinc-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} />
                      </button>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <button 
                          onClick={() => onToggleComplete(item.id)} 
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            item.completed 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-emerald-500'
                          }`}
                        >
                          {item.completed && <CheckCircle2 size={12} />}
                        </button>
                        <span 
                          className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-black/5 dark:border-white/5" 
                          style={{ backgroundColor: item.completed ? 'transparent' : CATEGORY_COLORS[item.activity!.category] }}
                        >
                          {item.activity!.category}
                        </span>
                      </div>
                      
                      <h4 className={`text-base font-bold text-zinc-800 dark:text-zinc-100 mb-4 leading-snug ${item.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : ''}`}>
                        {item.activity!.name}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-400 dark:text-zinc-600">
                        <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-lg">
                          <Clock size={12} /> {item.activity!.duration}m
                        </div>
                        {item.id === draggedItemId && (
                          <div className="flex items-center gap-1 text-emerald-500 font-bold uppercase tracking-wider text-[9px]">
                            <Zap size={10} /> Moving
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 text-zinc-300 dark:text-zinc-700">
                      <Zap size={20} />
                    </div>
                    <p className="text-zinc-400 dark:text-zinc-600 serif italic text-sm mb-1">{col.description}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-300 dark:text-zinc-700">Drag items here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
