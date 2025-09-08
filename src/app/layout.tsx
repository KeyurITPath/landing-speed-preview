import type { Viewport } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ThemeRegistry from './ThemeRegistry';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import ReduxProvider from '@/store/ReduxProvider';
import ToastProvider from '@/context/stack-provider';
import AuthProvider from '@/context/auth-provider';
import { api } from '@/api';
import { SocketProvider } from '@/context/socket-context';
import GTM from '@/components/GTM';
import JoyrideProvider from '@/shared/joyride-provider';
import { getDomain } from '@/utils/domain';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const viewport: Viewport = {
  themeColor: '#0A192F',
};

export async function generateMetadata() {
  const domain_value = await getDomain();
  const response = await api.home.fetchDomainDetails({
    params: { name: domain_value },
  });

  const domain = (await response?.data?.data) || {};

  return {
    title: domain?.domain_detail?.brand_name || 'Eduelle',
    authors: [{ name: domain?.domain_detail?.legal_name, url: domain?.name }],
    openGraph: {
      title: domain?.domain_detail?.brand_name,
      description: 'A custom Next.js project architecture template.',
      url: domain?.name,
      siteName: domain?.domain_detail?.brand_name,
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const { children } = props;
  const locale = 'en';

  return (
    <html lang={locale}>
      <body className={`${rubik.variable}`} suppressHydrationWarning={true}>
        <GTM />
        <ReduxProvider>
          <NextIntlClientProvider>
            <AppRouterCacheProvider>
              <ThemeRegistry>
                <SocketProvider>
                  <ToastProvider>
                    <AuthProvider>
                      <JoyrideProvider>{children}</JoyrideProvider>
                    </AuthProvider>
                  </ToastProvider>
                </SocketProvider>
              </ThemeRegistry>
            </AppRouterCacheProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
