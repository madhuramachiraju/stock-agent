import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import SecurityMonitor from '@/components/SecurityMonitor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stock Agent - Your Smart Portfolio Manager',
  description: 'Track stocks, manage portfolios, and get real-time updates with our intelligent stock agent.',
  keywords: 'stocks, portfolio, trading, finance, investment',
  authors: [{ name: 'Stock Agent Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <SecurityMonitor />
        </Providers>
      </body>
    </html>
  );
} 