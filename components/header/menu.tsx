import React, { useCallback } from 'react';
import { useBroadcast } from '@/states/broadcastState';
import {
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { useLiveStream } from '@/hooks/useLiveStream';
import { useRecord } from '@/hooks/useRecord';
import { Button } from '@/components/ui/button';
import { ViewerCount } from '@/components/header/viewerCount';

export function HeaderMenu() {
  const localSessionId = useLocalSessionId();
  const isOwner = useParticipantProperty(localSessionId, 'owner');

  const { isLiveStreaming, stopLiveStreaming } = useLiveStream();

  const { isRecording, stopRecording, startRecording } = useRecord();
  const [, setBroadcast] = useBroadcast();

  const handleRecord = useCallback(
    () => (isRecording ? stopRecording() : startRecording()),
    [isRecording, startRecording, stopRecording]
  );

  const handleLiveStream = useCallback(
    () => (isLiveStreaming ? stopLiveStreaming() : setBroadcast(true)),
    [isLiveStreaming, setBroadcast, stopLiveStreaming]
  );

  if (isOwner) {
    return (
      <div className="flex items-center justify-center gap-x-2">
        <Button
          size="sm"
          variant={isRecording ? 'destructive' : 'outline'}
          onClick={handleRecord}
        >
          {isRecording ? 'Stop' : 'Record'}
        </Button>
        <Button
          size="sm"
          variant={isLiveStreaming ? 'destructive' : 'default'}
          onClick={handleLiveStream}
        >
          {isLiveStreaming ? 'End broadcast' : 'Broadcast'}
        </Button>
      </div>
    );
  }

  return <ViewerCount />;
}
