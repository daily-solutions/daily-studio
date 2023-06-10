import React, { useCallback } from 'react';
import { useMessages } from '@/states/messagesState';
import { useAppMessage } from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';
import { useSyncParams } from '@/hooks/useSyncParams';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function AppMessageListener() {
  const [, setMessages] = useMessages();

  const { toast } = useToast();
  const { acceptRequestToJoin } = useStage();

  const { appMessage } = useStage({
    onRequestToJoin: useCallback(
      ({ sessionId, userName }) => {
        toast({
          title: 'Request to join',
          description: `${userName} has requested to join the call`,
          action: (
            <ToastAction
              altText="Accept"
              onClick={() => acceptRequestToJoin(sessionId)}
            >
              Accept
            </ToastAction>
          ),
        });
      },
      [acceptRequestToJoin, toast]
    ),
  });

  const { appMessage: syncParamsAppMessage } = useSyncParams();

  useAppMessage({
    onAppMessage: useCallback(
      (ev) => {
        const { event, ...rest } = ev.data;

        if (event === 'message') {
          setMessages((messages) => [
            ...messages,
            {
              ...rest,
              fromId: ev.fromId,
              isLocal: false,
              receivedAt: new Date(),
            },
          ]);
        } else if (event === 'params') syncParamsAppMessage(ev);
        else appMessage(ev);
      },
      [appMessage, setMessages, syncParamsAppMessage]
    ),
  });

  return null;
}
