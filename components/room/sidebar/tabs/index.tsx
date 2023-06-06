import { useLiveStreaming, useRecording } from '@daily-co/daily-react';

import { TabsList } from '@/components/ui/tabs';
import { Tab } from '@/components/room/sidebar/tabs/tab';

export function Tabs() {
  const { isLiveStreaming } = useLiveStreaming();
  const { isRecording } = useRecording();

  return (
    <TabsList className="flex flex-col items-center gap-y-2 border-l p-2">
      <Tab name="layout" icon="view" text="View" />
      <Tab name="text" icon="text" text="Text" />
      <Tab name="image" icon="image" text="Image" />
      <Tab name="toast" icon="bell" text="Toast" />
      <Tab name="chat" icon="chat" text="Chat" ownerOnly={false} />
      <Tab name="people" icon="people" text="People" />
      <Tab name="stream" icon="stream" text="RTMP" />
      <Tab
        name="assets"
        icon="files"
        text="Assets"
        disabled={isLiveStreaming || isRecording}
      />
      <Tab name="settings" icon="settings" text="Config" ownerOnly={false} />
    </TabsList>
  );
}
