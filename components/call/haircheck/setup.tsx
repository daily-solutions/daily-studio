import { useCallback, useEffect } from 'react';
import {
  useDaily,
  useLocalSessionId,
  useMeetingState,
} from '@daily-co/daily-react';
import { Tile } from 'components/tile';

import { useIsOwner } from '@/hooks/useIsOwner';
import { Button } from '@/components/ui/button';
import { Devices } from '@/components/call/devices';
import { Audio } from '@/components/call/tray/audio';
import { Video } from '@/components/call/tray/video';

export function Setup({ onJoin = () => {} } = {}) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const meetingState = useMeetingState();
  const isOwner = useIsOwner();

  useEffect(() => {
    if (!daily || meetingState === 'joined-meeting') return;

    daily.startCamera();
  }, [daily, meetingState]);

  const handleJoin = useCallback(async () => {
    if (!daily) return;

    if (meetingState !== 'joined-meeting')
      await daily.join({
        userData: isOwner ? { onStage: true } : { acceptedToJoin: true },
      });
    else await daily.setUserData({ acceptedToJoin: true });

    onJoin?.();
  }, [daily, isOwner, meetingState, onJoin]);

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
        <Button onClick={handleJoin}>Join</Button>
      </div>
      <div className="p-4">
        <Devices />
      </div>
    </div>
  );
}
