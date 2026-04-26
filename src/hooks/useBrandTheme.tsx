import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandFilter } from '@/types';

interface BrandContextType {
  brandFilter: BrandFilter;
  setBrandFilter: (brand: BrandFilter) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  // 初期値を常に 'all' に設定
  const [brandFilter, setBrandFilterState] = useState<BrandFilter>('all');

  useEffect(() => {
    // 起動時は常に 'all' を優先するが、テーマカラーの初期設定は行う
    document.documentElement.setAttribute('data-brand', 'escot');
  }, []);

  const setBrandFilter = (newFilter: BrandFilter) => {
    setBrandFilterState(newFilter);
    localStorage.setItem('ek-link-brand', newFilter);
    // テーマカラーは具体ブランドのみ適用（'all'はescotをベースに）
    const theme = newFilter === 'kakitsubata' ? 'kakitsubata' : 'escot';
    document.documentElement.setAttribute('data-brand', theme);
  };

  return (
    <BrandContext.Provider value={{ brandFilter, setBrandFilter }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrandTheme() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrandTheme must be used within a BrandProvider');
  }
  return context;
}
