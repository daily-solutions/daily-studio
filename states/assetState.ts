import { atom, useRecoilState } from 'recoil';

export type Asset = {
  name: string;
  url: string;
};

const assetsState = atom<{ [key: string]: Asset }>({
  key: 'assets-state',
  default: {},
});

export const useAssets = () => useRecoilState(assetsState);
