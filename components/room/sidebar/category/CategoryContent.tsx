import { useMemo } from 'react';
import { imageParams } from '@/constants/imageParams';
import { textParams } from '@/constants/textParams';
import { toastParams } from '@/constants/toastParams';
import { viewParams } from '@/constants/viewParams';
import { useSidebar } from '@/states/sidebar';

import { FormMaker } from '@/components/formMaker';
import { People } from '@/components/room/sidebar/people';

export function CategoryContent() {
  const [sidebar] = useSidebar();

  const content = useMemo(() => {
    switch (sidebar) {
      case 'text':
        return <FormMaker fields={textParams} />;
      case 'image':
        return <FormMaker fields={imageParams([])} />;
      case 'toast':
        return <FormMaker fields={toastParams([])} />;
      case 'people':
        return <People />;
      case 'stream':
        return <div>Stream</div>;
      case 'assets':
        return <div>Assets</div>;
      case 'media':
        return <div>Media</div>;
      default:
        return <FormMaker fields={viewParams} />;
    }
  }, [sidebar]);

  return (
    <div className="max-h-[calc(100dvh-8rem)] min-h-[calc(100dvh-8rem)] overflow-auto scroll-smooth">
      {content}
    </div>
  );
}
