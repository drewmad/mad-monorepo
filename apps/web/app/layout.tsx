import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Stratus • Mad Engineering',
  description: 'Project & task platform powered by Next.js 14 + Supabase'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
} 