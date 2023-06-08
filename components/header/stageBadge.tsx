import { useMeetingState } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useStage } from '@/hooks/useStage';
import { Badge } from '@/components/ui/badge';

export function StageBadge() {
  const isOwner = useIsOwner();
  const meetingState = useMeetingState();
  const { onStage, waitingForHost } = useStage();

  if (meetingState !== 'joined-meeting') return null;

  return (
    <>
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
    </>
  );
}
