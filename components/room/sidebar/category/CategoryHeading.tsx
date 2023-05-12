'use client';

import { useMemo } from 'react';
import { useSidebar } from '@/states/sidebar';

export function CategoryHeading() {
  const [sidebar] = useSidebar();

  const { heading, description } = useMemo(() => {
    switch (sidebar) {
      case 'text':
        return {
          heading: 'Text',
          description: 'Modify text settings',
        };
      case 'image':
        return {
          heading: 'Image',
          description: 'Modify image settings',
        };
      case 'toast':
        return {
          heading: 'Toast',
          description: 'Modify toast settings',
        };
      case 'people':
        return {
          heading: 'People',
          description: 'Manage the people shown in the layout',
        };
      case 'assets':
        return {
          heading: 'Assets',
          description: 'Manage the assets',
        };
      case 'stream':
        return {
          heading: 'Broadcast settings',
          description: 'Update the RTMP destinations',
        };
      default:
        return {
          heading: 'View Settings',
          description: 'Adjust the layout options',
        };
    }
  }, [sidebar]);

  return (
    <div className="flex h-16 flex-col justify-center gap-y-1 border-b bg-white px-4">
      <h2 className="font-semibold">{heading}</h2>
      <p className="text-xs">{description}</p>
    </div>
  );
}
