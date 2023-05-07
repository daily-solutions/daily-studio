import { useEffect } from 'react';
import { useDaily, useLocalSessionId } from '@daily-co/daily-react';

import { Button } from '@/components/ui/button';
import { Devices } from '@/components/call/devices';
import { Audio } from '@/components/call/tray/audio';
import { Video } from '@/components/call/tray/video';
import { Tile } from '@/components/tile';

export function Setup() {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();

  useEffect(() => {
    if (!daily) return;

    daily.startCamera();
  }, [daily]);

  return (
    <div>
      <div className="border-b">
        <Tile sessionId={localSessionId as string} />
      </div>
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center justify-center">
          <Video />
          <Audio />
        </div>
        <Button onClick={() => daily?.join()}>Join</Button>
      </div>
      <div className="p-4">
        <Devices />
      </div>
    </div>
  );
}
