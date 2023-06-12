import { Badge } from '@/ui/Badge';
import { useMeetingState } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useLiveStream } from '@/hooks/useLiveStream';
import { useRecord } from '@/hooks/useRecord';
import { useStage } from '@/hooks/useStage';

export function StatusBadge() {
  const isOwner = useIsOwner();
  const meetingState = useMeetingState();
  const { state } = useStage();

  const { isLiveStreaming } = useLiveStream();
  const { isRecording } = useRecord();

  const isOnStage = state === 'on-stage';
  const isOnBackStage = state === 'back-stage';

  if (meetingState !== 'joined-meeting') return null;

  return (
    <div className="flex items-center justify-center gap-3">
      {(isOnStage || isOnBackStage) && (
        <Badge
          variant={isOnStage ? 'destructive' : 'default'}
          className="px-2 py-1"
        >
          {isOnStage
            ? 'You are on stage'
            : isOwner
            ? 'You are not on stage'
            : 'Waiting for host to bring you on stage'}
        </Badge>
      )}
      {isLiveStreaming && <Badge className="px-2 py-1">Live</Badge>}
      {isRecording && (
        <Badge variant="destructive" className="px-2 py-1">
          Recording
        </Badge>
      )}
    </div>
  );
}
