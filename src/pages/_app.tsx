import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BrandProvider } from '@/hooks/useBrandTheme';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';

  return (
    <SessionProvider session={session}>
      <BrandProvider>
        {isLoginPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </BrandProvider>
    </SessionProvider>
  );
}
