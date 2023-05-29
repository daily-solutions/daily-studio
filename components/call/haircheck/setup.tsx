import { useEffect } from 'react';
import { useDaily, useLocalSessionId } from '@daily-co/daily-react';

import { Button } from '@/components/ui/button';
import { Tile } from '@/components/Tile';
import { Devices } from '@/components/call/devices';
import { Audio } from '@/components/call/tray/audio';
import { Video } from '@/components/call/tray/video';

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
        <Tile sessionId={localSessionId} />
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
