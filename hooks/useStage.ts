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

type AppMessage =
  | RequestToJoinStage
  | CancelRequestToJoinStage
  | AcceptRequestToJoinStage;

interface Props {
  onRequestToJoin?(data: RequestToJoinStage['payload']): void;
}

export const useStage = ({ onRequestToJoin }: Props = {}) => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const [userName, isOwner] = useParticipantProperty(localSessionId as string, [
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
      switch (ev.data.event) {
        case 'request-to-join-stage':
          if (!isOwner) return;

          const { payload: requestPayload } = ev.data as RequestToJoinStage;
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
          const { payload: acceptPayload } =
            ev.data as AcceptRequestToJoinStage;
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
        default:
          break;
      }
    },
    [
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

  const toggleRequestToJoin = useCallback(
    () => (isRequesting ? cancelRequestToJoin() : requestToJoin()),
    [cancelRequestToJoin, isRequesting, requestToJoin]
  );

  return {
    isRequesting,
    requestedParticipants,
    appMessage,
    requestToJoin,
    cancelRequestToJoin,
    acceptRequestToJoin,
    toggleRequestToJoin,
  };
};
