import type { AppProps } from 'next/app';
import { BrandProvider } from '@/hooks/useBrandTheme';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BrandProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </BrandProvider>
  );
}
