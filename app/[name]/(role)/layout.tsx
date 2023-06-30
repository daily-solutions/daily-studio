import React from 'react';
import { Toaster } from '@/ui/Toaster';

export default function RoleLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
