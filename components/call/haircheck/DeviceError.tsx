import { useDevices } from '@daily-co/daily-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { DeviceBlocked } from '@/components/call/haircheck/DeviceBlocked';
import { DevicePending } from '@/components/call/haircheck/DevicePending';

export function DeviceError() {
  const { camState, micState } = useDevices();

  const isPending = camState === 'pending' || micState === 'pending';
  const isBlocked = camState === 'blocked' || micState === 'blocked';

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
        {isPending && <DevicePending />}
        {isBlocked && <DeviceBlocked />}
      </div>
    </AspectRatio>
  );
}
