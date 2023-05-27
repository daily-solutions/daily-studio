import { useLiveStreaming, useRecording } from '@daily-co/daily-react';

import { CategoryTab } from '@/components/room/sidebar/category/CategoryTab';

export function Category() {
  const { isLiveStreaming } = useLiveStreaming();
  const { isRecording } = useRecording();

  return (
    <div className="flex flex-col items-center gap-y-2 border-l p-2">
      <CategoryTab name="layout" icon="view" text="View" />
      <CategoryTab name="text" icon="text" text="Text" />
      <CategoryTab name="image" icon="image" text="Image" />
      <CategoryTab name="toast" icon="bell" text="Toast" />
      <CategoryTab name="chat" icon="chat" text="Chat" ownerOnly={false} />
      <CategoryTab name="people" icon="people" text="People" />
      <CategoryTab name="stream" icon="stream" text="RTMP" />
      <CategoryTab
        name="assets"
        icon="files"
        text="Assets"
        disabled={isLiveStreaming || isRecording}
      />
      <CategoryTab
        name="settings"
        icon="settings"
        text="Config"
        ownerOnly={false}
      />
    </div>
  );
}
