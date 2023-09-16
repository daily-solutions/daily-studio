import '@/styles/globals.css';

import React from 'react';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { config } from '@/config';
import { Toaster } from '@/ui/Toaster';

import { cn } from '@/lib/utils';
import { RecoilProvider } from '@/components/Providers';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: config.name,
    template: `%s - ${config.name}`,
  },
  description: config.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/slash.png',
    shortcut: '/slash.png',
    apple: '/slash.png',
  },
};

export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'h-full bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <RecoilProvider>
          <div className="h-full overflow-hidden">{children}</div>
          <Toaster />
        </RecoilProvider>
      </body>
    </html>
  );
}
