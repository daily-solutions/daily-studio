'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';

export function RecoilProvider({ children }: React.PropsWithChildren<{}>) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
