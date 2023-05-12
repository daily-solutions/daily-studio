import { atom, useRecoilState } from 'recoil';

export type RTMP = {
  name: string;
  platform: string;
  streamURL: string;
  streamKey: string;
};

const rtmpState = atom<Record<string, RTMP>>({
  key: 'rtmp-state',
  default: {},
});

export const useRTMP = () => useRecoilState(rtmpState);
