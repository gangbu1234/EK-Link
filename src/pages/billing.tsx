import { useState } from 'react';
import Head from 'next/head';
import InvoiceTable from '@/components/billing/InvoiceTable';
import AddInvoiceModal from '@/components/billing/AddInvoiceModal';
import { Receipt, Plus, RefreshCcw } from 'lucide-react';
import useSWR from 'swr';
import { Invoice } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function BillingPage() {
  const { data, error, mutate } = useSWR<Invoice[]>('/api/invoices', fetcher);
  const [showModal, setShowModal] = useState(false);
  const [resetting, setResetting] = useState(false);

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
        
        {error ? (
          <div className="text-rose-500 bg-rose-50 p-4 rounded-xl">読み込みエラーが発生しました。</div>
        ) : !data ? (
          <div className="text-slate-500 p-4 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <InvoiceTable data={data} onUpdate={() => mutate()} />
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
