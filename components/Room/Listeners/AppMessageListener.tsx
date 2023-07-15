import React, { useCallback } from 'react';
import { useMessages } from '@/states/messagesState';
import { useAppMessage } from '@daily-co/daily-react';

export function AppMessageListener() {
  const [, setMessages] = useMessages();

  useAppMessage({
    onAppMessage: useCallback(
      (ev) => {
        const { event, ...rest } = ev.data;

        if (event !== 'message') return;

        setMessages((messages) => [
          ...messages,
          {
            ...rest,
            fromId: ev.fromId,
            isLocal: false,
            receivedAt: new Date(),
          },
        ]);
      },
      [setMessages]
    ),
  });

  return null;
}
