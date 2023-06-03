import { useMeetingState } from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';
import { Badge } from '@/components/ui/badge';

export function StageBadge() {
  const meetingState = useMeetingState();
  const { onStage } = useStage();

  if (meetingState !== 'joined-meeting' || !onStage) return null;

  return (
    <Badge variant="destructive" className="px-2 py-1">
      You are on stage
    </Badge>
  );
}
