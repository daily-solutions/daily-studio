import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { configParams } from '@/constants/configParams';
import { imageParams } from '@/constants/imageParams';
import { textParams } from '@/constants/textParams';
import { toastParams } from '@/constants/toastParams';
import { viewParams } from '@/constants/viewParams';
import { TabsContent } from '@/ui/Tabs';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { Sidebar } from '@/types/sidebar';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { Loading } from '@/components/Room/Sidebar/Loading';
import { TabHeading } from '@/components/Room/Sidebar/Tabs/TabHeading';

const FormMaker = dynamic(
  () => import('@/components/FormMaker').then((mod) => mod.FormMaker),
  {
    loading: () => <Loading />,
  }
);
const People = dynamic(
  () => import('@/components/Room/Sidebar/People').then((mod) => mod.People),
  {
    loading: () => <Loading />,
  }
);
const Assets = dynamic(
  () => import('@/components/Room/Sidebar/Assets').then((mod) => mod.Assets),
  {
    loading: () => <Loading />,
  }
);
const Chat = dynamic(
  () => import('@/components/Room/Sidebar/Chat').then((mod) => mod.Chat),
  {
    loading: () => <Loading />,
  }
);
const Stream = dynamic(
  () => import('@/components/Room/Sidebar/Stream').then((mod) => mod.Stream),
  {
    loading: () => <Loading />,
  }
);

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
      <TabHeading value={value} />
      <div className="h-[calc(100dvh-8rem)] overflow-auto scroll-smooth">
        {content}
      </div>
    </TabsContent>
  );
}
