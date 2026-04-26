import { AlertTriangle } from 'lucide-react';

interface Props {
  label: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({ label, onConfirm, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-5 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">削除の確認</h3>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">「{label}」</span> を削除します。<br />
            この操作は取り消せません。
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
