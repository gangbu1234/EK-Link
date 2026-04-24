import Head from 'next/head';
import InvoiceTable from '@/components/billing/InvoiceTable';
import { mockInvoices } from '@/data/mock';
import { Receipt } from 'lucide-react';

export default function BillingPage() {
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
          <button className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center">
            一括作成
          </button>
        </div>
        
        <InvoiceTable initialData={mockInvoices} />
      </div>
    </>
  );
}
