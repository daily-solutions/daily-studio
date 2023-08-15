import { config } from '@/config';
import { TabsList } from '@/ui/Tabs';
import { useLiveStreaming, useRecording } from '@daily-co/daily-react';

import { Tab } from '@/components/Room/Sidebar/Tabs/Tab';

export function Tabs() {
  const { isLiveStreaming } = useLiveStreaming();
  const { isRecording } = useRecording();

  return (
    <TabsList className="md:min-w-16 flex flex-row items-center gap-x-2 overflow-auto border-b p-2 md:w-16 md:flex-col md:gap-y-2 md:border-b-0 md:border-l">
      <Tab name="layout" icon="view" text="View" />
      <Tab name="text" icon="text" text="Text" />
      <Tab name="image" icon="image" text="Image" />
      <Tab name="toast" icon="bell" text="Toast" />
      {config?.options?.enable_chat && (
        <Tab name="chat" icon="chat" text="Chat" ownerOnly={false} />
      )}
      {config?.options?.enable_people && (
        <Tab name="people" icon="people" text="People" ownerOnly={false} />
      )}
      {config?.options?.enable_live_streaming && (
        <Tab name="stream" icon="stream" text="RTMP" />
      )}
      <Tab
        name="assets"
        icon="files"
        text="Assets"
        disabled={isLiveStreaming || isRecording}
      />
      <Tab name="config" icon="settings" text="Config" />
    </TabsList>
  );
}
