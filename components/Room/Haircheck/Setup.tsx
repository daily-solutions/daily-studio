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

import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useIsOwner } from '@/hooks/useIsOwner';
import { Devices } from '@/components/Room/Devices';
import { DeviceError } from '@/components/Room/Haircheck/DeviceError';
import { Audio } from '@/components/Room/Tray/Audio';
import { Video } from '@/components/Room/Tray/Video';
import { Tile } from '@/components/Tile';

export function Setup({ onJoin = () => {} } = {}) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const meetingState = useMeetingState();
  const isOwner = useIsOwner();
  const isMobile = useIsMobile();

  const { hasCamError, hasMicError, camState, micState } = useDevices();

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

  const permissionsGranted = useMemo(
    () => camState === 'granted' && micState === 'granted',
    [camState, micState],
  );

  const videoDisabled = useMemo(
    () => hasCamError || camState !== 'granted',
    [camState, hasCamError],
  );

  const audioDisabled = useMemo(
    () => hasMicError || micState !== 'granted',
    [hasMicError, micState],
  );

  return (
    <div>
      <div className="border-b">
        {permissionsGranted ? (
          <Tile
            videoFit="cover"
            sessionId={localSessionId}
            aspectRatio={isMobile ? MOBILE_ASPECT_RATIO : DESKTOP_ASPECT_RATIO}
          />
        ) : (
          <DeviceError />
        )}
      </div>
      <div
        className={cn(
          'flex items-center justify-between p-2',
          permissionsGranted && 'border-b',
        )}
      >
        <div className="flex items-center justify-center">
          <Video disabled={videoDisabled} />
          <Audio disabled={audioDisabled} />
        </div>
        <Button disabled={!permissionsGranted} onClick={handleJoin}>
          Join
        </Button>
      </div>
      {permissionsGranted && (
        <div className="p-4">
          <Devices />
        </div>
      )}
    </div>
  );
}
