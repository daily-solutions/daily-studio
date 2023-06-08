import React, { useCallback } from 'react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useRecord } from '@/hooks/useRecord';
import { TrayButton } from '@/components/ui/trayButton';
import { Icon } from '@/components/icons';

interface Props {
  mobileUi?: boolean;
}

export function Record({ mobileUi = false }: Props) {
  const isOwner = useIsOwner();
  const { isRecording, stopRecording, startRecording } = useRecord();

  const handleRecord = useCallback(
    () => (isRecording ? stopRecording() : startRecording()),
    [isRecording, startRecording, stopRecording]
  );

  if (!isOwner) return null;

  if (mobileUi) {
    return (
      <>
        <Icon
          icon={isRecording ? 'recordOff' : 'record'}
          className="mr-2 h-4 w-4"
        />
        <span>{isRecording ? 'Stop' : 'Record'}</span>
      </>
    );
  }

  return (
    <TrayButton
      className="hidden md:block"
      muted={isRecording}
      onClick={handleRecord}
      text={isRecording ? 'Stop' : 'Record'}
      icon={isRecording ? 'recordOff' : 'record'}
    />
  );
}
