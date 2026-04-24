import Head from 'next/head';
import { useBrandTheme } from '@/hooks/useBrandTheme';
import { Users, Receipt, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { brand } = useBrandTheme();
  const brandName = brand === 'escot' ? 'エスコット' : 'かきつばた';

  return (
    <>
      <Head>
        <title>ダッシュボード | EK-Link</title>
      </Head>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{brandName} ダッシュボード</h1>
          <p className="text-slate-500 mt-1">本日の業務サマリーと重要指標</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <Users className="w-32 h-32 text-primary" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">新規問い合わせ</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">12</h3>
                <span className="text-xs font-semibold text-emerald-500 px-1.5 py-0.5 bg-emerald-50 rounded-full">+2 今回</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-orange-500/30 hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <Receipt className="w-32 h-32 text-orange-500" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                <Receipt className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">今月の未発送請求書</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">3</h3>
                <span className="text-sm font-medium text-slate-400">件</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all relative overflow-hidden group">
             <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <TrendingUp className="w-32 h-32 text-primary" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">今月の入塾率</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">68%</h3>
                <span className="text-xs font-semibold text-emerald-500 px-1.5 py-0.5 bg-emerald-50 rounded-full">+5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all relative overflow-hidden group">
             <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <Calendar className="w-32 h-32 text-primary" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">予定されている面談</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-slate-900">8</h3>
                <span className="text-sm font-medium text-slate-400">件 (今週)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
