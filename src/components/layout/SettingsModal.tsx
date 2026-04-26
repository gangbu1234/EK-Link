import React from 'react';
import { X, Settings, RefreshCw, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface Props {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: Props) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 px-1">アプリ操作</p>
            <button
              onClick={handleReload}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <RefreshCw className="w-4 h-4" />
              </div>
              データを最新に更新
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              ログアウト
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
          <p className="text-xs text-slate-400 font-medium">EK-Link v0.1.0 (PostgreSQL)</p>
        </div>
      </div>
    </div>
  );
}
