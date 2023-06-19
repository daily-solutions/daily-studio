import React from 'react';

import { RecoilProvider } from '@/components/Providers/RecoilProvider';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RecoilProvider>{children}</RecoilProvider>
    </ThemeProvider>
  );
}
