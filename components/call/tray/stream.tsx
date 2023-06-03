import React, { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useLiveStream } from '@/hooks/useLiveStream';
import { TrayButton } from '@/components/ui/trayButton';

export function Stream() {
  const isOwner = useIsOwner();
  const { isLiveStreaming, stopLiveStreaming } = useLiveStream();
  const [, setBroadcast] = useBroadcast();

  const handleLiveStream = useCallback(
    () => (isLiveStreaming ? stopLiveStreaming() : setBroadcast(true)),
    [isLiveStreaming, setBroadcast, stopLiveStreaming]
  );

  if (!isOwner) return null;

  return (
    <TrayButton
      muted={isLiveStreaming}
      onClick={handleLiveStream}
      text={isLiveStreaming ? 'Stop' : 'Stream'}
      icon="broadcast"
    />
  );
}
