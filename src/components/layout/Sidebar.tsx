import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LayoutDashboard, Users, Receipt, Settings, X } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';
import SettingsModal from './SettingsModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const router = useRouter();
  const { brandFilter, setBrandFilter } = useBrandTheme();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
    { name: '問い合わせ管理', href: '/leads', icon: Users },
    { name: '請求書管理', href: '/billing', icon: Receipt },
  ];

  const brandOptions = [
    { value: 'all' as const, label: 'すべて' },
    { value: 'escot' as const, label: 'エスコット' },
    { value: 'kakitsubata' as const, label: 'かきつばた' },
  ];

  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* サイドバー本体 */}
      <div className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
            EK-Link
          </h1>
          <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Brand Filter</div>
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
            {brandOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setBrandFilter(value)}
                className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${
                  brandFilter === value
                    ? value === 'kakitsubata'
                      ? 'bg-white shadow-sm text-[#5D3176]'
                      : value === 'escot'
                      ? 'bg-white shadow-sm text-[#1A2F4B]'
                      : 'bg-white shadow-sm text-slate-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 mb-3 mt-2 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                style={isActive ? { backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' } : {}}
              >
                <Icon className={`w-5 h-5 ${isActive ? '' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => { setShowSettings(true); onClose(); }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            設定
          </button>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
