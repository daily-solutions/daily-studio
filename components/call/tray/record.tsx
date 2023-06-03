import React, { useCallback } from 'react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useRecord } from '@/hooks/useRecord';
import { TrayButton } from '@/components/ui/trayButton';

export function Record() {
  const isOwner = useIsOwner();
  const { isRecording, stopRecording, startRecording } = useRecord();

  const handleRecord = useCallback(
    () => (isRecording ? stopRecording() : startRecording()),
    [isRecording, startRecording, stopRecording]
  );

  if (!isOwner) return null;

  return (
    <TrayButton
      muted={isRecording}
      onClick={handleRecord}
      text={isRecording ? 'Stop' : 'Record'}
      icon={isRecording ? 'recordOff' : 'record'}
    />
  );
}
