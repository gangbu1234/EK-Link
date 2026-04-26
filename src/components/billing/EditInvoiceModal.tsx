import { useState } from 'react';
import { X, Pencil, Plus } from 'lucide-react';
import { Brand, Invoice, InvoiceStatus } from '@/types';

interface Props {
  invoice: Invoice;
  onClose: () => void;
  onSaved: () => void;
}

const INITIAL_ASSIGNEES = ['岡部', '夏井', '高野', '甲田'];
const STATUS_OPTIONS: InvoiceStatus[] = ['日程決め', '日程回答待ち', '請求書出力待ち', '請求書確認待ち', '請求書発送待ち', '発送確認済'];

export default function EditInvoiceModal({ invoice, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    brand: invoice.brand as Brand,
    studentId: invoice.studentId || '',
    studentName: invoice.studentName,
    assignee: invoice.assignee,
    status: invoice.status as InvoiceStatus,
  });
  
  const [isCustomAssignee, setIsCustomAssignee] = useState(!INITIAL_ASSIGNEES.includes(invoice.assignee));
  const [customAssignee, setCustomAssignee] = useState(INITIAL_ASSIGNEES.includes(invoice.assignee) ? '' : invoice.assignee);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim()) {
      setError('生徒名は必須です。');
      return;
    }
    setSubmitting(true);
    setError('');
    
    const finalData = {
      ...form,
      studentId: form.studentId.trim() || null,
      assignee: isCustomAssignee ? customAssignee : form.assignee
    };

    try {
      const res = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error();
      onSaved();
      onClose();
    } catch {
      setError('更新に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Pencil className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">請求書 編集</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <div className="bg-rose-50 text-rose-600 text-sm px-4 py-2.5 rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">塾生番号</label>
            <input type="text" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} placeholder="例：KKK26001" className={inputCls} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">生徒名 <span className="text-rose-500">*</span></label>
            <input type="text" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} className={inputCls} />
          </div>

          {/* 担当者 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">担当者</label>
            {!isCustomAssignee ? (
              <div className="flex gap-2">
                <select
                  value={form.assignee}
                  onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                  className={inputCls + " bg-white flex-1"}
                >
                  {INITIAL_ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCustomAssignee(true)}
                  className="px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  autoFocus
                  value={customAssignee}
                  onChange={e => setCustomAssignee(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setIsCustomAssignee(false); setCustomAssignee(''); setForm(f => ({ ...f, assignee: INITIAL_ASSIGNEES[0] })); }}
                  className="px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors text-xs"
                >
                  選択
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ステータス</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as InvoiceStatus }))} className={inputCls + ' bg-white'}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ブランド</label>
            <div className="flex gap-2">
              {(['escot', 'kakitsubata'] as Brand[]).map(b => (
                <button key={b} type="button" onClick={() => setForm(f => ({ ...f, brand: b }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${form.brand === b ? (b === 'escot' ? 'bg-blue-50 border-blue-300 text-[#1A2F4B]' : 'bg-purple-50 border-purple-300 text-[#5D3176]') : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                  {b === 'escot' ? 'エスコット' : 'かきつばた'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">キャンセル</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ background: 'var(--color-primary)' }}>
              {submitting ? '更新中...' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
