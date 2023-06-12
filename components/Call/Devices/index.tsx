import { usePermissions } from '@daily-co/daily-react';

import { AudioDevices } from '@/components/Call/Devices/AudioDevices';
import { SpeakerDevices } from '@/components/Call/Devices/SpeakerDevices';
import { VideoDevices } from '@/components/Call/Devices/VideoDevices';

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
