import React, { useState } from 'react';
import { Inquiry, LeadStatus } from '@/types';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';

const STATUS_OPTIONS: LeadStatus[] = [
  '新規問い合わせ',
  '初メール送付済',
  '面談・体験授業待ち',
  '体験後メール送付済',
  '入塾決定'
];

interface Props {
  initialData: Inquiry[];
}

export default function LeadTable({ initialData }: Props) {
  const [data, setData] = useState<Inquiry[]>(initialData);
  const { brand: activeBrand } = useBrandTheme();

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus, updatedAt: new Date() };
      }
      return item;
    }));
  };

  const isAlert = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff > 72 * 60 * 60 * 1000; // 3 days
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const filteredData = data.filter(item => item.brand === activeBrand);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">氏名</th>
              <th className="px-4 py-3 whitespace-nowrap">連絡先</th>
              <th className="px-4 py-3 whitespace-nowrap">希望科目</th>
              <th className="px-4 py-3 whitespace-nowrap">担当予定者</th>
              <th className="px-4 py-3 whitespace-nowrap">最終更新日</th>
              <th className="px-4 py-3 whitespace-nowrap">ステータス</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((item) => {
              const alert = isAlert(item.updatedAt);
              return (
                <tr 
                  key={item.id} 
                  className={`transition-colors hover:bg-slate-50/50 ${alert ? 'bg-rose-50/80' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {alert && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                      {!alert && item.status === '入塾決定' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {item.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.contact}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                      {item.subject}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.assignee}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className={`flex items-center gap-1.5 ${alert ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.updatedAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as LeadStatus)}
                      className={`text-sm rounded-md border py-1.5 pl-2 pr-8 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${
                        item.status === '入塾決定' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
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
