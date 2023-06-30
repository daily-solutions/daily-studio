import React from 'react';
import { Toaster } from '@/ui/Toaster';

import { RecoilProvider } from '@/components/Providers';

export default function RoleLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <RecoilProvider>
      {children}
      <Toaster />
    </RecoilProvider>
  );
}
