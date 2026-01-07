"use client";

import React, { useState } from 'react';
import { Block, Activity, FocusItem, BlockType } from '../lib/types';
import { DatabaseTable } from './DatabaseTable';
import { Heatmap } from './Heatmap';
import { KanbanBoard } from './KanbanBoard';
import { InsightCard } from './InsightCard';
import { CalendarView } from './CalendarView';
import { ColorMenu, TEXT_COLORS, BG_COLORS } from './ColorMenu';
import { Trash2, GripVertical, CheckSquare, Square, Quote as QuoteIcon, Minus, ChevronRight, ChevronDown, Plus, Table as TableIcon, Palette } from 'lucide-react';

interface BlockRendererProps {
  block: Block;
  isEditable: boolean;
  activities: Activity[];
  focusItems: FocusItem[];
  onUpdateBlock: (updates: Partial<Block>) => void;
  onDeleteBlock: () => void;
  activityActions: any;
  focusActions: any;
  // For nested blocks (Kanban)
  allBlocks?: Block[];
  pageId?: string;
  onAddChildBlock?: (pageId: string, type: BlockType, config?: any, parentId?: string) => void;
  onUpdateChildBlock?: (pageId: string, blockId: string, updates: Partial<Block>) => void;
  onDeleteChildBlock?: (pageId: string, blockId: string) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditable,
  activities,
  focusItems,
  onUpdateBlock,
  onDeleteBlock,
  activityActions,
  focusActions,
  allBlocks = [],
  pageId = '',
  onAddChildBlock,
  onUpdateChildBlock,
  onDeleteChildBlock
}) => {
  const [isToggled, setIsToggled] = useState(block.config?.isToggled || false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  // Helper for styles
  const getBlockStyle = () => {
    const textStyle = TEXT_COLORS.find(c => c.id === block.textColor);
    const bgStyle = BG_COLORS.find(c => c.id === block.backgroundColor);
    
    return {
      color: textStyle?.color !== 'inherit' ? textStyle?.color : undefined,
      backgroundColor: bgStyle?.color !== 'transparent' ? bgStyle?.color : undefined,
      padding: bgStyle?.color !== 'transparent' ? '12px 16px' : undefined,
      borderRadius: bgStyle?.color !== 'transparent' ? '8px' : undefined,
    };
  };

  const handleColorSelect = (type: 'text' | 'bg', colorId: string) => {
    if (type === 'text') onUpdateBlock({ textColor: colorId });
    else onUpdateBlock({ backgroundColor: colorId });
  };

  const renderBlockContent = () => {
    const blockStyle = getBlockStyle();

    switch (block.type) {
      case 'heading':
        const level = block.config?.level || 1;
        const fontSize = level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl';
        return (
          <input
            className={`w-full bg-transparent border-none outline-none font-bold serif ${fontSize} text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-200 dark:placeholder:text-zinc-800`}
            placeholder={`Heading ${level}`}
            style={blockStyle}
            value={block.content}
            onChange={(e) => onUpdateBlock({ content: e.target.value })}
            disabled={!isEditable}
          />
        );

      case 'bullet_list':
        const bullets = block.config?.items || [''];
        const updateBullet = (idx: number, val: string) => {
          const newBullets = [...bullets];
          newBullets[idx] = val;
          onUpdateBlock({ config: { ...block.config, items: newBullets } });
        };
        return (
          <div className="space-y-1 py-1" style={blockStyle}>
            {bullets.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2 group/bullet">
                <span className="text-zinc-400 mt-1" style={{ color: blockStyle.color }}>•</span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300"
                  value={item}
                  placeholder="Ketik sesuatu..."
                  onChange={(e) => updateBullet(idx, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       onUpdateBlock({ config: { ...block.config, items: [...bullets, ''] } });
                    }
                  }}
                  style={{ color: blockStyle.color }}
                />
              </div>
            ))}
          </div>
        );

      case 'numbered_list':
        const numbers = block.config?.items || [''];
        const updateNumber = (idx: number, val: string) => {
          const newNums = [...numbers];
          newNums[idx] = val;
          onUpdateBlock({ config: { ...block.config, items: newNums } });
        };
        return (
          <div className="space-y-1 py-1" style={blockStyle}>
            {numbers.map((item: string, idx: number) => (
              <div key={idx} className="flex gap-2 group/num">
                <span className="text-zinc-400 text-xs mt-1 w-4" style={{ color: blockStyle.color }}>{idx + 1}.</span>
                <input
                  className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-300"
                  value={item}
                  placeholder="Ketik sesuatu..."
                  onChange={(e) => updateNumber(idx, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       onUpdateBlock({ config: { ...block.config, items: [...numbers, ''] } });
                    }
                  }}
                  style={{ color: blockStyle.color }}
                />
              </div>
            ))}
          </div>
        );

      case 'toggle':
        return (
          <div className="py-1" style={blockStyle}>
            <div className="flex items-center gap-2 mb-2 group/toggle-header">
              <button 
                onClick={() => {
                  const newState = !isToggled;
                  setIsToggled(newState);
                  onUpdateBlock({ config: { ...block.config, isToggled: newState } });
                }}
                className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                {isToggled ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              <input
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-zinc-800 dark:text-zinc-200"
                value={block.content}
                placeholder="Daftar tombol..."
                onChange={(e) => onUpdateBlock({ content: e.target.value })}
              />
            </div>
            {isToggled && (
              <div className="pl-6 pt-1">
                <textarea
                   className="w-full bg-transparent border-none outline-none text-sm text-zinc-500 dark:text-zinc-400 resize-none min-h-[40px]"
                   placeholder="Tulis detail di sini..."
                   value={block.config?.subContent || ''}
                   onChange={(e) => onUpdateBlock({ config: { ...block.config, subContent: e.target.value } })}
                />
              </div>
            )}
          </div>
        );

      case 'todo_list':
        const todoItems = block.config?.items || [];
        const toggleTodo = (id: string) => {
          const newItems = todoItems.map((it: any) => it.id === id ? { ...it, done: !it.done } : it);
          onUpdateBlock({ config: { ...block.config, items: newItems } });
        };
        return (
          <div className="space-y-1.5 py-1" style={blockStyle}>
            {todoItems.map((item: any) => (
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
                  onChange={(e) => {
                    const newItems = todoItems.map((it: any) => it.id === item.id ? { ...it, text: e.target.value } : it);
                    onUpdateBlock({ config: { ...block.config, items: newItems } });
                  }}
                />
              </div>
            ))}
            <button 
                onClick={() => onUpdateBlock({ config: { ...block.config, items: [...todoItems, { id: Math.random().toString(), text: '', done: false }] } })}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 pl-8 pt-1"
            >
                + Tambah Tugas
            </button>
          </div>
        );

      case 'table':
        const tableData = block.config?.data || [['Header 1', 'Header 2'], ['', '']];
        const updateCell = (rIdx: number, cIdx: number, val: string) => {
            const newData = [...tableData.map(r => [...r])];
            newData[rIdx][cIdx] = val;
            onUpdateBlock({ config: { ...block.config, data: newData } });
        };
        const addRow = () => onUpdateBlock({ config: { ...block.config, data: [...tableData, Array(tableData[0].length).fill('')] } });
        const addCol = () => onUpdateBlock({ config: { ...block.config, data: tableData.map(r => [...r, '']) } });
        
        return (
          <div className="py-4 space-y-3 overflow-x-auto no-scrollbar" style={blockStyle}>
            <table className="w-full border-collapse border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <tbody>
                    {tableData.map((row: string[], rIdx: number) => (
                        <tr key={rIdx} className="divide-x divide-zinc-200 dark:divide-zinc-800">
                            {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className={`p-0 ${rIdx === 0 ? 'bg-zinc-50 dark:bg-zinc-800/50 font-bold' : ''}`}>
                                    <input 
                                        className="w-full px-3 py-2 bg-transparent border-none outline-none text-xs text-zinc-700 dark:text-zinc-300 min-w-[120px]"
                                        value={cell}
                                        onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-2">
                <button onClick={addRow} className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"><Plus size={10} /> Baris</button>
                <button onClick={addCol} className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"><Plus size={10} /> Kolom</button>
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            className="w-full bg-transparent border-none outline-none resize-none text-zinc-800 dark:text-zinc-200 serif text-lg leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-800"
            style={blockStyle}
            placeholder="Ketik untuk mulai menulis atau tekan '/' untuk perintah..."
            value={block.content}
            onChange={(e) => onUpdateBlock({ content: e.target.value })}
            rows={Math.max(1, block.content.split('\n').length)}
            disabled={!isEditable}
          />
        );

      case 'divider':
        return <div className="h-px bg-zinc-100 dark:bg-zinc-800/60 w-full my-4" />;
        
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
      case 'calendar':
        return <CalendarView activities={activities} onAddActivity={activityActions.addActivity} />;
      case 'callout':
          return (
            <div className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800" style={blockStyle}>
              <div className="text-xl shrink-0 mt-0.5" style={{ color: blockStyle.color }}>
                <input 
                  className="w-8 bg-transparent border-none outline-none text-center"
                  value={block.config?.icon || '💡'} 
                  onChange={(e) => onUpdateBlock({ config: { ...block.config, icon: e.target.value } })}
                />
              </div>
              <textarea
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                placeholder="Catatan penting atau sorotan..."
                value={block.content}
                onChange={(e) => onUpdateBlock({ content: e.target.value })}
                rows={Math.max(1, block.content.split('\n').length)}
                disabled={!isEditable}
                style={{ color: blockStyle.color }}
              />
            </div>
          );
      case 'quote':
          return (
            <div className="border-l-4 border-zinc-200 dark:border-zinc-800 pl-6 py-2 italic serif text-xl text-zinc-600 dark:text-zinc-400" style={blockStyle}>
              <textarea
                className="w-full bg-transparent border-none outline-none resize-none leading-relaxed placeholder:text-zinc-200 dark:placeholder:text-zinc-800"
                placeholder="Kata yang menenangkanmu..."
                value={block.content}
                onChange={(e) => onUpdateBlock({ content: e.target.value })}
                rows={Math.max(1, block.content.split('\n').length)}
                disabled={!isEditable}
                style={{ color: blockStyle.color }}
              />
            </div>
          );
      case 'insight':
          return <InsightCard activities={activities} />;
      case 'mood_log':
          return (
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-center space-y-4" style={blockStyle}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">How are you feeling?</h4>
              <div className="flex justify-center gap-4 text-3xl">
                {['Great', 'Good', 'Neutral', 'Tired', 'Low'].map(m => (
                  <button key={m} className="hover:scale-125 transition-transform grayscale hover:grayscale-0 opacity-40 hover:opacity-100">
                    {m === 'Great' && '😆'}
                    {m === 'Good' && '😊'}
                    {m === 'Neutral' && '😐'}
                    {m === 'Tired' && '😴'}
                    {m === 'Low' && '😔'}
                  </button>
                ))}
              </div>
            </div>
          );
      case 'kanban_board':
          const { KanbanBlock } = require('./kanban/KanbanBlock');
          return (
            <div className="py-4">
              <KanbanBlock 
                block={block}
                allBlocks={allBlocks}
                isEditable={isEditable}
                onUpdateBlock={(id, updates) => {
                  if (onUpdateChildBlock && pageId) {
                    onUpdateChildBlock(pageId, id, updates);
                  }
                }}
                onAddBlock={(type, parentId) => {
                  if (onAddChildBlock && pageId) {
                    onAddChildBlock(pageId, type, undefined, parentId);
                  }
                }}
                onDeleteBlock={(id) => {
                  if (onDeleteChildBlock && pageId) {
                    onDeleteChildBlock(pageId, id);
                  }
                }}
              />
            </div>
          );
      default:
        return <div className="p-4 bg-zinc-50 rounded-xl text-xs text-zinc-400">Blok {block.type} akan hadir segera.</div>;
    }
  };

  return (
    <div className="relative group/block py-2 animate-in fade-in duration-300">
      {isEditable && (
        <div className="absolute -left-12 top-2 opacity-0 group-hover/block:opacity-100 transition-opacity flex flex-col items-center gap-1">
          <div className="p-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400">
            <GripVertical size={16} />
          </div>
          <button 
            onClick={() => setShowColorMenu(!showColorMenu)}
            className="p-1 text-zinc-300 dark:text-zinc-700 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all"
          >
            <Palette size={16} />
          </button>
          <button onClick={onDeleteBlock} className="p-1 text-zinc-300 dark:text-zinc-700 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded transition-all">
            <Trash2 size={16} />
          </button>
          
          {showColorMenu && (
            <ColorMenu 
              onSelect={handleColorSelect} 
              onClose={() => setShowColorMenu(false)} 
            />
          )}
        </div>
      )}
      <div className="w-full">{renderBlockContent()}</div>
    </div>
  );
};
