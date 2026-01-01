
import React, { useState } from 'react';
import { Activity, Category, Intensity, Mood } from '../lib/types';
import { CATEGORY_COLORS, CATEGORIES, INTENSITIES, MOODS } from '../lib/constants';
import { ChevronLeft, ChevronRight, X, Plus, Clock, Activity as ActivityIcon } from 'lucide-react';

interface CalendarViewProps {
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ activities, onAddActivity }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayData, setSelectedDayData] = useState<{ day: number; date: Date } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding new activity via modal
  const [form, setForm] = useState({
    name: '',
    category: 'Personal' as Category,
    intensity: 'medium' as Intensity,
    mood: 'Neutral' as Mood,
    color: CATEGORY_COLORS['Personal'],
    duration: 30,
  });

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const getActivitiesForDay = (day: number) => {
    return activities.filter(a => {
      const d = new Date(a.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDayData({ day, date: new Date(year, month, day) });
    setShowAddForm(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !selectedDayData) return;
    
    onAddActivity({
      ...form,
      date: selectedDayData.date.toISOString(),
      tags: []
    });
    
    setForm({ ...form, name: '' });
    setShowAddForm(false);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col relative transition-colors">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 serif transition-colors">{monthName} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-zinc-500 dark:text-zinc-400" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronRight size={20} className="text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-zinc-50/30 dark:bg-zinc-900/30">
        {weekDays.map(wd => (
          <div key={wd} className="py-2 text-center text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 tracking-widest border-r last:border-r-0 border-border">
            {wd}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {days.map((day, idx) => {
          const dayActivities = day ? getActivitiesForDay(day) : [];
          const isToday = day && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

          return (
            <div 
              key={idx} 
              onClick={() => day && handleDayClick(day)}
              className={`min-h-[120px] p-2 border-r border-b last:border-r-0 border-border flex flex-col gap-1 transition-colors cursor-pointer group ${
                !day ? 'bg-zinc-50/20 dark:bg-zinc-900/10' : 'bg-card hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40'
              }`}
            >
              {day && (
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium transition-colors ${
                    isToday
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 w-5 h-5 flex items-center justify-center rounded-full shadow-sm'
                      : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'
                  }`}>
                    {day}
                  </span>
                  {dayActivities.length > 0 && (
                    <span className="text-[10px] text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-600 font-bold uppercase tracking-tighter transition-colors">
                      {dayActivities.length} logs
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] no-scrollbar">
                {dayActivities.slice(0, 3).map(a => (
                  <div 
                    key={a.id}
                    className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium border border-black/5 dark:border-white/5 shadow-sm"
                    style={{ backgroundColor: CATEGORY_COLORS[a.category] }}
                  >
                    {a.name}
                  </div>
                ))}
                {dayActivities.length > 3 && (
                  <div className="text-[9px] text-zinc-400 dark:text-zinc-600 italic pl-1">
                    +{dayActivities.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      {selectedDayData && (
        <div className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 transition-colors">
          <div className="bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] border border-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 serif transition-colors">
                  {selectedDayData.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-zinc-400 dark:text-zinc-600 text-xs uppercase tracking-widest font-bold mt-1">Daily Log Summary</p>
              </div>
              <button 
                onClick={() => setSelectedDayData(null)} 
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Activities</h3>
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-400"
                  >
                    {showAddForm ? <X size={14} /> : <Plus size={14} />}
                    {showAddForm ? 'Cancel' : 'Add Activity'}
                  </button>
                </div>

                {showAddForm ? (
                  <form onSubmit={handleAddSubmit} className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl space-y-4 border border-border animate-in slide-in-from-top-2 transition-colors">
                    <div>
                      <input
                        autoFocus
                        type="text"
                        placeholder="What did you do?"
                        className="w-full text-lg border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100 bg-transparent transition-colors py-1 outline-none font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 italic serif"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        className="bg-card border border-border rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 outline-none transition-colors"
                        value={form.category}
                        onChange={e => setForm({...form, category: e.target.value as Category})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input
                        type="number"
                        placeholder="Min"
                        className="bg-card border border-border rounded-xl p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 outline-none transition-colors"
                        value={form.duration}
                        onChange={e => setForm({...form, duration: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="flex gap-2">
                      {INTENSITIES.map(i => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setForm({...form, intensity: i})}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                            form.intensity === i ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-md' : 'bg-card text-zinc-400 dark:text-zinc-600 border-border hover:border-zinc-400 dark:hover:border-zinc-600'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                    <button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
                      Save Log
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {getActivitiesForDay(selectedDayData.day).length === 0 ? (
                      <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-border transition-colors">
                        <p className="text-zinc-400 dark:text-zinc-600 italic text-sm serif">Silence is also part of the rhythm.</p>
                      </div>
                    ) : (
                      getActivitiesForDay(selectedDayData.day).map(a => (
                        <div key={a.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm"
                              style={{ backgroundColor: CATEGORY_COLORS[a.category] }}
                            >
                              {a.mood === 'Great' && '😆'}
                              {a.mood === 'Good' && '😊'}
                              {a.mood === 'Neutral' && '😐'}
                              {a.mood === 'Tired' && '😴'}
                              {a.mood === 'Low' && '😔'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm transition-colors">{a.name}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600 transition-colors">
                                  <Clock size={10} /> {a.duration}m
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600 capitalize transition-colors">
                                  <ActivityIcon size={10} /> {a.intensity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-all">
                            {a.category}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
