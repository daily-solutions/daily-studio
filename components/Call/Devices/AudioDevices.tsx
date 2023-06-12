import { useMemo } from 'react';
import { Label } from '@/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select';
import { useDevices } from '@daily-co/daily-react';

const DEVICES_NOT_FOUND = ['idle', 'pending'];

export function AudioDevices() {
  const { microphones, setMicrophone, micState } = useDevices();

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
          <SelectValue placeholder="Unmute microphone to allow access" />
        </SelectTrigger>
        <SelectContent>
          {DEVICES_NOT_FOUND.includes(micState) && (
            <SelectItem value="">Unmute microphone to allow access</SelectItem>
          )}
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
