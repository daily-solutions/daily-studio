import { usePermissions } from '@daily-co/daily-react';

import { AudioDevices } from '@/components/call/devices/audioDevices';
import { SpeakerDevices } from '@/components/call/devices/speakerDevices';
import { VideoDevices } from '@/components/call/devices/videoDevices';

export function Devices() {
  const { canSendAudio, canSendVideo } = usePermissions();

  return (
    <div className="flex flex-col gap-y-3">
      {canSendVideo && <VideoDevices />}
      {canSendAudio && <AudioDevices />}
      <SpeakerDevices />
    </div>
  );
}
