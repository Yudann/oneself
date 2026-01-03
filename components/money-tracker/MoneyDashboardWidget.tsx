import React from 'react';
import { Wallet, TrendingDown, ArrowRight } from 'lucide-react';

interface MoneyDashboardWidgetProps {
  transactions: any[];
  onNavigate: () => void;
}

export const MoneyDashboardWidget: React.FC<MoneyDashboardWidgetProps> = ({ transactions, onNavigate }) => {
  const balance = transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
  const today = new Date().toISOString().split('T')[0];
  const todayExpense = transactions
    .filter(t => t.date.startsWith(today) && t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div 
      onClick={onNavigate}
      className="glass p-8 rounded-[3rem] h-full flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-all relative overflow-hidden active:scale-95 shadow-md"
    >
        <div className="absolute top-0 right-0 p-16 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center text-white dark:text-zinc-900">
                    <Wallet size={18} />
                </div>
                <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
            </div>
            
            <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Saldo</h4>
                <div className="text-2xl font-bold serif italic text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {formatCurrency(balance)}
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 relative z-10">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
                    <TrendingDown size={14} />
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Pengeluaran Hari Ini</div>
                    <div className="text-sm font-bold text-rose-500 tabular-nums">{formatCurrency(todayExpense)}</div>
                </div>
            </div>
        </div>
    </div>
  );
};
