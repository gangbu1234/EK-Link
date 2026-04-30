import { Bell, Search, Menu } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';
import useSWR from 'swr';
import { Invoice } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { brandFilter } = useBrandTheme();
  const { data: invoices } = useSWR<Invoice[]>('/api/invoices', fetcher);
  
  const unmailedInvoicesCount = Array.isArray(invoices) 
    ? invoices.filter(i => (brandFilter === 'all' || i.brand === brandFilter) && i.status !== '発送確認済').length 
    : 0;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center md:hidden">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 hover:text-slate-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4 ml-auto">
        {/* Statistics Dashboard Item */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100">
          <span className="text-xs font-medium text-orange-800">未発送:</span>
          <span className="text-sm font-bold text-orange-600">{unmailedInvoicesCount}件</span>
        </div>

        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-semibold text-sm shadow-sm"
             style={{ backgroundImage: `linear-gradient(to top right, var(--color-primary), var(--color-primary-light))` }}>
          A
        </div>
      </div>
    </header>
  );
}
