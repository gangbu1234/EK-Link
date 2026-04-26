import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // ページ遷移時にサイドバーを閉じる（モバイル用）
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router.pathname]);

  if (status === 'loading' || status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 safe-area-pt">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden safe-area-pb">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 sm:p-6 md:p-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
