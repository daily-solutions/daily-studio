import React, { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useLiveStream } from '@/hooks/useLiveStream';
import { TrayButton } from '@/components/ui/trayButton';
import { Icon } from '@/components/icons';

interface Props {
  mobileUi?: boolean;
}

export function Stream({ mobileUi = false }: Props) {
  const isOwner = useIsOwner();
  const { isLiveStreaming, stopLiveStreaming } = useLiveStream();
  const [, setBroadcast] = useBroadcast();

  const handleLiveStream = useCallback(
    () => (isLiveStreaming ? stopLiveStreaming() : setBroadcast(true)),
    [isLiveStreaming, setBroadcast, stopLiveStreaming]
  );

  if (!isOwner) return null;

  if (mobileUi) {
    return (
      <>
        <Icon icon="broadcast" className="mr-2 h-4 w-4" />
        <span>{isLiveStreaming ? 'Stop' : 'Stream'}</span>
      </>
    );
  }

  return (
    <TrayButton
      className="hidden md:block"
      muted={isLiveStreaming}
      onClick={handleLiveStream}
      text={isLiveStreaming ? 'Stop' : 'Stream'}
      icon="broadcast"
    />
  );
}
