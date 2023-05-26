import React, { useCallback, useMemo } from 'react';

import { useStage } from '@/hooks/useStage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';

export function Viewer({
  sessionId,
  userName,
}: {
  sessionId: string;
  userName: string;
}) {
  const {
    inviteToStage,
    requestedParticipants,
    acceptRequestToJoin,
    declineRequestToJoin,
  } = useStage();

  const isRequesting = useMemo(
    () => Boolean(requestedParticipants?.[sessionId]),
    [requestedParticipants, sessionId]
  );

  const handleInviteToStage = useCallback(
    () =>
      isRequesting ? acceptRequestToJoin(sessionId) : inviteToStage(sessionId),
    [acceptRequestToJoin, inviteToStage, isRequesting, sessionId]
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
            onClick={() => declineRequestToJoin(sessionId)}
          >
            <Icons.userMinus className="mr-2 h-4 w-4" />
            <span>Decline</span>
          </Button>
        )}
      </div>
    </div>
  );
}
