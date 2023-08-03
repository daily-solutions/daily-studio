import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/Popover';
import { usePermissions } from '@daily-co/daily-react';

import { AudioDevices } from '@/components/Room/Devices/AudioDevices';
import { SpeakerDevices } from '@/components/Room/Devices/SpeakerDevices';
import { VideoDevices } from '@/components/Room/Devices/VideoDevices';

export function Settings() {
  const { canSendAudio, canSendVideo } = usePermissions();
  return (
    <Popover>
      <PopoverTrigger className="hidden md:block" asChild>
        <Button variant="ghost" size="trayButton" className="text-inherit">
          <div className="flex flex-col items-center justify-center gap-y-1">
            <Icon icon="settings" className="h-6 w-6" />
            <p className="text-xs">Settings</p>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="flex min-w-max flex-col gap-y-3">
        {canSendVideo && <VideoDevices />}
        {canSendAudio && <AudioDevices />}
        <SpeakerDevices />
      </PopoverContent>
    </Popover>
  );
}
