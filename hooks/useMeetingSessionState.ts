import { useCallback } from 'react';
import {
  DailyEventObjectMeetingSessionStateUpdated,
  DailySessionDataMergeStrategy,
} from '@daily-co/daily-js';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';
import { atom, useRecoilState } from 'recoil';

const meetingSessionState = atom<any>({
  key: 'meeting-session-state',
  default: {},
});

export const useMeetingSessionState = <T>(): [
  T,
  (data: unknown, mergeStrategy?: DailySessionDataMergeStrategy) => void
] => {
  const daily = useDaily();
  const [state, setState] = useRecoilState<T>(meetingSessionState);

  useDailyEvent(
    'meeting-session-state-updated',
    useCallback(
      (ev: DailyEventObjectMeetingSessionStateUpdated) =>
        setState(ev.meetingSessionState.data as T),
      [setState]
    )
  );

  useDailyEvent(
    'joined-meeting',
    useCallback(() => {
      if (!daily) return;

      setState(daily.meetingSessionState().data as T);
    }, [daily, setState])
  );

  const updateMeetingSessionData = useCallback(
    (data: unknown, mergeStrategy?: DailySessionDataMergeStrategy) => {
      if (!daily) return;

      daily.setMeetingSessionData(data, mergeStrategy);
    },
    [daily]
  );

  return [state, updateMeetingSessionData];
};
