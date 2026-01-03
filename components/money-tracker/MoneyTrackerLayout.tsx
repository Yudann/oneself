import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Calendar as CalendarIcon,
  PieChart,
  ArrowLeft,
  Settings,
  History,
  Trash2,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Download,
  Edit2,
  Bell,
  CheckCircle2,
  XCircle,
  Video,
  Music,
  Tv,
  Layout,
  Sparkles,
  Cloud,
  Layers,
  Search,
  Zap
} from 'lucide-react';
import { Transaction, UserProfile, Subscription } from '../../lib/types';
import Link from 'next/link';

interface MoneyTrackerLayoutProps {
  transactions: Transaction[];
  subscriptions: Subscription[];
  userProfile?: UserProfile;
  onAddTransaction: (transaction: any) => void;
  onUpdateTransaction: (id: string, updates: any) => void;
  onDeleteTransaction: (id: string) => void;
  onAddSubscription: (sub: any) => void;
  onUpdateSubscription: (id: string, updates: any) => void;
  onDeleteSubscription: (id: string) => void;
}

const PRESET_APPS = [
    { name: 'Spotify', icon: Music, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', category: 'Entertainment' },
    { name: 'Netflix', icon: Tv, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30', category: 'Entertainment' },
    { name: 'YouTube Premium', icon: Video, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', category: 'Entertainment' },
    { name: 'Disney+', icon: Tv, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', category: 'Entertainment' },
    { name: 'Capcut', icon: Video, color: 'text-zinc-900', bg: 'bg-zinc-100 dark:bg-zinc-800', category: 'Work Tool' },
    { name: 'Canva', icon: Layers, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30', category: 'Work Tool' },
    { name: 'ChatGPT', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', category: 'Work Tool' },
    { name: 'Midjourney', icon: Layout, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30', category: 'Work Tool' },
    { name: 'iCloud', icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30', category: 'Storage' },
    { name: 'Google One', icon: Cloud, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', category: 'Storage' },
    { name: 'Notion', icon: History, color: 'text-zinc-800', bg: 'bg-zinc-100 dark:bg-zinc-800', category: 'Work Tool' },
];

const TRANSACTION_CATEGORIES = {
    expense: [
        { value: 'Konsumsi', label: 'Konsumsi', icon: '🍽️' },
        { value: 'Transport', label: 'Transport', icon: '🚗' },
        { value: 'Personal', label: 'Pribadi', icon: '🛍️' },
        { value: 'Work', label: 'Kerja', icon: '💼' },
        { value: 'Entertainment', label: 'Hiburan', icon: '🎮' },
        { value: 'Bill', label: 'Tagihan', icon: '📝' },
        { value: 'Subcription', label: 'Langganan', icon: '📺' },
    ],
    income: [
        { value: 'Salary', label: 'Gaji', icon: '💰' },
        { value: 'Gift', label: 'Hadiah', icon: '🎁' },
        { value: 'Pocket Money', label: 'Jajan', icon: '👛' },
        { value: 'Investment', label: 'Invest', icon: '📈' },
    ]
};

const SUBSCRIPTION_CATEGORIES = [
    { value: 'Entertainment', label: 'Hiburan', icon: '🎬' },
    { value: 'Work Tool', label: 'Alat Kerja', icon: '🛠️' },
    { value: 'Learning', label: 'Belajar', icon: '📖' },
    { value: 'Health', label: 'Kesehatan', icon: '💪' },
    { value: 'Storage', label: 'Penyimpanan', icon: '☁️' },
];

const BILLING_CYCLES = [
    { value: 'monthly', label: 'Bulanan', icon: '📅' },
    { value: 'yearly', label: 'Tahunan', icon: '🗓️' },
];

const PremiumSelect = ({ name, options, defaultValue, onChange }: { name: string, options: { value: string, label: string, icon?: string }[], defaultValue?: string, onChange?: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || options[0]?.value);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (defaultValue) setSelected(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === (selected || options[0]?.value)) || options[0];

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <input type="hidden" name={name} value={selected} />
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-zinc-100/50 dark:bg-white/5 p-5 rounded-[2.2rem] flex items-center justify-between cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-white/10 transition-all border border-transparent shadow-sm hover:shadow-md"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[1.2rem] bg-white dark:bg-zinc-800 flex items-center justify-center text-xl shadow-sm">
                        {selectedOption?.icon}
                    </div>
                    <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{selectedOption?.label}</span>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors bg-white/50 dark:bg-white/5">
                    <ChevronDown size={16} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {isOpen && (
                <div className="absolute bottom-full mb-3 left-0 w-full min-w-[240px] max-w-[calc(100vw-3rem)] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_-25px_70px_-15px_rgba(0,0,0,0.4)] border border-zinc-100 dark:border-white/10 z-[100] p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 group overflow-visible">
                    <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth p-1">
                        {options.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => {
                                    setSelected(opt.value);
                                    setIsOpen(false);
                                    onChange?.(opt.value);
                                }}
                                className={`flex items-center gap-4 p-4 rounded-[1.8rem] cursor-pointer transition-all duration-300 ${selected === opt.value ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl' : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <div className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center text-xl transition-transform ${selected === opt.value ? 'bg-white/20 scale-110' : 'bg-zinc-50 dark:bg-zinc-800'}`}>
                                    {opt.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] font-black uppercase tracking-widest leading-none">{opt.label}</span>
                                </div>
                                {selected === opt.value && (
                                    <div className="ml-auto mr-2 w-2 h-2 rounded-full bg-current animate-pulse" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const MoneyTrackerLayout: React.FC<MoneyTrackerLayoutProps> = ({
  transactions,
  subscriptions,
  userProfile,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onAddSubscription,
  onUpdateSubscription,
  onDeleteSubscription
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'stats' | 'subs'>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [searchApp, setSearchApp] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const balance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
    const todayExpenses = transactions
      .filter(t => t.date.startsWith(today) && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const todayIncome = transactions
      .filter(t => t.date.startsWith(today) && t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    
    return { balance, todayExpenses, todayIncome };
  }, [transactions, today]);

  const groupedTransactions = useMemo(() => {
      const groups: Record<string, Transaction[]> = {};
      transactions.forEach(t => {
          const date = t.date.split('T')[0];
          if (!groups[date]) groups[date] = [];
          groups[date].push(t);
      });
      return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [transactions]);

  const categoryStats = useMemo(() => {
      const stats: Record<string, number> = {};
      transactions.filter(t => t.type === 'expense').forEach(t => {
          stats[t.category] = (stats[t.category] || 0) + t.amount;
      });
      return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDayDiff = (dateStr: string) => {
      const target = new Date(dateStr);
      const diff = target.getTime() - new Date().getTime();
      return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const upcomingSub = useMemo(() => {
    return [...subscriptions]
        .filter(s => s.active)
        .sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate))[0];
  }, [subscriptions]);

  const getIconForApp = (name: string) => {
      const app = PRESET_APPS.find(a => name.toLowerCase().includes(a.name.toLowerCase()));
      return app ? app.icon : Bell;
  };

  const getColorsForApp = (name: string) => {
      const app = PRESET_APPS.find(a => name.toLowerCase().includes(a.name.toLowerCase()));
      return app ? { color: app.color, bg: app.bg } : { color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' };
  };

  const renderToday = () => {
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString('id-ID', dateOptions);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header className="flex items-center justify-between">
            <div>
                 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{dateStr}</div>
                 <h2 className="text-3xl md:text-4xl font-bold serif italic text-zinc-900 dark:text-zinc-100">
                     Halo, {userProfile?.name?.split(' ')[0] || 'Friend'}.
                 </h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-transform hover:rotate-12">
                <Wallet size={20} />
            </div>
        </header>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-8 shadow-2xl transition-all hover:scale-[1.01] active:scale-0.99 group">
             <div className="absolute top-0 right-0 p-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform group-hover:scale-110" />
             <div className="relative z-10 flex flex-col gap-6">
                 <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 text-emerald-100 dark:text-emerald-900">Saldo Saat Ini</h3>
                    <div className="text-4xl md:text-5xl font-bold serif italic mt-2 tabular-nums tracking-tight">
                        {formatCurrency(stats.balance)}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 dark:border-black/5">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1 text-emerald-100 dark:text-emerald-900">
                            <ArrowUpCircle size={10} className="text-emerald-400 dark:text-emerald-600" /> Masuk Hari Ini
                        </span>
                        <div className="text-sm font-bold mt-1 tabular-nums text-emerald-400 dark:text-emerald-600">
                            + {formatCurrency(stats.todayIncome)}
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 flex items-center gap-1 text-emerald-100 dark:text-emerald-900">
                            <ArrowDownCircle size={10} className="text-rose-400 dark:text-rose-600" /> Keluar Hari Ini
                        </span>
                        <div className="text-sm font-bold mt-1 tabular-nums text-rose-400 dark:text-rose-600">
                            - {formatCurrency(stats.todayExpenses)}
                        </div>
                    </div>
                 </div>
             </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => { setTransactionType('expense'); setEditingTransaction(null); setIsAddModalOpen(true); }}
                className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all active:scale-95 group border border-zinc-100/50 dark:border-zinc-800/50 hover:shadow-xl hover:shadow-rose-500/5"
            >
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/30 rounded-3xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform shadow-sm">
                    <ArrowDownCircle size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catat Keluar</span>
            </button>
            <button 
                onClick={() => { setTransactionType('income'); setEditingTransaction(null); setIsAddModalOpen(true); }}
                className="glass p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all active:scale-95 group border border-zinc-100/50 dark:border-zinc-800/50 hover:shadow-xl hover:shadow-emerald-500/5"
            >
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform shadow-sm">
                    <ArrowUpCircle size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catat Masuk</span>
            </button>
        </div>

        {/* Subscription Reminder - Enhanced */}
        {upcomingSub && (
            <div 
                className="relative overflow-hidden p-6 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white dark:bg-zinc-900" 
                onClick={() => setActiveTab('subs')}
            >
                <div className={`absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity ${getColorsForApp(upcomingSub.name).bg}`} />
                <div className="flex items-center gap-5 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500 ${getColorsForApp(upcomingSub.name).bg} ${getColorsForApp(upcomingSub.name).color}`}>
                        {React.createElement(getIconForApp(upcomingSub.name), { size: 28 })}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full">Reminder</span>
                            <span className="text-[10px] font-bold text-zinc-400 italic">dalam {getDayDiff(upcomingSub.nextBillingDate)} hari</span>
                        </div>
                        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 serif italic mt-1">{upcomingSub.name} Premium</div>
                        <div className="text-xs font-bold text-zinc-400 mt-0.5">{formatCurrency(upcomingSub.amount)} / bulan</div>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:text-white dark:group-hover:text-zinc-900 transition-all">
                    <ChevronRight size={18} />
                </div>
            </div>
        )}

        {/* Recent Transactions Snippet */}
        <div className="space-y-4 pb-20">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400/60">Transaksi Terakhir</h3>
                <button onClick={() => setActiveTab('history')} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 transition-colors flex items-center gap-1">Lihat Semua <ChevronRight size={10} /></button>
            </div>
            {transactions.length > 0 ? (
                <div className="space-y-3">
                    {transactions.slice(0, 5).map(t => (
                        <div key={t.id} className="glass p-4 rounded-[2.5rem] flex items-center justify-between group border border-zinc-100/10 hover:border-zinc-100 dark:hover:border-zinc-800 transition-all hover:translate-x-1 duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center shadow-sm ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-500'}`}>
                                    {t.type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                                </div>
                                <div className="cursor-pointer" onClick={() => { setTransactionType(t.type); setEditingTransaction(t); setIsAddModalOpen(true); }}>
                                    <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200 leading-tight">{t.description}</div>
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1">{t.category}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pr-2">
                                <div className={`font-bold tabular-nums text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                </div>
                                <button 
                                    onClick={() => onDeleteTransaction(t.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl text-zinc-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center glass rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed opacity-30 italic serif text-lg">Hening. Belum ada aktivitas keuangan hari ini.</div>
            )}
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-24">
            <header className="space-y-2">
                 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Financial Journey</div>
                 <h2 className="text-4xl font-bold serif italic text-zinc-900 dark:text-zinc-100">Aliran Dana.</h2>
                 <p className="text-zinc-400 italic serif">Setiap angka menceritakan sebuah perjalanan.</p>
            </header>

            <div className="space-y-12">
                {groupedTransactions.map(([date, items]) => {
                    const dateObj = new Date(date);
                    const formattedDate = dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
                    const isToday = date === today;
                    
                    return (
                        <div key={date} className="space-y-4">
                            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 ${isToday ? 'text-emerald-500' : 'text-zinc-400'}`}>
                                {isToday ? 'Hari Ini' : formattedDate}
                            </h3>
                            <div className="space-y-3">
                                {items.map(t => (
                                    <div key={t.id} className="glass p-5 rounded-[2.5rem] flex items-center justify-between group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all hover:bg-white/90 dark:hover:bg-zinc-800/90 shadow-sm">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-[1.75rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${t.type === 'income' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 shadow-zinc-900/10'}`}>
                                                {t.type === 'income' ? <ArrowUpCircle size={28} /> : <Zap size={28} className="opacity-40" />}
                                            </div>
                                            <div className="cursor-pointer" onClick={() => { setTransactionType(t.type); setEditingTransaction(t); setIsAddModalOpen(true); }}>
                                                <div className="font-bold text-xl serif italic text-zinc-800 dark:text-zinc-200 leading-tight">{t.description}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600 mt-1.5 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                                                    {t.category}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-3">
                                                <div className={`text-xl font-bold tabular-nums ${t.type === 'income' ? 'text-emerald-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button 
                                                    onClick={() => { setTransactionType(t.type); setEditingTransaction(t); setIsAddModalOpen(true); }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => onDeleteTransaction(t.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  const renderStats = () => {
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-24">
            <header className="space-y-2">
                 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Financial Analysis</div>
                 <h2 className="text-4xl font-bold serif italic">Insight Keuangan.</h2>
                 <p className="text-zinc-400 italic serif">Memetakan energi melalui pengeluaran.</p>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <div className="glass p-10 rounded-[3rem] space-y-10 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-24 bg-zinc-900/5 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 relative z-10">Kebutuhan vs Keinginan</h4>
                    <div className="space-y-8 relative z-10">
                        {categoryStats.length > 0 ? categoryStats.map(([cat, amt]) => (
                            <div key={cat} className="space-y-3">
                                <div className="flex justify-between items-end px-1">
                                    <span className="font-bold serif italic text-xl text-zinc-800 dark:text-zinc-200">{cat}</span>
                                    <span className="text-sm font-bold text-zinc-400 tabular-nums">{formatCurrency(amt)}</span>
                                </div>
                                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
                                    <div 
                                        className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-1000 rounded-full shadow-lg shadow-black/10" 
                                        style={{ width: `${(amt / totalExpense) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-16 opacity-30 italic serif text-xl">Belum ada data visualisasi.</div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900 dark:bg-zinc-100 p-12 rounded-[3.5rem] text-white dark:text-zinc-900 flex justify-between items-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000" />
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Financial health Index</h4>
                        <div className="text-4xl font-bold serif italic mt-3">Sangat Sehat</div>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-50">Pengeluaran terdistribusi dengan baik</p>
                    </div>
                    <div className="w-20 h-20 bg-white/10 dark:bg-black/5 rounded-full flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform duration-500">
                        <TrendingUp size={40} className="relative z-10" />
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderSubs = () => {
      const activeSubs = subscriptions.filter(s => s.active);
      const totalMonthlySub = activeSubs.reduce((acc, curr) => acc + (curr.billingCycle === 'monthly' ? curr.amount : curr.amount / 12), 0);

      return (
          <div className="space-y-12 animate-in fade-in duration-700 pb-32">
               <header className="flex justify-between items-end px-2">
                    <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Recurring Values</div>
                        <h2 className="text-4xl font-bold serif italic">Berlangganan.</h2>
                        <p className="text-zinc-400 italic serif">Alat yang membantumu bertumbuh.</p>
                    </div>
                    <button 
                        onClick={() => { setEditingSub(null); setIsSubModalOpen(true); }}
                        className="w-16 h-16 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-zinc-500/10 hover:scale-105 active:scale-95 transition-all group"
                    >
                        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
               </header>

               <div className="glass p-8 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
                   <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Monthly Cost</div>
                       <div className="text-3xl font-bold serif italic text-zinc-900 dark:text-zinc-100 mt-1">{formatCurrency(totalMonthlySub)}</div>
                   </div>
                   <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-500">
                        <Zap size={24} />
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {subscriptions.length > 0 ? subscriptions.map(sub => (
                       <div key={sub.id} className="glass p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 space-y-6 group hover:translate-y-[-8px] transition-all relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl duration-500">
                           <div className={`absolute top-0 right-0 p-16 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-10 transition-opacity ${getColorsForApp(sub.name).bg}`} />
                           
                           <div className="space-y-6">
                               <div className="flex justify-between items-start relative z-10">
                                   <div className={`w-16 h-16 rounded-[1.75rem] flex items-center justify-center shadow-lg transition-all duration-700 ${getColorsForApp(sub.name).bg} ${getColorsForApp(sub.name).color} group-hover:rotate-6 group-hover:scale-110`}>
                                       {React.createElement(getIconForApp(sub.name), { size: 32 })}
                                   </div>
                                   <div className="flex items-center gap-1">
                                       <button 
                                            onClick={() => { setEditingSub(sub); setIsSubModalOpen(true); }}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                                        >
                                            <Edit2 size={16} />
                                       </button>
                                       <button 
                                            onClick={() => onDeleteSubscription(sub.id)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                       </button>
                                   </div>
                               </div>

                               <div className="space-y-2 relative z-10">
                                    <h3 className="text-2xl font-bold serif italic text-zinc-900 dark:text-zinc-100 leading-tight pr-4">{sub.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${sub.active ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-500'}`}>{sub.active ? 'Aktif' : 'Nonaktif'}</span>
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{sub.category}</span>
                                    </div>
                               </div>
                           </div>

                           <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
                               <div className="flex justify-between items-end">
                                   <div>
                                       <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{sub.billingCycle === 'monthly' ? 'Bulanan' : 'Tahunan'}</div>
                                       <div className="text-xl font-bold tabular-nums text-zinc-800 dark:text-zinc-200">{formatCurrency(sub.amount)}</div>
                                   </div>
                                   <div className="text-right">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-1">Tagihan</div>
                                        <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 italic bg-white dark:bg-zinc-800 px-3 py-1 rounded-full shadow-sm ring-1 ring-black/5">{sub.nextBillingDate}</div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   )) : (
                       <div className="md:col-span-2 py-24 text-center glass rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 border-dashed opacity-30 italic serif text-2xl">Mulai petualangan digitalmu dengan mencatat langganan pertama.</div>
                   )}
               </div>
          </div>
      );
  };

  return (
    <div className="relative min-h-screen px-6 max-w-2xl mx-auto pt-10 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900">
      <Link href="/" className="absolute top-10 left-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors z-[80]">
        <ArrowLeft size={20} />
      </Link>
      
      <div className="h-10" />

      <main className="mb-32 px-1">
        {activeTab === 'today' && renderToday()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'subs' && renderSubs()}
      </main>

      {/* Internal Bottom Bar - Slim & Premium */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-8 z-[90]">
        <div className="glass shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-2 flex justify-between items-center border border-white/40 dark:border-white/5 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl ring-1 ring-black/5">
            {[
                { id: 'today', icon: Wallet, label: 'Today' },
                { id: 'history', icon: History, label: 'Journal' },
                { id: 'stats', icon: PieChart, label: 'Insight' },
                { id: 'subs', icon: Bell, label: 'Recur' }
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center justify-center flex-1 py-3.5 rounded-[2rem] transition-all duration-500 gap-1.5 ${activeTab === tab.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xl scale-[1.05] -translate-y-1' : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:scale-105'}`}
                >
                    <tab.icon size={20} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                </button>
            ))}
        </div>
      </nav>

      {/* Modal Transaction */}
      {(isAddModalOpen || editingTransaction) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-2xl transition-opacity animate-in fade-in" onClick={() => { setIsAddModalOpen(false); setEditingTransaction(null); }} />
              <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[4rem] p-12 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-white/5 overflow-visible">
                  <header className="mb-10 text-center">
                    <h3 className="text-4xl font-bold serif italic text-zinc-900 dark:text-zinc-100">{editingTransaction ? 'Ubah Catatan' : (transactionType === 'expense' ? 'Pengeluaran' : 'Pemasukan')}</h3>
                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">{editingTransaction ? 'Sesuaikan detail transaksi.' : (transactionType === 'expense' ? 'Catat pengeluaran harianmu.' : 'Catat pemasukan yang kamu terima.')}</p>
                  </header>
                  <form className="space-y-8 overflow-visible" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const amount = Math.abs(parseFloat(formData.get('amount') as string || '0'));
                      const description = formData.get('description') as string;
                      const category = formData.get('category') as string;
                      const date = new Date(formData.get('date') as string).toISOString();

                      const transactionData = {
                          type: transactionType,
                          amount,
                          description,
                          category,
                          date
                      };

                      if (editingTransaction) {
                          onUpdateTransaction(editingTransaction.id, transactionData);
                      } else {
                          onAddTransaction(transactionData);
                      }
                      setIsAddModalOpen(false);
                      setEditingTransaction(null);
                  }}>
                      <div className="space-y-3 text-center">
                        <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.3em]">Besaran (IDR)</label>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-black text-zinc-300">Rp</span>
                            <input 
                                name="amount" 
                                type="number" 
                                autoFocus 
                                defaultValue={editingTransaction?.amount}
                                placeholder="0" 
                                className={`w-full text-6xl text-center font-black bg-transparent outline-none border-none tabular-nums tracking-tighter ${transactionType === 'expense' ? 'text-zinc-900 dark:text-zinc-100' : 'text-emerald-500 px-4'}`} 
                                required 
                            />
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                             <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Keterangan</label>
                             <input name="description" defaultValue={editingTransaction?.description} placeholder="Makan siang, Bensin..." className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[2rem] text-xl font-bold serif italic outline-none border-none focus:ring-4 focus:ring-emerald-500/5 transition-all dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-white/10" required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Kategori</label>
                                <PremiumSelect 
                                    name="category" 
                                    options={transactionType === 'expense' ? TRANSACTION_CATEGORIES.expense : TRANSACTION_CATEGORIES.income} 
                                    defaultValue={editingTransaction?.category} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Tanggal</label>
                                <input 
                                    name="date" 
                                    type="date" 
                                    defaultValue={editingTransaction ? editingTransaction.date.split('T')[0] : today}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[1.75rem] text-[11px] font-black outline-none border-none focus:ring-4 focus:ring-emerald-500/5 transition-all dark:text-zinc-100"
                                    required 
                                />
                            </div>
                        </div>
                      </div>

                      <button type="submit" className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 ${transactionType === 'expense' ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-zinc-900/20' : 'bg-emerald-500 text-white shadow-emerald-500/30'}`}>
                          {editingTransaction ? 'Simpan' : 'Rekam Transaksi'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Modal Subscription with Presets */}
      {(isSubModalOpen || editingSub) && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-2xl transition-opacity animate-in fade-in" onClick={() => { setIsSubModalOpen(false); setEditingSub(null); }} />
                <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-[4rem] p-12 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/5 overflow-visible">
                    {!editingSub && !searchApp && (
                        <div className="mb-10 space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">Pilih Apps Populer</h4>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                {PRESET_APPS.map(app => (
                                    <button 
                                        key={app.name} 
                                        onClick={() => {
                                            setSearchApp(app.name);
                                        }}
                                        className="flex flex-col items-center gap-2 group p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-active:scale-95 transition-all ${app.bg} ${app.color}`}>
                                            <app.icon size={24} />
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-tight text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 text-center leading-tight truncate w-full">{app.name}</span>
                                    </button>
                                ))}
                                <button className="flex flex-col items-center gap-2 group p-2 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all" onClick={() => setSearchApp('Custom')}>
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:scale-110 transition-all">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-tight text-zinc-400 group-hover:text-zinc-600 text-center">Lainnya</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {(editingSub || searchApp) && (
                        <>
                            <header className="mb-10 text-center relative">
                                {!editingSub && (
                                    <button onClick={() => setSearchApp('')} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                                        <ArrowLeft size={18} />
                                    </button>
                                )}
                                <h3 className="text-4xl font-bold serif italic text-zinc-900 dark:text-zinc-100">{editingSub ? 'Ubah Plan.' : 'Plan Baru.'}</h3>
                                <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Detail langganan yang kamu inginkan.</p>
                            </header>
                            <form className="space-y-8" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const amount = Math.abs(parseFloat(formData.get('amount') as string || '0'));
                                const name = formData.get('name') as string;
                                const category = formData.get('category') as string;
                                const billingCycle = formData.get('billingCycle') as any;
                                const nextBillingDate = formData.get('nextBillingDate') as string;

                                const subData = {
                                    name: name === 'Custom' ? formData.get('customName') as string : name,
                                    amount,
                                    category,
                                    billingCycle,
                                    nextBillingDate,
                                    active: true
                                };

                                if (editingSub) {
                                    onUpdateSubscription(editingSub.id, subData);
                                } else {
                                    onAddSubscription(subData);
                                }
                                setIsSubModalOpen(false);
                                setEditingSub(null);
                                setSearchApp('');
                            }}>
                                <div className="space-y-3 text-center">
                                    <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.3em]">Besaran (IDR)</label>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-2xl font-black text-zinc-300">Rp</span>
                                        <input 
                                            name="amount" 
                                            type="number" 
                                            autoFocus 
                                            defaultValue={editingSub?.amount}
                                            placeholder="0" 
                                            className="w-full text-6xl text-center font-black bg-transparent outline-none border-none tabular-nums tracking-tighter text-zinc-900 dark:text-zinc-100" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Nama Program / App</label>
                                        <input 
                                            name="name" 
                                            type="hidden"
                                            value={searchApp !== 'Custom' ? (searchApp || editingSub?.name) : 'Custom'} 
                                        />
                                        { (searchApp === 'Custom' || (!searchApp && !editingSub)) ? (
                                             <input 
                                                name="customName" 
                                                defaultValue={editingSub?.name} 
                                                placeholder="Nama Langganan..." 
                                                className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[2rem] text-xl font-bold serif italic outline-none border-none focus:ring-4 focus:ring-indigo-500/5 transition-all dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-white/10" 
                                                required 
                                            />
                                        ) : (
                                            <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 p-6 rounded-[2.5rem] flex items-center gap-4 border border-indigo-500/10">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorsForApp(searchApp || editingSub?.name || '').bg} ${getColorsForApp(searchApp || editingSub?.name || '').color}`}>
                                                    {React.createElement(getIconForApp(searchApp || editingSub?.name || ''), { size: 24 })}
                                                </div>
                                                <span className="text-xl font-bold serif italic text-zinc-800 dark:text-zinc-200">{searchApp || editingSub?.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Kategori</label>
                                            <PremiumSelect 
                                                name="category" 
                                                options={SUBSCRIPTION_CATEGORIES} 
                                                defaultValue={editingSub?.category || (searchApp !== 'Custom' ? PRESET_APPS.find(a => a.name === searchApp)?.category : 'Entertainment')} 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Siklus</label>
                                            <PremiumSelect 
                                                name="billingCycle" 
                                                options={BILLING_CYCLES} 
                                                defaultValue={editingSub?.billingCycle || 'monthly'} 
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] px-4">Tanggal Tagihan Berikutnya</label>
                                        <input 
                                            name="nextBillingDate" 
                                            type="date" 
                                            defaultValue={editingSub ? editingSub.nextBillingDate : today}
                                            className="w-full bg-zinc-50 dark:bg-zinc-800 p-6 rounded-[1.75rem] text-[11px] font-black outline-none border-none focus:ring-4 focus:ring-indigo-500/5 transition-all dark:text-zinc-100"
                                            required 
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-7 rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-6 shadow-indigo-500/10">
                                    {editingSub ? 'Simpan' : 'Aktifkan Plan'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
           </div>
      )}
    </div>
  );
};
