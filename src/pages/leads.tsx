import Head from 'next/head';
import LeadTable from '@/components/leads/LeadTable';
import { mockInquiries } from '@/data/mock';
import { Users } from 'lucide-react';

export default function LeadsPage() {
  return (
    <>
      <Head>
        <title>問い合わせ管理 | EK-Link</title>
      </Head>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">問い合わせ管理</h1>
            </div>
            <p className="text-slate-500 text-sm mt-2">リード状況の進捗管理と対応アラートの確認</p>
          </div>
          <button className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center">
            + 新規追加
          </button>
        </div>
        
        <LeadTable initialData={mockInquiries} />
      </div>
    </>
  );
}
