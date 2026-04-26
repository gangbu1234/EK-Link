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
  
  const newLeadsCount = brandLeads.filter(l => l.status === '新規問い合わせ').length;
  const unmailedInvoicesCount = brandInvoices.filter(i => i.status !== '発送確認済').length;

  const getStatusCount = (status: InvoiceStatus) => brandInvoices.filter(i => i.status === status).length;

  const invoiceStats = [
    { label: '日程決め', count: getStatusCount('日程決め'), icon: <Calendar className="w-4 h-4" />, color: 'bg-slate-100 text-slate-600' },
    { label: '回答待ち', count: getStatusCount('日程回答待ち'), icon: <Clock className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' },
    { label: '出力待ち', count: getStatusCount('請求書出力待ち'), icon: <FileDown className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
    { label: '確認待ち', count: getStatusCount('請求書確認待ち'), icon: <Eye className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-600' },
    { label: '発送待ち', count: getStatusCount('請求書発送待ち'), icon: <Package className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' },
    { label: '発送済', count: getStatusCount('発送確認済'), icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ダッシュボード</h1>
        <p className="text-slate-500">現在の業務ステータスと概要</p>
      </div>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="新規問い合わせ" 
          value={newLeadsCount} 
          icon={<Users className="w-6 h-6" />} 
          color="bg-primary"
          trend="+2% 先週比"
        />
        <StatCard 
          title="未発送の請求書" 
          value={unmailedInvoicesCount} 
          icon={<ReceiptText className="w-6 h-6" />} 
          color="bg-[#1A2F4B]"
          trend="-5% 先週比"
        />
        <StatCard 
          title="本日の対応予定" 
          value="12" 
          icon={<TrendingUp className="w-6 h-6" />} 
          color="bg-emerald-500"
          trend="+3件 本日"
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
              <div className="text-xl font-bold text-slate-900">{stat.count}<span className="text-xs ml-0.5">名</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* 下段アラートなど */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            未対応アラート
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-rose-50 rounded-lg flex items-center justify-between">
              <div className="text-sm font-medium text-rose-800">回答待ち (3日以上経過)</div>
              <div className="text-sm font-bold text-rose-600">4名</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg flex items-center justify-between">
              <div className="text-sm font-medium text-amber-800">発送待ち</div>
              <div className="text-sm font-bold text-amber-600">{getStatusCount('請求書発送待ち')}名</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-slate-200`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-slate-900 leading-none">{value}</h3>
          <span className="text-xs font-semibold text-emerald-500 pb-1">{trend}</span>
        </div>
      </div>
    </div>
  );
}
