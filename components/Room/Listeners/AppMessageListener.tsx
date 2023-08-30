import { useCallback, useRef, useState } from 'react';
import { useMessages } from '@/states/messagesState';
import { useAppMessage, useDaily, useDailyEvent } from '@daily-co/daily-react';

const MAX_SYNC_TIME = 10000;

export function AppMessageListener() {
  const daily = useDaily();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isWaitingForSync, setIsWaitingForSync] = useState(true);
  const [messages, setMessages] = useMessages();

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      (ev) => {
        if (ev.data?.event !== 'message' || !daily) return;

        switch (ev.data.type) {
          case 'requesting-for-sync':
            if (isWaitingForSync) return;

            daily.sendAppMessage(
              { event: 'message', type: 'sync-messages', messages },
              ev.fromId,
            );
            break;
          case 'sync-messages':
            if (!isWaitingForSync) return;
            setIsWaitingForSync(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            const newMsgs = ev.data.messages.map((message) => ({
              ...message,
              fromId: ev.fromId,
              isLocal: false,
              receivedAt: new Date(),
            }));
            setMessages(newMsgs);
            break;
          default:
            const { event, ...rest } = ev.data;
            setMessages((messages) => [
              ...messages,
              {
                ...rest,
                fromId: ev.fromId,
                isLocal: false,
                receivedAt: new Date(),
              },
            ]);
            break;
        }
      },
      [daily, isWaitingForSync, messages, setMessages],
    ),
  });

  useDailyEvent(
    'joined-meeting',
    useCallback(() => {
      timeoutRef.current = setTimeout(() => {
        setIsWaitingForSync(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, MAX_SYNC_TIME);

      const randomDelay = Math.floor(Math.random() * 1000) + 1000;
      intervalRef.current = setInterval(() => {
        if (!daily) return;

        const { local, ...participants } = daily.participants();

        // if there are no participants, we don't need to sync messages
        if (Object.keys(participants).length === 0) {
          setIsWaitingForSync(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          return;
        }

        const randomParticipant = Object.values(participants).find(
          (p) => (p?.joined_at ?? 0) < (local.joined_at ?? 0),
        );
        sendAppMessage(
          { event: 'message', type: 'requesting-for-sync' },
          randomParticipant?.session_id,
        );
      }, randomDelay);
    }, [daily, sendAppMessage]),
  );

  return null;
}
