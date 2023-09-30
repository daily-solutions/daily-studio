import { useCallback, useEffect, useMemo } from 'react';
import {
  DESKTOP_ASPECT_RATIO,
  MOBILE_ASPECT_RATIO,
} from '@/constants/aspectRatio';
import { Button } from '@/ui/Button';
import {
  useDaily,
  useDevices,
  useLocalSessionId,
  useMeetingState,
} from '@daily-co/daily-react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';
import { Devices } from '@/components/Room/Devices';
import { DeviceStates } from '@/components/Room/Haircheck/DeviceStates';
import { Tile } from '@/components/Room/Tile';
import { Audio } from '@/components/Room/Tray/Audio';
import { Video } from '@/components/Room/Tray/Video';

export function Setup({ onJoin = () => {} } = {}) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const meetingState = useMeetingState();
  const isOwner = useIsOwner();
  const isMobile = useIsMobile();

  const { camState, micState } = useDevices();

  useEffect(() => {
    if (!daily || meetingState === 'joined-meeting') return;

    daily.startCamera();
  }, [daily, meetingState]);

  const handleJoin = useCallback(async () => {
    if (!daily) return;

    if (meetingState === 'joined-meeting') {
      await daily.setUserData({ acceptedToJoin: true });
    } else {
      await daily.join({
        userData: isOwner ? { onStage: true } : { acceptedToJoin: true },
      });
    }

    onJoin?.();
  }, [daily, isOwner, meetingState, onJoin]);

  const hasMicAndCam = useMemo(
    () => camState === 'granted' && micState === 'granted',
    [camState, micState],
  );

  return (
    <div>
      <div className="border-b">
        {hasMicAndCam ? (
          <Tile
            videoFit="cover"
            sessionId={localSessionId}
            aspectRatio={isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO}
          />
        ) : (
          <DeviceStates />
        )}
      </div>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center justify-center">
          <Video />
          <Audio />
        </div>
        <Button disabled={!hasMicAndCam} onClick={handleJoin}>
          Join
        </Button>
      </div>
      {hasMicAndCam && (
        <div className="border-t p-4">
          <Devices />
        </div>
      )}
    </div>
  );
}
