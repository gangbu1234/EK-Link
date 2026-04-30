import { useState } from 'react';
import Head from 'next/head';
import InvoiceTable from '@/components/billing/InvoiceTable';
import AddInvoiceModal from '@/components/billing/AddInvoiceModal';
import { Receipt, Plus, RefreshCcw, Search, Filter, FileText, Download, Copy } from 'lucide-react';
import useSWR from 'swr';
import { Invoice } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BillingPage() {
  const { data, error, mutate } = useSWR<Invoice[]>('/api/invoices', fetcher);
  const [showModal, setShowModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  
  // フィルタ状態
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [billingBrandFilter, setBillingBrandFilter] = useState('all');

  // 担当者一覧を動的に生成
  const assignees = Array.isArray(data) ? Array.from(new Set(data.map(i => i.assignee))).filter(Boolean).sort() : [];

  const filteredData = Array.isArray(data) ? data.filter(i => {
    // スペース（全角・半角）で分割してAND検索
    const searchWords = searchTerm.trim().split(/[\s　]+/).filter(w => w !== '');
    
    const matchesSearch = searchWords.every(word => {
      const w = word.toLowerCase();
      return (
        i.studentName.toLowerCase().includes(w) || 
        i.studentId?.toLowerCase().includes(w) ||
        i.assignee.toLowerCase().includes(w) ||
        i.status.toLowerCase().includes(w) ||
        (i.brand === 'escot' ? 'エスコット' : 'かきつばた').includes(w)
      );
    });

    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesAssignee = assigneeFilter === 'all' || i.assignee === assigneeFilter;
    const matchesBrand = billingBrandFilter === 'all' || i.brand === billingBrandFilter;
    
    return matchesSearch && matchesStatus && matchesAssignee && matchesBrand;
  }) : [];

  const handleQuickFilter = (word: string) => {
    setSearchTerm(word);
    setStatusFilter('all');
    setAssigneeFilter('all');
    setBillingBrandFilter('all');
  };

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['塾生番号', '生徒名', '担当者', 'ステータス', 'ブランド', '最終発送日'];
    const rows = filteredData.map(i => [
      i.studentId || '',
      i.studentName,
      i.assignee,
      i.status,
      i.brand === 'escot' ? 'エスコット' : 'かきつばた',
      i.sentDate ? new Date(i.sentDate).toLocaleDateString('ja-JP') : ''
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `請求書管理_${new Date().toLocaleDateString('ja-JP')}.csv`;
    link.click();
  };

  const handleCopyText = () => {
    if (filteredData.length === 0) return;
    const text = filteredData.map(i => 
      `${i.studentId || ''}\t${i.studentName}\t${i.status}\t${i.assignee}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    alert('一覧をコピーしました。');
  };

  const handleAllReset = async () => {
    if (!confirm('すべての請求書のステータスを「日程決め」にリセットしますか？')) return;
    
    setResetting(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all' }),
      });
      if (!res.ok) throw new Error('Reset failed');
      await mutate();
      alert('すべてのステータスをリセットしました。');
    } catch (e) {
      console.error(e);
      alert('リセットに失敗しました。');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <Head>
        <title>請求書管理 | EK-Link</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-inner">
                <Receipt className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">請求書管理</h1>
            </div>
            <p className="text-slate-500 text-sm mt-2">毎月の請求書作成から発送までのステータス管理</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAllReset}
              disabled={resetting || !data || data.length === 0}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg font-medium transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
              オールリセット
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4" />
              新規追加
            </button>
          </div>
        </div>

        {/* ツールバー */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* ブランドフィルタ */}
            <select
              value={billingBrandFilter}
              onChange={e => setBillingBrandFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none min-w-[120px]"
            >
              <option value="all">全ブランド</option>
              <option value="escot">エスコット</option>
              <option value="kakitsubata">かきつばた</option>
            </select>

            {/* 担当者フィルタ */}
            <select
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none min-w-[120px]"
            >
              <option value="all">全担当者</option>
              {assignees.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            {/* ステータスフィルタ */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none min-w-[140px]"
            >
              <option value="all">全ステータス</option>
              <option value="日程決め">日程決め</option>
              <option value="日程回答待ち">日程回答待ち</option>
              <option value="請求書出力待ち">請求書出力待ち</option>
              <option value="請求書確認待ち">請求書確認待ち</option>
              <option value="請求書発送待ち">請求書発送待ち</option>
              <option value="発送確認済">発送確認済</option>
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors"
              title="一覧をコピー"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">コピー</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm transition-colors"
              title="CSV出力"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
        
        {error ? (
          <div className="text-rose-500 bg-rose-50 p-4 rounded-xl">読み込みエラーが発生しました。</div>
        ) : !data ? (
          <div className="text-slate-500 p-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <InvoiceTable 
            data={filteredData} 
            onUpdate={() => mutate()} 
            onQuickFilter={handleQuickFilter}
          />
        )}
      </div>

      {showModal && (
        <AddInvoiceModal
          onClose={() => setShowModal(false)}
          onSaved={() => mutate()}
        />
      )}
    </>
  );
}
