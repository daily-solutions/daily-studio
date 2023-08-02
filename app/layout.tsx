import '@/styles/globals.css';
import React from 'react';
import { Metadata } from 'next';
import { config } from '@/config';

import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { RecoilProvider } from '@/components/Providers';

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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: React.PropsWithChildren<{}>) {
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
        </RecoilProvider>
      </body>
    </html>
  );
}
