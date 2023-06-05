import { useMemo } from 'react';
import { imageParams } from '@/constants/imageParams';
import { textParams } from '@/constants/textParams';
import { toastParams } from '@/constants/toastParams';
import { viewParams } from '@/constants/viewParams';
import { useSidebar } from '@/states/sidebar';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { FormMaker } from '@/components/formMaker';
import { Assets } from '@/components/room/sidebar/assets';
import { Chat } from '@/components/room/sidebar/chat';
import { People } from '@/components/room/sidebar/people';
import { Settings } from '@/components/room/sidebar/settings';
import { Stream } from '@/components/room/sidebar/stream';

export function TabContent() {
  const [sidebar] = useSidebar();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

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
        return (
          <div className="p-4">
            <Stream showHeader />
          </div>
        );
      case 'assets':
        return <Assets />;
      case 'chat':
        return <Chat />;
      case 'settings':
        return <Settings />;
      default:
        return <FormMaker fields={viewParams} />;
    }
  }, [assetFileNames, sidebar]);

  return (
    <div className="h-[calc(100dvh-8rem)] overflow-auto scroll-smooth">
      {content}
    </div>
  );
}
