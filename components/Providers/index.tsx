import React from 'react';

import { RecoilProvider } from '@/components/Providers/RecoilProvider';

export function Providers({ children }: React.PropsWithChildren<{}>) {
  return <RecoilProvider>{children}</RecoilProvider>;
}
