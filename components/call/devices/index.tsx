import { AudioDevices } from '@/components/call/devices/audioDevices';
import { SpeakerDevices } from '@/components/call/devices/speakerDevices';
import { VideoDevices } from '@/components/call/devices/videoDevices';

export function Devices() {
  return (
    <div className="flex flex-col gap-y-3">
      <VideoDevices />
      <AudioDevices />
      <SpeakerDevices />
    </div>
  );
}
