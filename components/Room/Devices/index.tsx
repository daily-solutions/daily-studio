import { usePermissions } from '@daily-co/daily-react';

import { AudioDevices } from '@/components/Room/Devices/AudioDevices';
import { SpeakerDevices } from '@/components/Room/Devices/SpeakerDevices';
import { VideoDevices } from '@/components/Room/Devices/VideoDevices';

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
