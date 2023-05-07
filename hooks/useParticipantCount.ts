import { useCallback, useEffect } from 'react';
import {
  DailyEventObjectParticipantCounts,
  DailyParticipantCounts,
} from '@daily-co/daily-js';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';
import { atom, useRecoilCallback, useRecoilValue } from 'recoil';

const participantCountsState = atom<DailyParticipantCounts>({
  key: 'participant-counts',
  default: {
    present: 0,
    hidden: 0,
  },
});

export const useParticipantCount = (): DailyParticipantCounts => {
  const daily = useDaily();
  const counts = useRecoilValue(participantCountsState);

  const setCounts = useRecoilCallback(
    ({ set }) =>
      (counts: DailyParticipantCounts) => {
        set(participantCountsState, counts);
      }
  );
  useEffect(() => {
    if (!daily) return;
    setCounts(daily.participantCounts());
  }, [daily, setCounts]);
  useDailyEvent(
    'participant-counts-updated',
    useCallback(
      (ev: DailyEventObjectParticipantCounts) => {
        setCounts(ev.participantCounts);
      },
      [setCounts]
    )
  );

  return counts;
};
