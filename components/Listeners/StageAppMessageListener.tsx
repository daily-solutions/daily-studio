import React, { useCallback } from 'react';
import { ToastAction } from '@/ui/Toast';
import { useToast } from '@/ui/useToast';
import { useAppMessage, useLocalSessionId } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useStage } from '@/hooks/useStage';

export function StageAppMessageListener() {
  const isOwner = useIsOwner();
  const localSessionId = useLocalSessionId();

  const { toast } = useToast();
  const { accept } = useStage();

  const { appMessage } = useStage({
    onRequestToJoin: useCallback(
      ({ sessionId, userName }: { sessionId: string; userName: string }) => {
        if (sessionId === localSessionId) {
          toast({
            title: 'Request to join stage',
            description: 'Your request to join the stage has been sent.',
          });
        } else if (isOwner) {
          toast({
            title: 'Request to join',
            description: `${userName} has requested to join the call`,
            action: (
              <ToastAction altText="Accept" onClick={() => accept(sessionId)}>
                Accept
              </ToastAction>
            ),
          });
        }
      },
      [accept, isOwner, localSessionId, toast],
    ),
    onCancelRequestToJoin: useCallback(
      ({ sessionId }: { sessionId: string }) => {
        if (sessionId === localSessionId) {
          toast({
            title: 'Cancel request to join stage',
            description: 'Your request to join the stage has been canceled.',
          });
        }
      },
      [localSessionId, toast],
    ),
    onDeny: useCallback(() => {
      toast({
        title: 'You have been declined to join the stage.',
        description: 'You can still watch the stage.',
      });
    }, [toast]),
    onInvitedToStage: useCallback(() => {
      toast({
        title: 'You have been invited to join the stage.',
        description: 'You can unmute yourself to speak.',
      });
    }, [toast]),
    onRemovedFromStage: useCallback(() => {
      toast({
        title: 'You have been removed from the stage.',
        description: 'You can still watch the stage.',
        variant: 'destructive',
      });
    }, [toast]),
    onStageVisibilityChange: useCallback(
      (data: { event?: string }) => {
        const visible = data?.event === 'visible-on-stage';
        toast({
          title: visible
            ? 'You are now visible on stage.'
            : 'You are now hidden from stage.',
          description: visible
            ? 'You can unmute yourself to speak.'
            : 'You can still watch the stage and wait for your turn.',
          variant: visible ? 'default' : 'destructive',
        });
      },
      [toast],
    ),
  });

  useAppMessage({ onAppMessage: appMessage });

  return null;
}
