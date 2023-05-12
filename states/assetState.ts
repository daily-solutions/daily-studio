import { atom, useRecoilState } from 'recoil';

export type Asset = {
  id: string;
  name: string;
  url: string;
  size: number;
};

const assetsState = atom<{ [key: string]: Asset }>({
  key: 'assets-state',
  default: {},
});

export const useAssets = () => useRecoilState(assetsState);
