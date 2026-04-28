import React, { useState } from 'react';
import { Inquiry, LeadStatus } from '@/types';
import { AlertCircle, Clock, CheckCircle2, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, ArrowRight, RotateCcw } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import EditLeadModal from '@/components/leads/EditLeadModal';

const BRAND_LABEL: Record<string, { label: string; className: string }> = {
  escot: { label: 'エスコット', className: 'bg-blue-50 text-[#1A2F4B] border border-blue-100' },
  kakitsubata: { label: 'かきつばた', className: 'bg-purple-50 text-[#5D3176] border border-purple-100' },
};

const STATUS_ORDER: LeadStatus[] = ['新規問い合わせ', '初メール送付済', '面談・体験授業待ち', '体験後メール送付済', '入塾決定', '追わない'];

type SortCol = 'name' | 'status' | 'updatedAt' | 'assignee' | 'subject' | 'brand' | 'createdAt';

interface Props { data: Inquiry[]; onUpdate: () => void; }

export default function LeadTable({ data, onUpdate }: Props) {
  const { brandFilter } = useBrandTheme();
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [editTarget, setEditTarget] = useState<Inquiry | null>(null);
  type SortRule = { col: SortCol; dir: 'asc' | 'desc' };
  const [sortRules, setSortRules] = useState<SortRule[]>([{ col: 'updatedAt', dir: 'desc' }]);

  const handleSort = (col: SortCol) => {
    setSortRules(currentRules => {
      const existingIdx = currentRules.findIndex(r => r.col === col);
      let newRules = [...currentRules];
      
      if (existingIdx >= 0) {
        const item = newRules[existingIdx];
        newRules.splice(existingIdx, 1);
        
        if (item.dir === 'asc') {
          newRules.unshift({ col, dir: 'desc' });
        }
      } else {
        newRules.unshift({ col, dir: 'asc' });
      }
      
      return newRules;
    });
  };

  const toggleStatus = async (id: string, currentStatus: LeadStatus) => {
    setUpdating(id);
    try {
      const idx = STATUS_ORDER.indexOf(currentStatus);
      let newStatus: LeadStatus;
      
      // 入塾決定または追わないの場合は最初に戻す。それ以外は次へ。
      if (currentStatus === '入塾決定' || currentStatus === '追わない' || idx >= 4) {
        newStatus = STATUS_ORDER[0];
      } else {
        newStatus = STATUS_ORDER[idx + 1];
      }

      await fetch(`/api/leads/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status: newStatus }) 
      });
      onUpdate();
    } catch (e) { console.error(e); } finally { setUpdating(null); }
  };

  const handleDelete = async (id: string) => {
    setUpdating(id);
    try { await fetch(`/api/leads/${id}`, { method: 'DELETE' }); onUpdate(); }
    catch (e) { console.error(e); } finally { setUpdating(null); setDeleteTarget(null); }
  };

  const isAlert = (d: Date | string) => new Date().getTime() - new Date(d).getTime() > 72 * 60 * 60 * 1000;
  const formatDate = (d: Date | string) => new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d));

  const filtered = Array.isArray(data) 
    ? (brandFilter === 'all' ? data : data.filter(l => l.brand === brandFilter))
    : [];
  
  // 3つのグループに分離
  const regular = filtered.filter(i => i.status !== '追わない' && i.status !== '入塾決定');
  const unwanted = filtered.filter(i => i.status === '追わない');
  const finished = filtered.filter(i => i.status === '入塾決定');

  const sortData = (dataArray: Inquiry[]) => {
    return [...dataArray].sort((a, b) => {
      for (const rule of sortRules) {
        let va: string | number = '', vb: string | number = '';
        if (rule.col === 'name') { va = a.name; vb = b.name; }
        else if (rule.col === 'status') { va = a.status; vb = b.status; }
        else if (rule.col === 'updatedAt') { va = new Date(a.updatedAt).getTime(); vb = new Date(b.updatedAt).getTime(); }
        else if (rule.col === 'assignee') { va = a.assignee || ''; vb = b.assignee || ''; }
        else if (rule.col === 'subject') { va = a.subject || ''; vb = b.subject || ''; }
        else if (rule.col === 'brand') { va = a.brand; vb = b.brand; }
        else if (rule.col === 'createdAt') { va = new Date(a.createdAt).getTime(); vb = new Date(b.createdAt).getTime(); }
        
        if (va < vb) return rule.dir === 'asc' ? -1 : 1;
        if (va > vb) return rule.dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedRegular = sortData(regular);
  const sortedUnwanted = sortData(unwanted);
  const sortedFinished = sortData(finished);
  
  // 指定の順序で結合: 進行中 -> 追わない -> 入塾済み
  const displayData = [...sortedRegular, ...sortedUnwanted, ...sortedFinished];

  const SortIcon = ({ col }: { col: SortCol }) => {
    const ruleIndex = sortRules.findIndex(r => r.col === col);
    if (ruleIndex === -1) return <ChevronsUpDown className="w-3 h-3 ml-1 text-slate-300" />;
    
    const rule = sortRules[ruleIndex];
    return (
      <div className="flex items-center">
        {rule.dir === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-primary" /> : <ChevronDown className="w-3 h-3 ml-1 text-primary" />}
        {sortRules.length > 1 && <span className="text-[10px] ml-0.5 text-primary font-bold">{ruleIndex + 1}</span>}
      </div>
    );
  };

  const thCls = 'px-4 py-3 whitespace-nowrap cursor-pointer select-none hover:text-slate-700';
  const colCount = brandFilter === 'all' ? 8 : 7;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {!(sortRules.length === 1 && sortRules[0].col === 'updatedAt' && sortRules[0].dir === 'desc') && (
          <div className="flex justify-end px-4 py-2 border-b border-slate-200 bg-slate-50/50">
            <button 
              onClick={() => setSortRules([{ col: 'updatedAt', dir: 'desc' }])}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> ソートリセット
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className={thCls} onClick={() => handleSort('name')} title="クリックでソート条件を追加/変更">
                  <div className="flex items-center">氏名<SortIcon col="name" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort('status')} title="クリックでソート条件を追加/変更">
                  <div className="flex items-center">ステータス<SortIcon col="status" /></div>
                </th>
                <th className="px-4 py-3 whitespace-nowrap">アクション</th>
                <th className={thCls} onClick={() => handleSort('updatedAt')} title="クリックでソート条件を追加/変更">
                  <div className="flex items-center">最終更新日<SortIcon col="updatedAt" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort('assignee')} title="クリックでソート条件を追加/変更">
                  <div className="flex items-center">担当予定者<SortIcon col="assignee" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort('createdAt')} title="クリックでソート条件を追加/変更">
                  <div className="flex items-center">初回問合せ日<SortIcon col="createdAt" /></div>
                </th>
                <th className={thCls} onClick={() => handleSort('subject')} title="クリックでソート条件を追加/変更">
                  <div className="flex items-center">希望科目<SortIcon col="subject" /></div>
                </th>
                {brandFilter === 'all' && (
                  <th className={thCls} onClick={() => handleSort('brand')} title="クリックでソート条件を追加/変更">
                    <div className="flex items-center">ブランド<SortIcon col="brand" /></div>
                  </th>
                )}
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayData.map((item) => {
                const alert = isAlert(item.updatedAt);
                const isUpdating = updating === item.id;
                const isUnwanted = item.status === '追わない';
                const isFinished = item.status === '入塾決定';
                const isFinal = isFinished || isUnwanted;
                const nextStatus = isFinal ? 'リセット' : STATUS_ORDER[STATUS_ORDER.indexOf(item.status as LeadStatus) + 1];

                return (
                  <tr key={item.id}
                    onClick={() => setEditTarget(item)}
                    className={`cursor-pointer transition-colors ${isFinal ? 'opacity-50 grayscale-[0.5]' : alert ? 'bg-rose-50/80' : 'hover:bg-slate-50/80'} ${isUpdating ? 'opacity-30' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {!isFinal && alert && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                        {!isFinal && !alert && item.status === '入塾決定' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        <span className={isFinal ? 'line-through text-slate-400' : ''}>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === '入塾決定' ? 'bg-emerald-500' : 
                          item.status === '追わない' ? 'bg-slate-300' : 
                          item.status === '新規問い合わせ' ? 'bg-blue-500' : 'bg-amber-500'
                        }`} />
                        <span className={`font-medium ${
                          item.status === '入塾決定' ? 'text-emerald-600' : 
                          item.status === '追わない' ? 'text-slate-400' : 'text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {!isFinal ? (
                        <button
                          disabled={isUpdating}
                          onClick={() => toggleStatus(item.id, item.status as LeadStatus)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-md text-xs font-bold disabled:opacity-50"
                        >
                          {nextStatus}
                        </button>
                      ) : (
                        <button
                          disabled={isUpdating}
                          onClick={() => toggleStatus(item.id, item.status as LeadStatus)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors rounded-md text-xs font-bold disabled:opacity-50"
                        >
                          <RotateCcw className="w-3 h-3" /> リセット
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`flex items-center gap-1.5 ${!isFinal && alert ? 'text-rose-600 font-medium' : 'text-slate-500'}`}>
                        <Clock className="w-3.5 h-3.5" />{formatDate(item.updatedAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.assignee}</td>
                    <td className="px-4 py-3 text-slate-500 text-sm">{item.createdAt ? formatDate(item.createdAt) : '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{item.subject}</td>
                    {brandFilter === 'all' && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${BRAND_LABEL[item.brand]?.className}`}>{BRAND_LABEL[item.brand]?.label}</span>
                      </td>
                    )}
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
      {editTarget && <EditLeadModal lead={editTarget} onClose={() => setEditTarget(null)} onSaved={onUpdate} />}
      {deleteTarget && <DeleteConfirmModal label={deleteTarget.name} onConfirm={() => handleDelete(deleteTarget.id)} onClose={() => setDeleteTarget(null)} />}
    </>
  );
}
