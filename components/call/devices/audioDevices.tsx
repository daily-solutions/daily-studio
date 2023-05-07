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

export function AudioDevices() {
  const { microphones, setMicrophone } = useDevices();

  const selectedMicrophone = useMemo(
    () => microphones.find((microphone) => microphone.selected),
    [microphones]
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Label className="text-xs">Microphone</Label>
      <Select
        value={selectedMicrophone?.device.deviceId}
        onValueChange={(value) => setMicrophone(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Microphone" />
        </SelectTrigger>
        <SelectContent>
          {microphones.map((microphone) => (
            <SelectItem
              key={microphone.device.deviceId}
              value={microphone.device.deviceId}
            >
              {microphone.device.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
