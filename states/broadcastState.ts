import { atom, useRecoilState } from 'recoil';

const broadcastState = atom<boolean>({
  key: 'broadcast-state',
  default: false,
});

export const useBroadcast = () => useRecoilState(broadcastState);
