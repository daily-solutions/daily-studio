import React, { useCallback, useMemo } from 'react';
import { Button } from '@/ui/Button';
import { Label } from '@/ui/Label';

import { useStage } from '@/hooks/useStage';
import { Icons } from '@/components/Icons';

export function Viewer({
  sessionId,
  userName,
}: {
  sessionId: string;
  userName: string;
}) {
  const { invite, requestedParticipants, accept, deny } = useStage();

  const isRequesting = useMemo(
    () => Boolean(requestedParticipants?.[sessionId]),
    [requestedParticipants, sessionId]
  );

  const handleInviteToStage = useCallback(
    () => (isRequesting ? accept(sessionId) : invite(sessionId)),
    [accept, invite, isRequesting, sessionId]
  );

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={sessionId}>{userName || 'Guest'}</Label>
      <div className="flex items-center gap-x-2">
        <Button
          variant={isRequesting ? 'outline' : 'default'}
          size="xs"
          onClick={handleInviteToStage}
        >
          <Icons.userPlus className="mr-2 h-4 w-4" />
          <span>{isRequesting ? 'Accept' : 'Invite'}</span>
        </Button>
        {isRequesting && (
          <Button
            variant="destructive"
            size="xs"
            onClick={() => deny(sessionId)}
          >
            <Icons.userMinus className="mr-2 h-4 w-4" />
            <span>Decline</span>
          </Button>
        )}
      </div>
    </div>
  );
}
