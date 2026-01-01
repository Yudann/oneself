import React from 'react';

export const TEXT_COLORS = [
  { id: 'default', label: 'Teks default', color: 'inherit' },
  { id: 'gray', label: 'Teks abu-abu', color: '#9b9a97' },
  { id: 'brown', label: 'Teks cokelat', color: '#64473a' },
  { id: 'orange', label: 'Teks oranye', color: '#d9730d' },
  { id: 'yellow', label: 'Teks kuning', color: '#dfab01' },
  { id: 'green', label: 'Teks hijau', color: '#0f7b6c' },
  { id: 'blue', label: 'Teks biru', color: '#0b6e99' },
  { id: 'purple', label: 'Teks ungu', color: '#6940a5' },
  { id: 'pink', label: 'Teks merah muda', color: '#ad1a72' },
  { id: 'red', label: 'Teks merah', color: '#e03e3e' },
];

export const BG_COLORS = [
  { id: 'default', label: 'Latar belakang default', color: 'transparent' },
  { id: 'gray', label: 'Latar belakang abu-abu', color: '#f1f1ef', darkColor: '#2f2f2f' },
  { id: 'brown', label: 'Latar belakang cokelat', color: '#f4eeee', darkColor: '#412d26' },
  { id: 'orange', label: 'Latar belakang oranye', color: '#fbecdd', darkColor: '#593a1c' },
  { id: 'yellow', label: 'Latar belakang kuning', color: '#fbf3db', darkColor: '#594d1b' },
  { id: 'green', label: 'Latar belakang hijau', color: '#edf3ec', darkColor: '#1c3829' },
  { id: 'blue', label: 'Latar belakang biru', color: '#e7f3f8', darkColor: '#193343' },
  { id: 'purple', label: 'Latar belakang ungu', color: '#f3f0f8', darkColor: '#2b213e' },
  { id: 'pink', label: 'Latar belakang merah muda', color: '#f9f0f5', darkColor: '#441d2f' },
  { id: 'red', label: 'Latar belakang merah', color: '#fbe4e4', darkColor: '#482323' },
];

interface ColorMenuProps {
  onSelect: (type: 'text' | 'bg', colorId: string) => void;
  onClose: () => void;
}

export const ColorMenu: React.FC<ColorMenuProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute top-0 left-8 z-[210] w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-1 animate-in fade-in zoom-in-95 duration-150">
      <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 mb-1">
        Warna teks
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        {TEXT_COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => { onSelect('text', c.id); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-lg group"
          >
            <div className="w-5 h-5 rounded border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-xs font-bold bg-white dark:bg-zinc-800" style={{ color: c.color }}>
              A
            </div>
            <span className="text-xs text-zinc-700 dark:text-zinc-300">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 mt-2 mb-1">
        Warna latar belakang
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        {BG_COLORS.map(c => (
          <button
            key={c.id}
            onClick={() => { onSelect('bg', c.id); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-lg group"
          >
            <div className="w-5 h-5 rounded border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: c.color }} />
            <span className="text-xs text-zinc-700 dark:text-zinc-300">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
