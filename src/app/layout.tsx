import type { Metadata, Viewport } from 'next';
import { Rubik } from 'next/font/google';
import './globals.css';
import ThemeRegistry from './ThemeRegistry';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import ReduxProvider from '../store/ReduxProvider';
import Footer from '@components/footer';

const rubik = Rubik({
  variable: '--font-rubik',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'Project Architecture',
  description: 'A custom Next.js project architecture template.',
  authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
  keywords: [
    'Next.js',
    'Project Architecture',
    'Template',
    'TypeScript',
    'React',
  ],
  openGraph: {
    title: 'Project Architecture',
    description: 'A custom Next.js project architecture template.',
    url: 'https://yourprojectdomain.com',
    siteName: 'Project Architecture',
    images: [
      {
        url: 'https://yourprojectdomain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Project Architecture Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A192F',
};

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const { children } = props;

  const locale = 'en';

  return (
    <html lang={locale}>
      <head></head>
      <body className={`${rubik.variable}`} suppressHydrationWarning={true}>
        <ReduxProvider>
          <NextIntlClientProvider>
            <AppRouterCacheProvider>
              <ThemeRegistry>
                {children}
                <Footer />
              </ThemeRegistry>

            </AppRouterCacheProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
