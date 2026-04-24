import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, Receipt, Settings } from 'lucide-react';
import { useBrandTheme } from '@/hooks/useBrandTheme';

export default function Sidebar() {
  const router = useRouter();
  const { brand, setBrand } = useBrandTheme();

  const navItems = [
    { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
    { name: '問い合わせ管理', href: '/leads', icon: Users },
    { name: '請求書管理', href: '/billing', icon: Receipt },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-10 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
          EK-Link
        </h1>
      </div>

      <div className="p-4 border-b border-slate-100">
        <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Brand Setting</div>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setBrand('escot')}
            className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${
              brand === 'escot' ? 'bg-white shadow-sm text-[#1A2F4B]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            エスコット
          </button>
          <button
            onClick={() => setBrand('kakitsubata')}
            className={`flex-1 text-xs py-2 rounded-md transition-all font-medium ${
              brand === 'kakitsubata' ? 'bg-white shadow-sm text-[#5D3176]' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            かきつばた
          </button>
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
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Settings className="w-5 h-5 text-slate-400" />
          設定
        </button>
      </div>
    </div>
  );
}
