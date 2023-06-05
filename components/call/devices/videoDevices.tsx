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

const DEVICES_NOT_FOUND = ['idle', 'pending'];

export function VideoDevices() {
  const { cameras, setCamera, camState } = useDevices();

  const selectedCamera = useMemo(
    () => cameras.find((cam) => cam.selected),
    [cameras]
  );

  return (
    <div className="flex flex-col gap-y-2">
      <Label className="text-xs">Camera</Label>
      <Select
        value={selectedCamera?.device.deviceId}
        onValueChange={(value) => setCamera(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Turn on camera to allow access" />
        </SelectTrigger>
        <SelectContent>
          {DEVICES_NOT_FOUND.includes(camState) && (
            <SelectItem value="">Turn on camera to allow access</SelectItem>
          )}
          {cameras.map((cam) => (
            <SelectItem key={cam.device.deviceId} value={cam.device.deviceId}>
              {cam.device.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
