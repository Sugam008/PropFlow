import { colors } from '@propflow/theme';
import 'leaflet/dist/leaflet.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { ClientLayout } from '../src/components/ClientLayout';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { QueryProvider } from '../src/providers/QueryProvider';
import { ToastProvider } from '../src/providers/ToastProvider';
import { WebSocketProvider } from '../src/providers/WebSocketProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'PropFlow Customer Portal',
    template: '%s | PropFlow',
  },
  description: 'Track your property valuations and manage your requests with PropFlow.',
  applicationName: 'PropFlow',
  authors: [{ name: 'PropFlow' }],
  creator: 'PropFlow',
  publisher: 'PropFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'PropFlow Customer Portal',
    description: 'Track your property valuations and manage your requests.',
    siteName: 'PropFlow',
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropFlow Customer Portal',
    description: 'Track your property valuations and manage your requests.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#E31E24',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="preconnect" href="http://localhost:8000" />
        <link rel="dns-prefetch" href="http://localhost:8000" />
      </head>
      <body
        className={inter.className}
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: colors.gray[50],
          color: colors.foreground,
          minHeight: '100vh',
          fontFamily: 'inherit',
        }}
      >
        <QueryProvider>
          <ToastProvider>
            <WebSocketProvider>
              <ErrorBoundary>
                <ClientLayout>{children}</ClientLayout>
              </ErrorBoundary>
            </WebSocketProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
