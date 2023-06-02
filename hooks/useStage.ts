import { useCallback } from 'react';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import {
  useAppMessage,
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';
import { atom, useRecoilState } from 'recoil';

import { useToast } from '@/components/ui/use-toast';

type RequestedParticipant = {
  userName: string;
  sessionId: string;
};

const requestJoinState = atom<boolean>({
  key: 'request-join-state',
  default: false,
});

const requestedParticipantsState = atom<Record<string, RequestedParticipant>>({
  key: 'requested-participants-state',
  default: {},
});

type RequestToJoinStage = {
  event: 'request-to-join-stage';
  payload: {
    sessionId: string;
    userName: string;
  };
};

type CancelRequestToJoinStage = {
  event: 'cancel-request-to-join-stage';
};

type AcceptRequestToJoinStage = {
  event: 'accept-request-to-join-stage';
  payload: {
    sessionId: string;
  };
};

type DeclineRequestToJoinStage = {
  event: 'decline-request-to-join-stage';
  payload: {
    sessionId: string;
  };
};

type InviteToStage = {
  event: 'invite-to-stage';
  payload: {
    sessionId: string;
  };
};

type RemoveFromStage = {
  event: 'remove-from-stage';
  payload: {
    sessionId: string;
  };
};

type VisibleOnStage = {
  event: 'visible-on-stage';
  payload: {
    sessionId: string;
  };
};

type HideOnStage = {
  event: 'hide-on-stage';
  payload: {
    sessionId: string;
  };
};

type AppMessage =
  | RequestToJoinStage
  | CancelRequestToJoinStage
  | AcceptRequestToJoinStage
  | DeclineRequestToJoinStage
  | InviteToStage
  | RemoveFromStage
  | VisibleOnStage
  | HideOnStage;

interface Props {
  onRequestToJoin?(data: RequestToJoinStage['payload']): void;
}

export const useStage = ({ onRequestToJoin }: Props = {}) => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const [userName, isOwner] = useParticipantProperty(localSessionId, [
    'user_name',
    'owner',
  ]);

  const { toast } = useToast();

  const [isRequesting, setIsRequesting] = useRecoilState(requestJoinState);
  const [requestedParticipants, setRequestedParticipants] = useRecoilState(
    requestedParticipantsState
  );

  const appMessage = useCallback(
    (ev: DailyEventObjectAppMessage<AppMessage>) => {
      if (!ev.data?.event) return;

      switch (ev.data.event) {
        case 'request-to-join-stage':
          if (!isOwner) return;

          const { payload: requestPayload }: RequestToJoinStage = ev.data;
          setRequestedParticipants((prev) => ({
            ...prev,
            [requestPayload.sessionId]: requestPayload,
          }));
          onRequestToJoin?.(requestPayload);
          break;
        case 'cancel-request-to-join-stage':
          if (!isOwner) return;

          setRequestedParticipants((prev) => {
            const { [ev.fromId]: _, ...rest } = prev;
            return rest;
          });
          break;
        case 'accept-request-to-join-stage':
          const { payload: acceptPayload }: AcceptRequestToJoinStage = ev.data;
          setRequestedParticipants((prev) => {
            const { [acceptPayload.sessionId]: _, ...rest } = prev;
            return rest;
          });
          if (localSessionId === acceptPayload.sessionId) {
            setIsRequesting(false);
            toast({
              title: 'You have been accepted to join the stage.',
              description: 'You can unmute yourself to speak.',
            });
          }
          break;
        case 'decline-request-to-join-stage':
          const { payload: declinePayload }: DeclineRequestToJoinStage =
            ev.data;
          setRequestedParticipants((prev) => {
            const { [declinePayload.sessionId]: _, ...rest } = prev;
            return rest;
          });
          if (localSessionId === declinePayload.sessionId) {
            setIsRequesting(false);
            toast({
              title: 'You have been declined to join the stage.',
              description: 'You can still watch the stage.',
            });
          }
          break;
        case 'invite-to-stage':
          const { payload: invitePayload }: InviteToStage = ev.data;
          setRequestedParticipants((prev) => {
            const { [invitePayload.sessionId]: _, ...rest } = prev;
            return rest;
          });
          if (localSessionId === invitePayload.sessionId) {
            setIsRequesting(false);
            toast({
              title: 'You have been invited to join the stage.',
              description: 'You can unmute yourself to speak.',
            });
          }
          break;
        case 'remove-from-stage':
          const { payload: removePayload }: RemoveFromStage = ev.data;
          if (localSessionId === removePayload.sessionId) {
            setIsRequesting(false);
            toast({
              title: 'You have been removed from the stage.',
              description: 'You can still watch the stage.',
              variant: 'destructive',
            });
          }
          break;
        case 'visible-on-stage':
          const { payload: visiblePayload }: VisibleOnStage = ev.data;
          if (localSessionId === visiblePayload.sessionId) {
            daily?.setUserData({ onStage: true });
            toast({
              title: 'You are now visible on stage.',
              description: 'You can unmute yourself to speak.',
            });
          }
          break;
        case 'hide-on-stage':
          const { payload: hidePayload }: HideOnStage = ev.data;
          if (localSessionId === hidePayload.sessionId) {
            daily?.setUserData({ onStage: false });
            toast({
              title: 'You are now hidden from stage.',
              description:
                'You can still watch the stage and wait for your turn.',
              variant: 'destructive',
            });
          }
          break;
        default:
          break;
      }
    },
    [
      daily,
      isOwner,
      localSessionId,
      onRequestToJoin,
      setIsRequesting,
      setRequestedParticipants,
      toast,
    ]
  );

  const sendAppMessage = useAppMessage();

  const requestToJoin = useCallback(() => {
    if (isOwner) return;

    setIsRequesting(true);
    sendAppMessage({
      event: 'request-to-join-stage',
      payload: {
        sessionId: localSessionId,
        userName,
      },
    });
    toast({
      title: 'Request to join stage',
      description: 'Your request to join the stage has been sent.',
    });
  }, [
    isOwner,
    localSessionId,
    sendAppMessage,
    setIsRequesting,
    toast,
    userName,
  ]);

  const cancelRequestToJoin = useCallback(() => {
    if (isOwner) return;

    setIsRequesting(false);
    sendAppMessage({ event: 'cancel-request-to-join-stage' });
    toast({
      title: 'Cancel request to join stage',
      description: 'Your request to join the stage has been canceled.',
    });
  }, [isOwner, sendAppMessage, setIsRequesting, toast]);

  const acceptRequestToJoin = useCallback(
    (sessionId: string) => {
      if (!isOwner || !daily) return;

      setRequestedParticipants((prev) => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
      sendAppMessage({
        event: 'accept-request-to-join-stage',
        payload: { sessionId },
      });
      daily.updateParticipant(sessionId, {
        updatePermissions: {
          canSend: true,
          hasPresence: true,
        },
      });
    },
    [daily, isOwner, sendAppMessage, setRequestedParticipants]
  );

  const declineRequestToJoin = useCallback(
    (sessionId: string) => {
      if (!daily || !isOwner) return;

      setRequestedParticipants((prev) => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
      sendAppMessage({
        event: 'decline-request-to-join-stage',
        payload: { sessionId },
      });
    },
    [daily, isOwner, sendAppMessage, setRequestedParticipants]
  );

  const toggleRequestToJoin = useCallback(
    () => (isRequesting ? cancelRequestToJoin() : requestToJoin()),
    [cancelRequestToJoin, isRequesting, requestToJoin]
  );

  const inviteToStage = useCallback(
    (sessionId: string) => {
      if (!daily || !isOwner) return;

      setRequestedParticipants((prev) => {
        const { [sessionId]: _, ...rest } = prev;
        return rest;
      });
      sendAppMessage({
        event: 'invite-to-stage',
        payload: { sessionId },
      });
      daily.updateParticipant(sessionId, {
        updatePermissions: {
          canSend: true,
          hasPresence: true,
        },
      });
    },
    [daily, isOwner, sendAppMessage, setRequestedParticipants]
  );

  const removeFromStage = useCallback(
    (sessionId: string) => {
      if (!daily || !isOwner) return;

      sendAppMessage({
        event: 'remove-from-stage',
        payload: { sessionId },
      });
      daily.updateParticipant(sessionId, {
        updatePermissions: {
          canSend: false,
          hasPresence: false,
        },
      });
    },
    [daily, isOwner, sendAppMessage]
  );

  const toggleStageVisibility = useCallback(
    async (sessionId: string) => {
      if (!daily || !isOwner) return;

      const participants = Object.values(daily.participants());
      const participant = participants.find((p) => p.session_id === sessionId);
      if (!participant) return;

      const visibleOnStage = Boolean(participant.userData?.['onStage']);
      if (participant.local) {
        await daily.setUserData({ onStage: !visibleOnStage });
      } else {
        sendAppMessage({
          event: visibleOnStage ? 'hide-on-stage' : 'visible-on-stage',
          payload: { sessionId },
        });
      }
    },
    [daily, isOwner, sendAppMessage]
  );

  return {
    isRequesting,
    requestedParticipants,
    appMessage,
    requestToJoin,
    cancelRequestToJoin,
    acceptRequestToJoin,
    declineRequestToJoin,
    toggleRequestToJoin,
    inviteToStage,
    removeFromStage,
    toggleStageVisibility,
  };
};
