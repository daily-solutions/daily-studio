import { useMemo } from 'react';
import { imageParams } from '@/constants/imageParams';
import { textParams } from '@/constants/textParams';
import { toastParams } from '@/constants/toastParams';
import { viewParams } from '@/constants/viewParams';
import { useAssets } from '@/states/assetState';
import { useSidebar } from '@/states/sidebar';

import { FormMaker } from '@/components/formMaker';
import { Assets } from '@/components/room/sidebar/assets';
import { People } from '@/components/room/sidebar/people';
import { Stream } from '@/components/room/sidebar/stream';

export function CategoryContent() {
  const [sidebar] = useSidebar();
  const [assets] = useAssets();

  const assetFileNames = useMemo(
    () => Object.values(assets).map((asset) => asset.name),
    [assets]
  );

  const content = useMemo(() => {
    switch (sidebar) {
      case 'text':
        return <FormMaker fields={textParams} />;
      case 'image':
        return <FormMaker fields={imageParams(assetFileNames)} />;
      case 'toast':
        return <FormMaker fields={toastParams(assetFileNames)} />;
      case 'people':
        return <People />;
      case 'stream':
        return <Stream />;
      case 'assets':
        return <Assets />;
      case 'media':
        return <div>Media</div>;
      default:
        return <FormMaker fields={viewParams} />;
    }
  }, [assetFileNames, sidebar]);

  return (
    <div className="max-h-[calc(100dvh-8rem)] min-h-[calc(100dvh-8rem)] overflow-auto scroll-smooth">
      {content}
    </div>
  );
}
