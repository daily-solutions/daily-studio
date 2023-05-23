import { atom, useRecoilState } from 'recoil';

const createRTMPState = atom<boolean>({
  key: 'create-rtmp-state',
  default: false,
});

export const useCreateRTMP = () => useRecoilState(createRTMPState);
