import { useCallback, useRef, useState } from 'react';
import { useParams } from '@/states/params';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage, useDaily, useDailyEvent } from '@daily-co/daily-react';

const MAX_SYNC_TIME = 10000;

export function ParamsListener() {
  const daily = useDaily();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isWaitingForSync, setIsWaitingForSync] = useState(true);
  const [params, setParams] = useParams();

  const sendAppMessage = useAppMessage({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage) => {
        if (ev.data?.event !== 'params' || !daily) return;

        switch (ev.data.type) {
          case 'requesting-for-sync':
            if (isWaitingForSync) return;

            daily.sendAppMessage(
              { event: 'params', type: 'sync-params', params },
              ev.fromId,
            );
            break;
          case 'sync-params':
            if (!isWaitingForSync) return;
            setIsWaitingForSync(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setParams(ev.data.params);
            break;
          default:
            setParams(ev.data.params);
            break;
        }
      },
      [daily, isWaitingForSync, params, setParams],
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

        // if there are no participants, we don't need to sync params
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
          { event: 'params', type: 'requesting-for-sync' },
          randomParticipant?.session_id,
        );
      }, randomDelay);
    }, [daily, sendAppMessage]),
  );

  return null;
}
