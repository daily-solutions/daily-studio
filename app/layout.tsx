import '@/styles/globals.css';
import React from 'react';
import { Metadata } from 'next';
import { Toaster } from '@/ui/Toaster';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { RecoilProvider } from '@/components/Providers';
import { TailwindIndicator } from '@/components/TailwindIndicator';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'h-full bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <RecoilProvider>
          <div className="h-full overflow-hidden">{children}</div>
          <Toaster />
          <TailwindIndicator />
        </RecoilProvider>
      </body>
    </html>
  );
}
