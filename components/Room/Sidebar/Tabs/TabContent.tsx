import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { imageParams } from '@/constants/imageParams';
import { textParams } from '@/constants/textParams';
import { toastParams } from '@/constants/toastParams';
import { viewParams } from '@/constants/viewParams';
import { TabsContent } from '@/ui/Tabs';
import { useDaily } from '@daily-co/daily-react';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { Sidebar } from '@/types/sidebar';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useStage } from '@/hooks/useStage';
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

const VCS = dynamic(
  () => import('@/components/Room/Sidebar/VCS').then((mod) => mod.VCS),
  {
    loading: () => <Loading />,
  }
);

interface Props {
  value: Sidebar;
}

export function TabContent({ value }: Props) {
  const daily = useDaily();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const assetFileNames = useMemo(
    () => Object.values(assets ?? {}).map((asset) => asset.name),
    [assets]
  );

  const { participantIds } = useStage();

  const participants = useMemo(() => {
    if (!daily) return [];
    const participantsObject = Object.fromEntries(
      Object.values(daily.participants()).map((p) => [p.session_id, p])
    );

    return participantIds
      .map((id) => {
        const participant = participantsObject[id];
        return {
          label: participant.user_name,
          value: participant.session_id,
        };
      })
      .filter(Boolean);
  }, [daily, participantIds]);

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
        return <VCS />;
      default:
        return <FormMaker fields={viewParams(participants)} />;
    }
  }, [assetFileNames, participants, value]);

  return (
    <TabsContent value={value}>
      <TabHeading value={value} />
      <div className="h-[calc(100dvh-8rem)] overflow-auto scroll-smooth">
        {content}
      </div>
    </TabsContent>
  );
}
