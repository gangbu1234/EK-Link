import { Bell, Search, Menu, X, Users, Receipt, Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useBrandTheme } from '@/hooks/useBrandTheme';
import useSWR from 'swr';
import { Invoice, Inquiry } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { brandFilter } = useBrandTheme();
  const { data: invoices } = useSWR<Invoice[]>('/api/invoices', fetcher);
  const { data: leads } = useSWR<Inquiry[]>('/api/leads', fetcher);
  const [isOpen, setIsOpen] = useState(false);
  
  // 統計・アラートの計算
  const isAfter20th = new Date().getDate() > 20;

  // ① 問い合わせ対応中 (入塾、追わない 以外)
  const activeLeadsCount = Array.isArray(leads) 
    ? leads.filter(l => (brandFilter === 'all' || l.brand === brandFilter) && l.status !== '入塾決定' && l.status !== '追わない').length 
    : 0;

  // ② 発送済以外
  const unmailedInvoicesCount = Array.isArray(invoices) 
    ? invoices.filter(i => (brandFilter === 'all' || i.brand === brandFilter) && i.status !== '発送確認済').length 
    : 0;

  // ③ 日程決め遅延 (20日以降の日程決め)
  const delayScheduleCount = isAfter20th && Array.isArray(invoices)
    ? invoices.filter(i => (brandFilter === 'all' || i.brand === brandFilter) && i.status === '日程決め').length
    : 0;

  const totalAlerts = activeLeadsCount + unmailedInvoicesCount + delayScheduleCount;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center md:hidden">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 hover:text-slate-700">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4 ml-auto">
        {/* 通知ベルとポップアップ */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* ポップアップメニュー */}
          {isOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                    重要アラート
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    計 {totalAlerts}
                  </span>
                </div>
                <div className="p-2 space-y-1">
                  <div className="p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Users className="w-4 h-4" /></div>
                      <div className="text-xs font-bold text-slate-700">問い合わせ対応中</div>
                    </div>
                    <div className="text-sm font-black text-slate-400 group-hover:text-blue-600 transition-colors">{activeLeadsCount}名</div>
                  </div>
                  
                  <div className="p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Receipt className="w-4 h-4" /></div>
                      <div className="text-xs font-bold text-slate-700">未発送 (進行中)</div>
                    </div>
                    <div className="text-sm font-black text-slate-400 group-hover:text-amber-600 transition-colors">{unmailedInvoicesCount}件</div>
                  </div>

                  {isAfter20th && delayScheduleCount > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50 flex items-center justify-between group border border-rose-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500 text-white rounded-lg"><Calendar className="w-4 h-4" /></div>
                        <div>
                          <div className="text-xs font-bold text-rose-800">日程決め 遅延</div>
                          <div className="text-[10px] text-rose-600">至急入力してください</div>
                        </div>
                      </div>
                      <div className="text-sm font-black text-rose-600">{delayScheduleCount}件</div>
                    </div>
                  )}

                  {totalAlerts === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs">現在アラートはありません</div>
                  )}
                </div>
                <div className="bg-slate-50 p-3 text-center border-t border-slate-50">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-semibold text-sm shadow-sm"
             style={{ backgroundImage: `linear-gradient(to top right, var(--color-primary), var(--color-primary-light))` }}>
          A
        </div>
      </div>
    </header>
  );
}
