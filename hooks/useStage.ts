import { useCallback, useMemo } from 'react';
import { useJoinStage } from '@/states/joinStageState';
import { useIsRequesting, useRequestedParticipants } from '@/states/stageState';
import { useToast } from '@/ui/useToast';
import {
  DailyEventObjectAppMessage,
  DailyParticipant,
} from '@daily-co/daily-js';
import {
  useAppMessage,
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useParticipantProperty,
  usePermissions,
} from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

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

type DenyRequestToJoinStage = {
  event: 'deny-request-to-join-stage';
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
  | DenyRequestToJoinStage
  | InviteToStage
  | RemoveFromStage
  | VisibleOnStage
  | HideOnStage;

interface Props {
  onRequestToJoin?(data: RequestToJoinStage['payload']): void;
}

export const useStage = ({ onRequestToJoin }: Props = {}) => {
  const daily = useDaily();
  const isOwner = useIsOwner();

  const localSessionId = useLocalSessionId();
  const [userName, userData] = useParticipantProperty(localSessionId, [
    'user_name',
    'userData',
  ]);
  const { hasPresence } = usePermissions();

  const [isRequesting, setIsRequesting] = useIsRequesting();
  const [requestedParticipants, setRequestedParticipants] =
    useRequestedParticipants();
  const [, setJoinStage] = useJoinStage();

  const { toast } = useToast();
  const sendAppMessage = useAppMessage<AppMessage>();

  const handleRequestToJoin = useCallback(
    (payload: RequestToJoinStage['payload'], runOnJoin = true) => {
      if (!isOwner) return;

      setRequestedParticipants((prev) => ({
        ...prev,
        [payload.sessionId]: payload,
      }));
      if (runOnJoin) onRequestToJoin?.(payload);
    },
    [isOwner, onRequestToJoin, setRequestedParticipants]
  );

  const handleCancelRequestToJoin = useCallback(
    (sessionId: string) => {
      if (!isOwner) return;

      setRequestedParticipants((prev) => {
        const next = { ...prev };
        delete next[sessionId];
        return next;
      });
    },
    [isOwner, setRequestedParticipants]
  );

  const handleAccept = useCallback(
    (payload: AcceptRequestToJoinStage['payload']) => {
      if (isOwner) {
        setRequestedParticipants((prev) => {
          const next = { ...prev };
          delete next[payload.sessionId];
          return next;
        });
      } else if (localSessionId === payload.sessionId) {
        setIsRequesting(false);
        setJoinStage(true);
      }
    },
    [
      isOwner,
      localSessionId,
      setIsRequesting,
      setJoinStage,
      setRequestedParticipants,
    ]
  );

  const handleDeny = useCallback(
    (payload: DenyRequestToJoinStage['payload']) => {
      if (isOwner) {
        setRequestedParticipants((prev) => {
          const next = { ...prev };
          delete next[payload.sessionId];
          return next;
        });
      } else if (localSessionId === payload.sessionId) {
        setIsRequesting(false);
        toast({
          title: 'You have been declined to join the stage.',
          description: 'You can still watch the stage.',
        });
      }
    },
    [isOwner, localSessionId, setIsRequesting, setRequestedParticipants, toast]
  );

  const handleInvite = useCallback(
    (payload: InviteToStage['payload']) => {
      if (isOwner) {
        setRequestedParticipants((prev) => {
          const next = { ...prev };
          delete next[payload.sessionId];
          return next;
        });
      } else if (localSessionId === payload.sessionId) {
        setIsRequesting(false);
        setJoinStage(true);
        toast({
          title: 'You have been invited to join the stage.',
          description: 'You can unmute yourself to speak.',
        });
      }
    },
    [
      isOwner,
      localSessionId,
      setIsRequesting,
      setJoinStage,
      setRequestedParticipants,
      toast,
    ]
  );

  const handleRemove = useCallback(
    (payload: RemoveFromStage['payload']) => {
      if (!daily || payload.sessionId !== localSessionId) return;

      setIsRequesting(false);
      daily
        .setUserData({ onStage: false, acceptedToJoin: false })
        .then(() => {
          toast({
            title: 'You have been removed from the stage.',
            description: 'You can still watch the stage.',
            variant: 'destructive',
          });
        })
        .catch((err) => console.error(err));
    },
    [daily, localSessionId, setIsRequesting, toast]
  );

  const handleStageVisibility = useCallback(
    (payload: VisibleOnStage['payload'], visible = true) => {
      if (!daily) return;

      if (payload.sessionId === localSessionId) {
        daily
          .setUserData({ acceptedToJoin: true, onStage: visible })
          .then(() => {
            if (visible) {
              toast({
                title: 'You are now visible on stage.',
                description: 'You can unmute yourself to speak.',
              });
            } else {
              toast({
                title: 'You are now hidden from stage.',
                description:
                  'You can still watch the stage and wait for your turn.',
                variant: 'destructive',
              });
            }
          })
          .catch((err) => console.error(err));
      }
    },
    [daily, localSessionId, toast]
  );

  const appMessage = useCallback(
    (ev: DailyEventObjectAppMessage<AppMessage>) => {
      if (!ev?.data?.event) return;

      const { data, fromId } = ev;

      switch (data.event) {
        case 'request-to-join-stage':
          handleRequestToJoin(data.payload);
          break;
        case 'cancel-request-to-join-stage':
          handleCancelRequestToJoin(fromId);
          break;
        case 'accept-request-to-join-stage':
          handleAccept(data.payload);
          break;
        case 'deny-request-to-join-stage':
          handleDeny(data.payload);
          break;
        case 'invite-to-stage':
          handleInvite(data.payload);
          break;
        case 'remove-from-stage':
          handleRemove(data.payload);
          break;
        case 'visible-on-stage':
        case 'hide-on-stage':
          handleStageVisibility(
            data.payload,
            data.event === 'visible-on-stage'
          );
          break;
        default:
          break;
      }
    },
    [
      handleAccept,
      handleCancelRequestToJoin,
      handleDeny,
      handleInvite,
      handleRemove,
      handleRequestToJoin,
      handleStageVisibility,
    ]
  );

  /*
   * requestToJoin
   * This function is used for non-presence users to request to join the stage.
   */
  const requestToJoin = useCallback(() => {
    if (isOwner) return;

    setIsRequesting(true);
    // send message to everyone in the call, so the owners can receive the message.
    sendAppMessage({
      event: 'request-to-join-stage',
      payload: { sessionId: localSessionId, userName },
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

  /*
   * cancelRequestToJoin
   * This function is used for non-presence users to cancel their request to join the stage.
   */
  const cancelRequestToJoin = useCallback(() => {
    if (isOwner) return;

    setIsRequesting(false);
    // send message to everyone in the call, so the owners can receive the message.
    sendAppMessage({ event: 'cancel-request-to-join-stage' });

    toast({
      title: 'Cancel request to join stage',
      description: 'Your request to join the stage has been canceled.',
    });
  }, [isOwner, sendAppMessage, setIsRequesting, toast]);

  /*
   * accept
   * This function is used by owners to accept a request to join the stage.
   */
  const accept = useCallback(
    (sessionId: string) => {
      if (!isOwner || !daily) return;

      daily.updateParticipant(sessionId, {
        updatePermissions: {
          canSend: true,
          hasPresence: true,
        },
      });
      handleAccept({ sessionId });
      sendAppMessage({
        event: 'accept-request-to-join-stage',
        payload: { sessionId },
      });
    },
    [daily, handleAccept, isOwner, sendAppMessage]
  );

  /*
   * deny
   * This function is used by owners to deny a request to join the stage.
   */
  const deny = useCallback(
    (sessionId: string) => {
      if (!isOwner) return;

      handleDeny({ sessionId });
      sendAppMessage({
        event: 'deny-request-to-join-stage',
        payload: { sessionId },
      });
    },
    [handleDeny, isOwner, sendAppMessage]
  );

  /*
   * invite
   * This function is used by owners to invite a user to the stage.
   */
  const invite = useCallback(
    (sessionId: string) => {
      if (!isOwner || !daily) return;

      daily.updateParticipant(sessionId, {
        updatePermissions: {
          canSend: true,
          hasPresence: true,
        },
      });
      handleInvite({ sessionId });
      sendAppMessage({
        event: 'invite-to-stage',
        payload: { sessionId },
      });
    },
    [daily, handleInvite, isOwner, sendAppMessage]
  );

  /*
   * remove
   * This function is used by owners to remove a user to the stage.
   */
  const remove = useCallback(
    (sessionId: string) => {
      if (!isOwner || !daily) return;

      // remove permissions of the participant
      daily.updateParticipant(sessionId, {
        updatePermissions: {
          canSend: false,
          hasPresence: false,
        },
      });
      sendAppMessage({
        event: 'remove-from-stage',
        payload: { sessionId },
      });
    },
    [daily, isOwner, sendAppMessage]
  );

  /*
   * setStageVisibility
   * This function is used by owners to manage the backstage.
   */
  const setStageVisibility = useCallback(
    (sessionId: string, visible: boolean = true) => {
      if (!isOwner || !daily) return;

      handleStageVisibility({ sessionId }, visible);
      sendAppMessage({
        event: visible ? 'visible-on-stage' : 'hide-on-stage',
        payload: { sessionId },
      });
    },
    [daily, handleStageVisibility, isOwner, sendAppMessage]
  );

  type State =
    | 'on-stage'
    | 'back-stage'
    | 'request-to-join'
    | 'invited-to-stage';

  const state: State = useMemo(() => {
    if (!hasPresence) return 'request-to-join';
    else {
      if (userData?.['onStage']) return 'on-stage';
      else if (userData?.['acceptedToJoin']) return 'back-stage';
      else return 'invited-to-stage';
    }
  }, [hasPresence, userData]);

  const participantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        (p.userData?.['onStage'] ||
          p?.participantType === 'remote-media-player'),
      []
    ),
  });

  const waitingParticipantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        p.userData?.['acceptedToJoin'] &&
        !p.userData?.['onStage'],
      []
    ),
  });

  return {
    isRequesting,
    requestedParticipants,
    appMessage,
    state,
    // participants list
    participantIds,
    waitingParticipantIds,
    // methods
    requestToJoin,
    cancelRequestToJoin,
    accept,
    deny,
    invite,
    remove,
    setStageVisibility,
  };
};
