import { atom, useRecoilState } from 'recoil';

export type Quality = 'auto' | 'high' | 'medium' | 'low';

const qualityState = atom<Quality>({
  key: 'send-quality',
  default: 'auto',
});

export const useSendQualityState = () => useRecoilState(qualityState);
