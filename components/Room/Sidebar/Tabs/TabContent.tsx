import { useMemo } from 'react';
import { configParams } from '@/constants/configParams';
import { imageParams } from '@/constants/imageParams';
import { textParams } from '@/constants/textParams';
import { toastParams } from '@/constants/toastParams';
import { viewParams } from '@/constants/viewParams';
import { TabsContent } from '@/ui/Tabs';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { Sidebar } from '@/types/sidebar';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { FormMaker } from '@/components/FormMaker';
import { Assets } from '@/components/Room/Sidebar/Assets';
import { Chat } from '@/components/Room/Sidebar/Chat';
import { People } from '@/components/Room/Sidebar/People';
import { Stream } from '@/components/Room/Sidebar/Stream';
import { TabHeading } from '@/components/Room/Sidebar/Tabs/TabHeading';

interface Props {
  value: Sidebar;
}

export function TabContent({ value }: Props) {
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const assetFileNames = useMemo(
    () => Object.values(assets ?? {}).map((asset) => asset.name),
    [assets]
  );

  const content = useMemo(() => {
    switch (value) {
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
      case 'config':
        return <FormMaker fields={configParams} />;
      default:
        return <FormMaker fields={viewParams} />;
    }
  }, [assetFileNames, value]);

  return (
    <TabsContent value={value}>
      <div className="h-[calc(100dvh-4rem)] overflow-auto scroll-smooth">
        <TabHeading value={value} />
        {content}
      </div>
    </TabsContent>
  );
}
