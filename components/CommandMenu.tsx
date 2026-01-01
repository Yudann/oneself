"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, Heading1, Heading2, Heading3, List, ListOrdered, ChevronRight, 
  MessageSquare, Quote, Table as TableIcon, Minus, CheckSquare, Smile
} from 'lucide-react';
import { BlockType } from '../lib/types';

interface CommandMenuProps {
  onSelect: (type: BlockType, config?: any) => void;
  onClose: () => void;
}

interface CommandItem {
  id: BlockType;
  label: string;
  icon: any;
  category: string;
  shortcut?: string;
  config?: any;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const items: CommandItem[] = [
    { id: 'text', label: 'Teks', icon: Type, category: 'Blok dasar' },
    { id: 'heading', label: 'Judul 1', icon: Heading1, category: 'Blok dasar', shortcut: '#', config: { level: 1 } },
    { id: 'heading', label: 'Judul 2', icon: Heading2, category: 'Blok dasar', shortcut: '##', config: { level: 2 } },
    { id: 'heading', label: 'Judul 3', icon: Heading3, category: 'Blok dasar', shortcut: '###', config: { level: 3 } },
    { id: 'bullet_list', label: 'Daftar poin', icon: List, category: 'Blok dasar', shortcut: '-' },
    { id: 'numbered_list', label: 'Daftar bernomor', icon: ListOrdered, category: 'Blok dasar', shortcut: '1.' },
    { id: 'todo_list', label: 'Daftar tugas', icon: CheckSquare, category: 'Blok dasar', shortcut: '[]' },
    { id: 'toggle', label: 'Daftar tombol', icon: ChevronRight, category: 'Blok dasar', shortcut: '>' },
    { id: 'callout', label: 'Callout', icon: MessageSquare, category: 'Blok dasar' },
    { id: 'quote', label: 'Kutipan', icon: Quote, category: 'Blok dasar', shortcut: '"' },
    { id: 'table', label: 'Tabel', icon: TableIcon, category: 'Blok dasar' },
    { id: 'divider', label: 'Divider', icon: Minus, category: 'Blok dasar', shortcut: '---' },
    { id: 'mood_log', label: 'Mood Logger', icon: Smile, category: 'Personal' },
  ];

  const filteredItems = items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const categories = Array.from(new Set(filteredItems.map(i => i.category)));

  return (
    <div 
      ref={menuRef}
      className="fixed z-[200] w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      style={{ top: '100px', left: '50%', transform: 'translateX(-50%)' }}
    >
      <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
        <input 
          autoFocus
          type="text"
          placeholder="Cari blok atau ketik perintah..."
          className="w-full bg-transparent text-sm outline-none text-zinc-800 dark:text-zinc-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-1">
        {categories.map(cat => (
          <div key={cat} className="mb-2">
            <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
              {cat}
            </div>
            {filteredItems.filter(i => i.category === cat).map(item => (
              <button
                key={item.label}
                onClick={() => {
                  onSelect(item.id, item.config);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-lg group"
              >
                <div className="w-6 h-6 rounded bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-white dark:group-hover:bg-zinc-700">
                  <item.icon size={14} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] text-zinc-400 font-mono">{item.shortcut}</span>
                )}
              </button>
            ))}
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-zinc-400 italic">
            Tidak ada hasil ditemukan
          </div>
        )}
      </div>
    </div>
  );
};
