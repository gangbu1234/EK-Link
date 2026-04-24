import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="p-6 md:p-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
