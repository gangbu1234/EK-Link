import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Brand } from '@/types';

interface BrandContextType {
  brand: Brand;
  setBrand: (brand: Brand) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrandState] = useState<Brand>('escot');

  useEffect(() => {
    // Check local storage or set default
    const saved = localStorage.getItem('ek-link-brand') as Brand;
    if (saved === 'escot' || saved === 'kakitsubata') {
      setBrandState(saved);
    }
  }, []);

  const setBrand = (newBrand: Brand) => {
    setBrandState(newBrand);
    localStorage.setItem('ek-link-brand', newBrand);
    document.documentElement.setAttribute('data-brand', newBrand);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-brand', brand);
  }, [brand]);

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
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
