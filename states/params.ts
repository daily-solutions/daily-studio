import { config } from '@/config';
import { atom, useRecoilState } from 'recoil';

export const initialParams = config.vcs;

const paramsState = atom<{ [key: string]: any }>({
  key: 'params-state',
  default: initialParams,
});

export const useParams = () => useRecoilState(paramsState);
