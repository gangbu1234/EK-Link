import React, { useState } from 'react';
import { Invoice, InvoiceStatus } from '@/types';
import { Check, Calendar, FileText, Send, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, CheckCircle2, Clock, FileDown, Eye, Package } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import EditInvoiceModal from '@/components/billing/EditInvoiceModal';

const BRAND_LABEL: Record<string, { label: string; className: string }> = {
  escot: { label: 'エスコット', className: 'bg-blue-50 text-[#1A2F4B] border border-blue-100' },
  kakitsubata: { label: 'かきつばた', className: 'bg-purple-50 text-[#5D3176] border border-purple-100' },
};

type SortCol = 'studentId' | 'studentName' | 'assignee' | 'status' | 'brand' | 'sentDate';

interface Props { data: Invoice[]; onUpdate: () => void; }

export default function InvoiceTable({ data, onUpdate }: Props) {
  const { brandFilter } = useBrandTheme();
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);
  const [editTarget, setEditTarget] = useState<Invoice | null>(null);
  const [sortCol, setSortCol] = useState<SortCol>('studentName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const toggleStatus = async (id: string, currentStatus: InvoiceStatus) => {
    setUpdating(id);
    try {
      let newStatus: InvoiceStatus = currentStatus;
      let sentDate: Date | null = null;
      
      const s = currentStatus as string;
      if (s === '日程決め') newStatus = '日程回答待ち';
      else if (s === '日程回答待ち') newStatus = '請求書出力待ち';
      else if (s === '請求書出力待ち') newStatus = '請求書確認待ち';
      else if (s === '請求書確認待ち') newStatus = '請求書発送待ち';
      else if (s === '請求書発送待ち') { newStatus = '発送確認済'; sentDate = new Date(); }
      else { newStatus = '日程決め'; sentDate = null; }
      
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

  const handleDelete = async (id: string) => {
    setUpdating(id);
    try { await fetch(`/api/invoices/${id}`, { method: 'DELETE' }); onUpdate(); }
    catch (e) { console.error(e); } finally { setUpdating(null); setDeleteTarget(null); }
  };

  const formatDate = (d?: Date | string | null) => {
    if (!d) return '-';
    return new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric' }).format(new Date(d));
  };

  const filtered = Array.isArray(data) 
    ? (brandFilter === 'all' ? data : data.filter(i => i.brand === brandFilter))
    : [];

  const displayData = [...filtered].sort((a, b) => {
    let va: string | number = '', vb: string | number = '';
    
    if (sortCol === 'status') {
      const getStatusWeight = (s: string) => {
        switch (s) {
          case '日程決め': return 0;
          case '日程回答待ち': return 1;
          case '請求書出力待ち': return 2;
          case '請求書確認待ち': return 3;
          case '請求書発送待ち': return 4;
          case '発送確認済': return 5;
          default: return 9;
        }
      };
      va = getStatusWeight(a.status);
      vb = getStatusWeight(b.status);
    } else if (sortCol === 'studentId') { 
      va = a.studentId || ''; vb = b.studentId || ''; 
    } else if (sortCol === 'studentName') { 
      va = a.studentName; vb = b.studentName; 
    } else if (sortCol === 'assignee') {
      va = a.assignee || ''; vb = b.assignee || '';
    } else if (sortCol === 'brand') { 
      va = a.brand; vb = b.brand; 
    } else if (sortCol === 'sentDate') { 
      va = a.sentDate ? new Date(a.sentDate).getTime() : 0; vb = b.sentDate ? new Date(b.sentDate).getTime() : 0; 
    }

    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusStyle = (s: InvoiceStatus) => {
    switch (s) {
      case '日程決め': return { icon: <Calendar className="w-4 h-4 text-slate-400" />, text: 'text-slate-500' };
      case '日程回答待ち': return { icon: <Clock className="w-4 h-4 text-amber-500" />, text: 'text-amber-600' };
      case '請求書出力待ち': return { icon: <FileDown className="w-4 h-4 text-blue-500" />, text: 'text-blue-600' };
      case '請求書確認待ち': return { icon: <Eye className="w-4 h-4 text-indigo-500" />, text: 'text-indigo-600' };
      case '請求書発送待ち': return { icon: <Package className="w-4 h-4 text-purple-500" />, text: 'text-purple-600' };
      case '発送確認済': return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, text: 'text-emerald-600' };
      default: return { icon: null, text: '' };
    }
  };

  const SortIcon = ({ col }: { col: SortCol }) => {
    if (sortCol !== col) return <ChevronsUpDown className="w-3 h-3 ml-1 text-slate-300" />;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-primary" /> : <ChevronDown className="w-3 h-3 ml-1 text-primary" />;
  };

  const thCls = 'px-4 py-3 whitespace-nowrap cursor-pointer select-none hover:text-slate-700';
  const colCount = brandFilter === 'all' ? 8 : 7;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className={thCls} onClick={() => handleSort('studentId')}><div className="flex items-center">塾生番号<SortIcon col="studentId" /></div></th>
                <th className={thCls} onClick={() => handleSort('studentName')}><div className="flex items-center">生徒名<SortIcon col="studentName" /></div></th>
                <th className={thCls} onClick={() => handleSort('assignee')}><div className="flex items-center">担当者<SortIcon col="assignee" /></div></th>
                <th className="px-4 py-3 whitespace-nowrap">アクション</th>
                <th className={thCls} onClick={() => handleSort('status')}><div className="flex items-center">ステータス<SortIcon col="status" /></div></th>
                {brandFilter === 'all' && <th className={thCls} onClick={() => handleSort('brand')}><div className="flex items-center">ブランド<SortIcon col="brand" /></div></th>}
                <th className={thCls} onClick={() => handleSort('sentDate')}><div className="flex items-center">最終発送日<SortIcon col="sentDate" /></div></th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayData.map((item) => {
                const isUpdating = updating === item.id;
                const { icon, text } = getStatusStyle(item.status);
                const s = item.status as string;
                
                return (
                  <tr key={item.id}
                    onClick={() => setEditTarget(item)}
                    className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${isUpdating ? 'opacity-30' : ''}`}
                  >
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{item.studentId || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{item.studentName}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{item.assignee}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {s === '日程決め' && (
                        <button disabled={isUpdating} onClick={() => toggleStatus(item.id, item.status)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors rounded-md text-xs font-bold disabled:opacity-50">
                          日程決定訴求
                        </button>
                      )}
                      {s === '日程回答待ち' && (
                        <button disabled={isUpdating} onClick={() => toggleStatus(item.id, item.status)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors rounded-md text-xs font-bold disabled:opacity-50">
                          請求書出力依頼
                        </button>
                      )}
                      {s === '請求書出力待ち' && (
                        <button disabled={isUpdating} onClick={() => toggleStatus(item.id, item.status)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors rounded-md text-xs font-bold disabled:opacity-50">
                          請求書確認依頼
                        </button>
                      )}
                      {s === '請求書確認待ち' && (
                        <button disabled={isUpdating} onClick={() => toggleStatus(item.id, item.status)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors rounded-md text-xs font-bold disabled:opacity-50">
                          請求書発送依頼
                        </button>
                      )}
                      {s === '請求書発送待ち' && (
                        <button disabled={isUpdating} onClick={() => toggleStatus(item.id, item.status)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors rounded-md text-xs font-bold disabled:opacity-50">
                          請求書発送確認
                        </button>
                      )}
                      {s === '発送確認済' && (
                        <button disabled={isUpdating} onClick={() => toggleStatus(item.id, item.status)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors rounded-md text-xs font-semibold disabled:opacity-50">
                          リセット
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {icon}
                        <span className={`font-medium ${text}`}>{item.status}</span>
                      </div>
                    </td>
                    {brandFilter === 'all' && (
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${BRAND_LABEL[item.brand]?.className}`}>{BRAND_LABEL[item.brand]?.label}</span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-slate-500 text-sm">{formatDate(item.sentDate)}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button disabled={isUpdating} onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors disabled:opacity-30" title="削除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {displayData.length === 0 && (
                <tr><td colSpan={colCount} className="px-4 py-8 text-center text-slate-500">該当ブランドのデータがありません</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editTarget && <EditInvoiceModal invoice={editTarget} onClose={() => setEditTarget(null)} onSaved={onUpdate} />}
      {deleteTarget && <DeleteConfirmModal label={deleteTarget.studentName} onConfirm={() => handleDelete(deleteTarget.id)} onClose={() => setDeleteTarget(null)} />}
    </>
  );
}
