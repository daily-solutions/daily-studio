import { atom, useRecoilState } from 'recoil';

export type RMP = {
  isPlaying: boolean;
  isPaused: boolean;
  sessionId: string;
  error?: string;
};

export const rmpState = atom<RMP>({
  key: 'rmp-state',
  default: {
    isPlaying: false,
    isPaused: false,
    sessionId: '',
  },
});

export const useRMPState = () => useRecoilState(rmpState);
