import { useState } from 'react';
import { X, UserPlus, Plus } from 'lucide-react';
import { Brand, LeadStatus } from '@/types';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const SUBJECTS = ['古文', '英語', '数学', '国語', '漢文', '古典', 'その他'];
const INITIAL_ASSIGNEES = ['岡部', '夏井', '高野', '甲田'];

export default function AddLeadModal({ onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    brand: 'escot' as Brand,
    name: '',
    subject: '国語',
    assignee: '岡部',
    status: '新規問い合わせ' as LeadStatus,
  });
  const [isCustomAssignee, setIsCustomAssignee] = useState(false);
  const [customAssignee, setCustomAssignee] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('氏名は必須です。');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    // カスタム担当者が入力されている場合はそちらを優先
    const finalData = {
      ...form,
      assignee: isCustomAssignee ? customAssignee : form.assignee
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || '登録に失敗しました。');
      onSaved();
      onClose();
    } catch (err: any) {
      setError(`登録に失敗しました: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">問い合わせ 新規追加</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* 氏名 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">氏名 <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="例：山田 太郎"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ステータス</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              {(['新規問い合わせ', '初メール送付済', '面談・体験授業待ち', '体験後メール送付済', '入塾決定', '追わない'] as LeadStatus[]).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 希望科目 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">希望科目</label>
            <select
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* 担当予定者 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">担当予定者</label>
            {!isCustomAssignee ? (
              <div className="flex gap-2">
                <select
                  value={form.assignee}
                  onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                >
                  {INITIAL_ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCustomAssignee(true)}
                  className="px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors"
                  title="新しい担当者を追加"
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
                  placeholder="新しい担当者名を入力"
                  className="flex-1 px-3.5 py-2.5 border border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setIsCustomAssignee(false); setCustomAssignee(''); }}
                  className="px-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors text-xs"
                >
                  戻る
                </button>
              </div>
            )}
          </div>

          {/* ブランド */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ブランド</label>
            <div className="flex gap-2">
              {(['escot', 'kakitsubata'] as Brand[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, brand: b }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.brand === b
                      ? b === 'escot'
                        ? 'bg-blue-50 border-blue-300 text-[#1A2F4B]'
                        : 'bg-purple-50 border-purple-300 text-[#5D3176]'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {b === 'escot' ? 'エスコット' : 'かきつばた'}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60"
              style={{ background: 'var(--color-primary)' }}
            >
              {submitting ? '登録中...' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
