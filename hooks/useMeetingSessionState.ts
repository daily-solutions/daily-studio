import { useCallback } from 'react';
import { DailySessionDataMergeStrategy } from '@daily-co/daily-js';
import {
  useDaily,
  useMeetingSessionState as useDailyMeetingSessionState,
} from '@daily-co/daily-react';

export const useMeetingSessionState = <T>(): [
  T,
  (data: unknown, mergeStrategy?: DailySessionDataMergeStrategy) => void
] => {
  const daily = useDaily();
  const { data } = useDailyMeetingSessionState<T>();

  const updateMeetingSessionData = useCallback(
    (data: unknown, mergeStrategy?: DailySessionDataMergeStrategy) => {
      if (!daily) return;

      daily.setMeetingSessionData(data, mergeStrategy);
    },
    [daily]
  );

  return [data ?? ({} as T), updateMeetingSessionData];
};
