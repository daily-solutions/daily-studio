import React, { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';
import { TrayButton } from '@/ui/TrayButton';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useLiveStream } from '@/hooks/useLiveStream';
import { Icon } from '@/components/Icons';

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
