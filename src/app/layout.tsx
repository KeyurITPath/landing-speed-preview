import type { Viewport } from 'next';
import { Rubik } from 'next/font/google';
import Script from 'next/script';
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
import { TWITTER_TAG_ID } from '../utils/constants';

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
      <head>
        <Script
          id='x-pixel'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){
                e.twq||(s=e.twq=function(){
                  s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
                },s.version='1.1',s.queue=[],u=t.createElement(n),
                u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
                a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))
              }(window,document,'script');
              twq('config', ${TWITTER_TAG_ID});
            `,
          }}
        />
      </head>
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
