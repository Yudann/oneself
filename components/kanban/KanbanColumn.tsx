import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, BlockType } from '@/lib/types';
import { KanbanCard } from './KanbanCard';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  column: Block;
  allBlocks: Block[];
  isEditable: boolean;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onAddBlock: (type: BlockType, parentId: string) => void;
  onDeleteBlock: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  allBlocks,
  isEditable,
  onUpdateBlock,
  onAddBlock,
  onDeleteBlock
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column.id, data: { type: 'Column', block: column } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cards = useMemo(() => {
     return allBlocks.filter(b => b.parentId === column.id && b.type === 'kanban_card');
     // Order handling would be here if I had explicit order field
  }, [allBlocks, column.id]);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="shrink-0 w-80 max-h-full flex flex-col bg-zinc-100/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 pb-3"
    >
      {/* Header */}
      <div 
        {...attributes} 
        {...listeners}
        className="p-3 flex items-center justify-between group/header cursor-grab active:cursor-grabbing border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center gap-2 flex-1">
            <div className={`w-2 h-2 rounded-full ${column.config?.color || 'bg-zinc-400'}`}></div>
            <input 
                value={column.content} 
                onChange={(e) => onUpdateBlock(column.id, { content: e.target.value })}
                className="bg-transparent border-none outline-none text-sm font-bold text-zinc-700 dark:text-zinc-200 w-full"
                placeholder="Column Name"
            />
            <span className="text-zinc-400 text-xs font-medium tabular-nums px-2 py-0.5 bg-zinc-200/50 dark:bg-zinc-800 rounded-md">{cards.length}</span>
        </div>
        
        {isEditable && (
            <button 
                onClick={() => onDeleteBlock(column.id)}
                className="opacity-0 group-hover/header:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
            >
                <Trash2 size={14} />
            </button>
        )}
      </div>

      {/* Cards Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 min-h-[50px]">
         <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {cards.map(card => (
                <KanbanCard 
                    key={card.id} 
                    card={card} 
                    isEditable={isEditable}
                    onUpdateBlock={onUpdateBlock}
                    onDeleteBlock={onDeleteBlock}
                />
            ))}
         </SortableContext>
         
         {isEditable && (
             <button 
                onClick={() => onAddBlock('kanban_card', column.id)}
                className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
             >
                 <Plus size={12} /> New
             </button>
         )}
      </div>
    </div>
  );
};
