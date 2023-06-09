import { useMeetingState } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useLiveStream } from '@/hooks/useLiveStream';
import { useRecord } from '@/hooks/useRecord';
import { useStage } from '@/hooks/useStage';
import { Badge } from '@/components/ui/badge';

export function StatusBadge() {
  const isOwner = useIsOwner();
  const meetingState = useMeetingState();
  const { onStage, waitingForHost } = useStage();

  const { isLiveStreaming } = useLiveStream();
  const { isRecording } = useRecord();

  if (meetingState !== 'joined-meeting') return null;

  return (
    <div className="flex items-center justify-center gap-3">
      {onStage && (
        <Badge variant="destructive" className="px-2 py-1">
          You are on stage
        </Badge>
      )}
      {waitingForHost && (
        <Badge className="px-2 py-1">
          {isOwner
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
