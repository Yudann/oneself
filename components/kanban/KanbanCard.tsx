import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block } from '@/lib/types';
import { GripVertical, Trash2 } from 'lucide-react';

interface KanbanCardProps {
  card: Block;
  isEditable: boolean;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  isEditable,
  onUpdateBlock,
  onDeleteBlock
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id, data: { type: 'Card', block: card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group/card bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-2">
        {isEditable && (
          <div 
            {...attributes} 
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400"
          >
            <GripVertical size={14} />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <textarea 
            value={card.content} 
            onChange={(e) => {
              onUpdateBlock(card.id, { content: e.target.value });
              // Auto-expand textarea
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            className="w-full bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-200 resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
            placeholder="What needs to be done?"
            rows={1}
            style={{ minHeight: '20px' }}
          />
          
          {/* Optional description */}
          {(isExpanded || card.config?.description) && (
            <textarea 
              value={card.config?.description || ''} 
              onChange={(e) => onUpdateBlock(card.id, { config: { ...card.config, description: e.target.value } })}
              className="w-full mt-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-xs text-zinc-600 dark:text-zinc-400 resize-none outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-600"
              placeholder="Add details..."
              rows={2}
            />
          )}
        </div>

        {isEditable && (
          <button 
            onClick={() => onDeleteBlock(card.id)}
            className="opacity-0 group-hover/card:opacity-100 p-1 text-zinc-300 dark:text-zinc-700 hover:text-rose-500 transition-opacity"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Footer actions */}
      {isEditable && !isExpanded && !card.config?.description && (
        <button 
          onClick={() => setIsExpanded(true)}
          className="mt-2 text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium uppercase tracking-wider"
        >
          + Add details
        </button>
      )}
    </div>
  );
};
