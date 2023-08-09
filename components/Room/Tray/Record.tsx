import React, { useCallback } from 'react';
import { config } from '@/config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ui/DropdownMenu';
import { Icon } from '@/ui/Icons';
import { TrayButton } from '@/ui/TrayButton';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useRecord } from '@/hooks/useRecord';

interface Props {
  mobileUi?: boolean;
}

export function Record({ mobileUi = false }: Props) {
  const isOwner = useIsOwner();
  const { isRecording, stopRecording, startRecording } = useRecord();

  const handleRecord = useCallback(
    () => (isRecording ? stopRecording() : startRecording()),
    [isRecording, startRecording, stopRecording],
  );

  if (!isOwner || !config?.options?.enable_recording) return null;

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TrayButton
          className="hidden md:block"
          muted={isRecording}
          onClick={handleRecord}
          text={isRecording ? 'Stop' : 'Record'}
          icon={isRecording ? 'recordOff' : 'record'}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-max">
        <DropdownMenuLabel>Record</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleRecord}>
          {isRecording ? (
            <>
              <Icon icon="recordOff" className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Icon icon="record" className="mr-2 h-4 w-4" />
              Start Recording
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
