// Force rebuild - 2026-04-26
import { useBrandTheme } from '@/hooks/useBrandTheme';
import { Users, ReceiptText, TrendingUp, AlertCircle, Clock, FileDown, Eye, Package, CheckCircle2, Calendar } from 'lucide-react';
import useSWR from 'swr';
import { Inquiry, Invoice, InvoiceStatus } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { brandFilter } = useBrandTheme();
  const { data: leads } = useSWR<Inquiry[]>('/api/leads', fetcher);
  const { data: invoices } = useSWR<Invoice[]>('/api/invoices', fetcher);

  const brandLeads = Array.isArray(leads) ? (brandFilter === 'all' ? leads : leads.filter(l => l.brand === brandFilter)) : [];
  const brandInvoices = Array.isArray(invoices) ? (brandFilter === 'all' ? invoices : invoices.filter(i => i.brand === brandFilter)) : [];
  
  const activeLeadsCount = brandLeads.filter(l => l.status !== '入塾決定' && l.status !== '追わない').length;
  const getUniqueCount = (items: Invoice[]) => {
    const uniqueIds = new Set(items.map(i => i.studentId?.split('-')[0] || i.id));
    return uniqueIds.size;
  };

  const getStatusCounts = (status: InvoiceStatus) => {
    const items = brandInvoices.filter(i => i.status === status);
    return {
      unique: getUniqueCount(items),
      total: items.length
    };
  };

  const unmailedInvoices = brandInvoices.filter(i => i.status !== '発送確認済');
  const unmailedStats = {
    unique: getUniqueCount(unmailedInvoices),
    total: unmailedInvoices.length
  };

  const invoiceStats = [
    { label: '日程決め', stats: getStatusCounts('日程決め'), icon: <Calendar className="w-4 h-4" />, color: 'bg-slate-100 text-slate-600' },
    { label: '回答待ち', stats: getStatusCounts('日程回答待ち'), icon: <Clock className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' },
    { label: '出力待ち', stats: getStatusCounts('請求書出力待ち'), icon: <FileDown className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
    { label: '確認待ち', stats: getStatusCounts('請求書確認待ち'), icon: <Eye className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-600' },
    { label: '発送待ち', stats: getStatusCounts('請求書発送待ち'), icon: <Package className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
    { label: '発送済', stats: getStatusCounts('発送確認済'), icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
        <p className="text-slate-500">現在の業務ステータスと概要</p>
      </div>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="問い合わせ対応中" 
          value={activeLeadsCount} 
          icon={<Users className="w-6 h-6" />} 
          color="bg-primary"
          trend="全ブランド合計"
        />
        <StatCard 
          title="未発送の請求書" 
          value={`${unmailedStats.unique}名`}
          subValue={`(のべ${unmailedStats.total}件)`}
          icon={<ReceiptText className="w-6 h-6" />} 
          color="bg-[#1A2F4B]"
          trend="発送フロー進行中"
        />
      </div>

      {/* 請求書ステータス内訳 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-primary" />
            請求書 進行状況内訳
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {invoiceStats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className={`w-10 h-10 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-xs font-medium text-slate-500 mb-1">{stat.label}</div>
              <div className="text-lg font-bold text-slate-900">{stat.stats.unique}<span className="text-xs ml-0.5">名</span></div>
              <div className="text-[10px] text-slate-400 font-medium">(のべ{stat.stats.total}件)</div>
            </div>
          ))}
        </div>
      </div>

      {/* 下段アラートなど */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            重要アラート
          </h2>
          <div className="space-y-3">
            {/* 毎月20日を過ぎた場合のみ「日程決め」ステータスの人数を表示 */}
            {new Date().getDate() > 20 ? (
              getStatusCounts('日程決め').total > 0 ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-rose-600" />
                    <div>
                      <div className="text-sm font-bold text-rose-800">【至急】日程決め 未着手</div>
                      <div className="text-xs text-rose-600">20日を過ぎています。速やかに日程回答の入力を進めてください。</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-rose-600">{getStatusCounts('日程決め').unique}<span className="text-xs ml-1 font-bold">名</span></div>
                    <div className="text-[10px] text-rose-500 font-bold">(のべ{getStatusCounts('日程決め').total}件)</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <div className="text-sm font-bold">今月の日程決めはすべて完了しています。</div>
                </div>
              )
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 text-slate-500">
                <Clock className="w-5 h-5" />
                <div className="text-sm">20日まではアラートは表示されません。</div>
              </div>
            )}
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-amber-800">
                <Package className="w-5 h-5" />
                <div className="text-sm font-bold text-amber-900">発送待ち（最終確認をお願いします）</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-700">{getStatusCounts('請求書発送待ち').unique}名</div>
                <div className="text-[10px] text-amber-600 font-bold">(のべ{getStatusCounts('請求書発送待ち').total}件)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-slate-200`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-slate-900 leading-none">{value}</h3>
          {subValue && <span className="text-xs font-bold text-slate-400">{subValue}</span>}
        </div>
        <div className="mt-1 text-xs font-semibold text-emerald-500">{trend}</div>
      </div>
    </div>
  );
}
