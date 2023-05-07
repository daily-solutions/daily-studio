import { DailyMeetingState } from '@daily-co/daily-js';
import { atom, useRecoilState } from 'recoil';

export type MeetingState = DailyMeetingState;

const meetingState = atom<MeetingState>({
  key: 'meeting-state',
  default: 'loading',
});

export const useMeetingState = () => useRecoilState(meetingState);
