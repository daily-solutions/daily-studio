import { useMemo } from 'react';
import { useDevices } from '@daily-co/daily-react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SpeakerDevices() {
  const { speakers, setSpeaker } = useDevices();

  const selectedSpeaker = useMemo(
    () => speakers.find((speaker) => speaker.selected),
    [speakers]
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Label className="text-xs">Speaker</Label>
      <Select
        value={selectedSpeaker?.device.deviceId}
        onValueChange={(value) => setSpeaker(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="System default" />
        </SelectTrigger>
        <SelectContent>
          {speakers.map((speaker) => (
            <SelectItem
              key={speaker.device.deviceId}
              value={speaker.device.deviceId}
            >
              {speaker.device.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
