import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/types';
import { Check, Calendar, FileText, Send } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';

interface Props {
  data: Invoice[];
  onUpdate: () => void;
}

export default function InvoiceTable({ data, onUpdate }: Props) {
  const { brand: activeBrand } = useBrandTheme();
  const [updating, setUpdating] = useState<string | null>(null);

  const toggleStatus = async (id: string, currentStatus: InvoiceStatus) => {
    setUpdating(id);
    try {
      let newStatus: InvoiceStatus = currentStatus;
      let sentDate: Date | null = null;

      if (currentStatus === '日程決め') {
        newStatus = '作成済み';
      } else if (currentStatus === '作成済み') {
        newStatus = '発送済み';
        sentDate = new Date();
      } else if (currentStatus === '発送済み') {
        newStatus = '日程決め';
        sentDate = null;
      }

      await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, sentDate })
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr?: Date | string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short', day: 'numeric'
    }).format(date);
  };

  const filteredData = data.filter(item => item.brand === activeBrand);

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case '日程決め': return <Calendar className="w-4 h-4 text-slate-400" />;
      case '作成済み': return <FileText className="w-4 h-4 text-blue-500" />;
      case '発送済み': return <Check className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">生徒名</th>
              <th className="px-4 py-3 whitespace-nowrap">対象月</th>
              <th className="px-4 py-3 whitespace-nowrap text-right">金額</th>
              <th className="px-4 py-3 whitespace-nowrap text-center">支払方法</th>
              <th className="px-4 py-3 whitespace-nowrap">ステータス</th>
              <th className="px-4 py-3 whitespace-nowrap">発送日</th>
              <th className="px-4 py-3 whitespace-nowrap text-right">アクション</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => {
              const isUpdating = updating === item.id;
              return (
                <tr key={item.id} className={`transition-colors hover:bg-slate-50/50 ${isUpdating ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                    {item.studentName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.targetMonth}</td>
                  <td className="px-4 py-3 text-slate-900 font-medium text-right">
                    ¥{item.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded-md font-medium ${
                      item.paymentMethod === '振込' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-purple-50 text-purple-700 border border-purple-100'
                    }`}>
                      {item.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`font-medium ${
                        item.status === '発送済み' ? 'text-emerald-600' : 
                        item.status === '作成済み' ? 'text-blue-600' : 'text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-sm">
                    {formatDate(item.sentDate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.status !== '発送済み' ? (
                      <button
                        disabled={isUpdating}
                        onClick={() => toggleStatus(item.id, item.status)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md text-xs font-semibold disabled:opacity-50"
                      >
                        {item.status === '日程決め' ? (
                          <>作成完了にする</>
                        ) : (
                          <><Send className="w-3.5 h-3.5" /> 発送済みにする</>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled={isUpdating}
                        onClick={() => toggleStatus(item.id, item.status)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors rounded-md text-xs font-semibold disabled:opacity-50"
                      >
                        リセット
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  該当ブランドのデータがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
