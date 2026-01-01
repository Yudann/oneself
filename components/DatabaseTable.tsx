
import React, { useState, useMemo } from 'react';
import { Activity, Category, Intensity, Mood } from '../lib/types';
import { CATEGORY_COLORS, CATEGORIES, INTENSITIES, MOODS } from '../lib/constants';
import { Trash2, Search, Filter, ArrowUpDown, Download, X, BarChart3 } from 'lucide-react';

interface DatabaseTableProps {
  activities: Activity[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
}

type SortField = 'date' | 'duration' | 'name' | 'intensity';
type SortOrder = 'asc' | 'desc';

export const DatabaseTable: React.FC<DatabaseTableProps> = ({ activities, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterIntensity, setFilterIntensity] = useState<Intensity | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSorted = useMemo(() => {
    return activities
      .filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
        const matchesCat = filterCategory === 'All' || a.category === filterCategory;
        const matchesInt = filterIntensity === 'All' || a.intensity === filterIntensity;
        return matchesSearch && matchesCat && matchesInt;
      })
      .sort((a, b) => {
        let compare = 0;
        if (sortField === 'date') compare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortField === 'duration') compare = a.duration - b.duration;
        if (sortField === 'name') compare = a.name.localeCompare(b.name);
        if (sortField === 'intensity') {
          const weights = { low: 1, medium: 2, high: 3 };
          compare = weights[a.intensity] - weights[b.intensity];
        }
        return sortOrder === 'asc' ? compare : -compare;
      });
  }, [activities, search, filterCategory, filterIntensity, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExport = () => {
    const headers = ['Name', 'Category', 'Intensity', 'Duration', 'Mood', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSorted.map(a => 
        `"${a.name}",${a.category},${a.intensity},${a.duration},${a.mood},${a.date}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `oneself_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalMinutes = filteredAndSorted.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="space-y-4 transition-colors">
      {/* Controls Header */}
      <div className="bg-white dark:bg-zinc-900/40 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700" size={18} />
          <input 
            type="text"
            placeholder="Search archive..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-zinc-900/5 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2">
          <select 
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 outline-none appearance-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 outline-none appearance-none"
            value={filterIntensity}
            onChange={(e) => setFilterIntensity(e.target.value as any)}
          >
            <option value="All">All Intensities</option>
            {INTENSITIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>

          <button 
            onClick={handleExport}
            className="col-span-2 md:ml-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-lg"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-8 px-5 py-3 bg-zinc-50/80 dark:bg-zinc-800/20 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
          <BarChart3 size={14} />
          {filteredAndSorted.length} Records
        </div>
        <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
          Total Time: <span className="text-zinc-700 dark:text-zinc-300">{(totalMinutes / 60).toFixed(1)}h</span>
        </div>
      </div>

      <div className="overflow-hidden bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-800/30">
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-2">Name {sortField === 'name' && <ArrowUpDown size={10} />}</div>
                </th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Category</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 cursor-pointer" onClick={() => toggleSort('intensity')}>
                  <div className="flex items-center gap-2">Intensity {sortField === 'intensity' && <ArrowUpDown size={10} />}</div>
                </th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Mood</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Time</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-2">Date {sortField === 'date' && <ArrowUpDown size={10} />}</div>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center opacity-30 dark:opacity-10">
                    <div className="flex flex-col items-center gap-3">
                      <X size={40} strokeWidth={1} />
                      <p className="italic serif text-xl">Silence in the archive.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((a) => (
                  <tr key={a.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-6 py-5 font-bold text-zinc-800 dark:text-zinc-200">{a.name}</td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-black/5 dark:border-white/5" style={{ backgroundColor: CATEGORY_COLORS[a.category] }}>
                        {a.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                        a.intensity === 'high' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border-rose-100 dark:border-rose-900/30' :
                        a.intensity === 'medium' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100 dark:border-amber-900/30' :
                        'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30'
                      }`}>
                        {a.intensity}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xl">{a.mood === 'Great' && '😆'}{a.mood === 'Good' && '😊'}{a.mood === 'Neutral' && '😐'}{a.mood === 'Tired' && '😴'}{a.mood === 'Low' && '😔'}</td>
                    <td className="px-6 py-5 text-zinc-500 dark:text-zinc-400 font-bold tabular-nums">{a.duration}m</td>
                    <td className="px-6 py-5 text-zinc-400 dark:text-zinc-600 tabular-nums text-xs font-medium">
                      {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => onDelete(a.id)} className="p-2.5 text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
